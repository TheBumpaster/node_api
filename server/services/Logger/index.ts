import { createLogger, Logger as wLogger, transports, format } from 'winston';
import { join } from 'path';

/**
 * User to log events on this process either in console, file or to send them to monitoring services
 * @class Logger
 */
class Logger {
    /**
     * Winston Logger for engine to with
     * @variable {wLogger} engine;
     */
    private engine: wLogger;

    /**
     * File logging metadata and environment to run with as optional
     * @param meta
     * @param env
     */
    constructor(meta: { service: string; filename: string }, env = process.env.NODE_ENV) {
        if (env === 'production') {
            this.engine = createLogger({
                level: 'warn',
                defaultMeta: {
                    env,
                },
                transports: [
                    new transports.File({
                        format: format.combine(format.label({ label: meta.filename }), format.json()),
                        dirname: join(__dirname, '../../log'),
                        filename: 'activity.log',
                        tailable: true,
                    }),
                ],
            });
        } else {
            const myFormat = format.printf(({ level, message, label, timestamp }) => {
                return `${timestamp} [${label}] ${level}: ${message}`;
            });

            const logFormat = format.combine(
                format.label({ label: meta.service, message: false }),
                format.timestamp(),
                format.colorize(),
                myFormat,
            );

            this.engine = createLogger({
                level: 'info',
                defaultMeta: {
                    service: meta.filename,
                    env,
                },
                transports: [
                    new transports.Console({
                        format: logFormat,
                    }),
                ],
            });
        }
    }

    /**
     * Log some information
     * @param message
     */
    public info(message: string): void {
        this.engine.log('info', message);
    }

    /**
     * Warn some important event happened
     * @param message
     */
    public warn(message: string): void {
        this.engine.log('warn', message);
    }

    /**
     * Alert that there has been an internal error, and log trace for better debugging
     * @param message
     * @param trace
     */
    public error(message: string, trace?: unknown): void {
        this.engine.log('error', message, trace);
    }
}

export default Logger;
