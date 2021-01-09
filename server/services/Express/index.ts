import * as express from 'express';
import { Application } from 'express';
import { Server } from 'http';
import ExpressRouter from '../../api/router';
import Logger from '../Logger';

/**
 * Main expressJS class settings
 */
class Express {
    /**
     * @variable {Logger} logger
     */
    private logger = new Logger({ filename: __filename });

    /**
     * @variable {Application} app
     */
    public app: Application;
    /**
     * @variable {Server} server
     */
    private server: Server;

    /**
     * Create and initialize express API routes
     */
    constructor() {
        // Initialize express
        this.app = express();

        // Add security checks

        // Add API Router
        ExpressRouter.initializeRouter(this.app);

        this.initialize();
    }

    /**
     * Start listening to specific port and creates a server instance
     */
    private initialize(): void {
        this.server = this.app.listen(Number(process.env.port), () => {
            this.logger.info(`App is up and running on port ${process.env.port}`);
        });
    }

    /**
     * Closes the server connection
     */
    public close(): void {
        this.server.close((error) => {
            if (error) {
                this.logger.error('Could not close the server', error);
            }
            this.logger.warn('Closing the server');
        });
    }
}

export default Express;
