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
import { EventEmitter } from 'events';

/**
 * Main expressJS class settings
 */
class Express {
    /**
     * @variable {Logger} logger
     */
    private logger = new Logger({ service: 'Express', filename: __filename });
    /**
     * @variable {Server} server
     */
    private server: Server;
    /**
     * @variable {Application} app
     */
    public app: Application;

    /**
     * Current state value 'initializing'|'ready'|'error'|'closed'
     * @variable {string} state
     */
    private state: string;

    /**
     * NodeJS Event Emiiter used to pipe events on init.
     * @variable {EventEmitter} emitter
     */
    private emmitter: EventEmitter = new EventEmitter();
    /**
     * Create and initialize express API routes
     */
    constructor(port: number) {
        // Initialize express
        this.app = express();
        this.setState('initializing');

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
            this.setState('ready');
        });
    }

    /**
     * Setter function
     * @param state
     */
    private setState(state: string): void {
        this.state = state;
        this.emmitter.emit(state);
    }

    /**
     * Closes the server connection
     */
    public close(): void {
        this.server.close((error) => {
            if (error) {
                this.logger.error('Could not close the server', error);
                this.setState('error');
            }
            this.logger.warn('Closing the server');
            this.setState('close');
        });
    }
    /**
     * On event callback function
     * @param state
     * @param callback
     */
    public on(state: string, callback?: () => unknown): void {
        this.emmitter.on(state, callback);
    }
}

export default Express;
