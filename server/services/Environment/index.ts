import * as dotenv from 'dotenv';

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
    }
}
