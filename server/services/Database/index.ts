import Logger from '../Logger';
import * as mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

const logger = new Logger({ service: 'MongoDB', filename: __filename });

/**
 * Creates a connection with MongoDB Atlas with mongoose client
 * @function initializeMongooseDatabaseConnection
 */
export async function initializeMongooseDatabaseConnection(): Promise<mongoose.Mongoose | unknown> {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        mongoose.connection.on('connecting', () => {
            logger.warn('Connecting...');
        });

        mongoose.connection.on('connected', () => {
            logger.info('Connected!');
        });

        mongoose.connection.on('open', () => {
            logger.info('Connection opened!');
        });

        mongoose.connection.on('reconnected', () => {
            logger.warn('Reconnected!');
        });

        mongoose.connection.on('disconnected', () => {
            logger.error('Disconnected!');
        });

        mongoose.connection.on('error', (error) => {
            logger.error('Error occured', error);
        });

        if (process.env.NODE_ENV === 'testing') {
            const mockgoose = new Mockgoose(mongoose);
            await mockgoose.prepareStorage();

            return await mongoose.connect('mongodb://dummy.com/TestingDB', options);
        } else {
            return mongoose.connect(generateMongoDBURI(), options);
        }
    } catch (e) {
        return e;
    }
}

/**
 * Creates our connection uri
 * @function generateMongoDBURI
 */
export function generateMongoDBURI(): string {
    return `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jkwkc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
}
