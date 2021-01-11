import http from 'k6/http';
import { group, check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('check_failure_rate');

export let options = {
    stages: [
        { duration: '10s', target: 100 }, // below normal load
        { duration: '1m', target: 100 },
        { duration: '10s', target: 1400 }, // spike to 1400 users
        { duration: '3m', target: 1400 }, // stay at 1400 for 3 minutes
        { duration: '10s', target: 100 }, // scale down. Recovery stage.
        { duration: '3m', target: 100 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<5000'],
        'http_req_duration{staticAsset:yes}': ['p(99)<1850'],
        check_failure_rate: ['rate<0.01', { threshold: 'rate<=0.05', abortOnFail: true }],
    },
};

export function setup() {}
export default function (data) {
    let response = http.get('https://nodejs-api-stage.herokuapp.com/api/v1/');

    // check() returns false if any of the specified conditions fail
    let checkRes = check(response, {
        'status is 200': (r) => r.status === 200,
    });

    // We reverse the check() result since we want to count the failures
    failureRate.add(!checkRes);

    // Load static assets, all requests
    group('Static Assets', function () {
        // Execute multiple requests in parallel like a browser, to fetch some static resources
        let resps = http.batch([
            [
                'GET',
                'https://nodejs-api-stage.herokuapp.com/typedocs/index.html',
                null,
                { tags: { staticAsset: 'yes' } },
            ],
            [
                'GET',
                'https://nodejs-api-stage.herokuapp.com/typedocs/modules.html',
                null,
                { tags: { staticAsset: 'yes' } },
            ],
            ['GET', 'https://nodejs-api-stage.herokuapp.com/docs', null, { tags: { staticAsset: 'yes' } }],
        ]);
        // Combine check() call with failure tracking
        failureRate.add(
            !check(resps, {
                'status is 200': (r) => r[0].status === 200 && r[1].status === 200,
                'reused connection': (r) => r[0].timings.connecting == 0,
            }),
        );
    });
}

export function teardown(data) {}
