import Express from './services/Express/index';
import { initializeServerEnvironment } from './services/Environment';

// Initialize environment
initializeServerEnvironment();

// Initialize database connection

/**
 * Initialize express server
 * @variable {Express} server
 */
const server = new Express();

export default server;
