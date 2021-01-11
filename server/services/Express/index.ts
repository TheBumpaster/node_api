import * as express from 'express';
import { Application } from 'express';
import { Server } from 'http';
import ExpressRouter from '../../api/router';
import Logger from '../Logger';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as compression from 'compression';
import { json, urlencoded } from 'body-parser';
import * as session from 'express-session';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MongoDBStore = require('connect-mongodb-session')(session);
import { generateMongoDBURI } from '../Database';

/**
 * Main expressJS class settings
 */
class Express {
    /**
     * @variable {Logger} logger
     */
    private logger = new Logger({ service: 'Express', filename: __filename });

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
    constructor(port: number) {
        // Initialize express
        this.app = express();

        // Add security checks
        this.app.disable('x-powered-by');
        this.app.use(helmet.hidePoweredBy());
        this.app.use(helmet.xssFilter());

        this.app.use(cors());
        this.app.use(json({ limit: '501mb' }));
        this.app.use(compression());
        this.app.use(urlencoded({ limit: '501mb', extended: false }));

        // Create database store client for session
        // Handle sessions for security
        this.app.use(
            session({
                secret: process.env.SECRET,
                resave: true,
                saveUninitialized: true,
                cookie: {
                    secure: true,
                },
                store:
                    process.env.NODE_ENV !== 'testing'
                        ? new MongoDBStore({
                              uri: generateMongoDBURI(),
                              collection: 'sessions',
                              expires: 1000 * 60 * 60 * 24 * 1, // 1 day in milliseconds
                              connectionOptions: {
                                  useNewUrlParser: true,
                                  useUnifiedTopology: true,
                                  serverSelectionTimeoutMS: 10000,
                              },
                          })
                        : undefined,
            }),
        );

        // Add API Router
        ExpressRouter.initializeRouter(this.app);

        this.initialize(port);
    }

    /**
     *
     * Start listening to specific port and creates a server instance
     * @param port
     */
    private initialize(port: number): void {
        this.server = this.app.listen(port, () => {
            this.logger.info(`App is up and running on port ${port}`);
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
