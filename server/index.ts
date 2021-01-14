import Express from './services/Express/index';
import { initializeServerEnvironment } from './services/Environment';
import { initializeMongooseDatabaseConnection } from './services/Database';

// Initialize environment
initializeServerEnvironment();
require('newrelic');

/**
 * Initialize express server
 * @variable {Express} server
 */
const server = new Express(Number(process.env.PORT));

// Initialize database connection
server.on('running', () => {
    initializeMongooseDatabaseConnection().then(() => {
        server.setState('ready');
    });
});

export default { server };
