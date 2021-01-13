import * as dotenv from 'dotenv';
import { createRandomHash } from '../../api/middleware/password';

/**
 * Set environment variables on start
 */
export function initializeServerEnvironment(): void {
    if (process.env.NODE_ENV === 'production') {
        // should be set by container
    } else if (process.env.NODE_ENV === 'development') {
        // call local .env file
        dotenv.config();
    } else {
        // some testing
        process.env.port = '3003';
        process.env.NODE_ENV = 'testing';
        process.env.SECRET = createRandomHash();
        process.env.NEW_RELIC_ENABLED = 'false';
    }
}
