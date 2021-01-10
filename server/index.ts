import Express from './services/Express/index';
import { initializeServerEnvironment } from './services/Environment';
import { initializeMongooseDatabaseConnection } from './services/Database';

// Initialize environment
initializeServerEnvironment();

// Initialize database connection
initializeMongooseDatabaseConnection();

/**
 * Initialize express server
 * @variable {Express} server
 */
const server = new Express(Number(process.env.PORT));

export default server;
