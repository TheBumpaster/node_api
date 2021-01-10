import { Application, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as glob from 'glob';
import * as swaggerJSDoc from 'swagger-jsdoc';
import { join } from 'path';
import SystemRouter from './v1/system';
import UserRouter from './v1/users';
import * as swaggerUi from 'swagger-ui-express';

class ExpressRouter {
    public static initializeRouter(app: Application): void {
        app.use('/api/v1/', new SystemRouter().getRouter());
        app.use('/api/v1/users/', new UserRouter().getRouter());

        /**
         * Searches through project files for API definitions and generates json
         * @param request
         * @param response
         */
        app.use('/api/v1/docs', (request, response) => {
            glob(join(__dirname, './v1/**/*.ts'), (err: unknown, urls: unknown[]) => {
                const options = {
                    apis: urls,
                    swaggerDefinition: {
                        info: {
                            description: `Main API Documentation`,
                            title: 'Swagger API Docs',
                            version: '1.0.0',
                        },
                        openapi: '3.0.0',
                    },
                };
                response.setHeader('Content-Type', 'application/json');
                response.send(swaggerJSDoc(options));
            });
        });

        /**
         * Create UI page for swagger
         */
        const uriV1 =
            process.env.NODE_ENV !== 'development'
                ? `${process.env.HOST}/api/v1/docs`
                : `${process.env.HOST}:${process.env.PORT}/api/v1/docs`;
        app.use(
            '/docs',
            swaggerUi.serve,
            swaggerUi.setup(null, {
                swaggerOptions: {
                    urls: [
                        {
                            url: uriV1,
                            name: 'V1 API Specification',
                        },
                    ],
                },
            }),
        );

        /**
         * Create UI Page for typedoc
         */
        app.use('/typedocs', express.static(join(__dirname, '../../docs/')));

        // Any not defined path request
        app.use(function (req: Request, res: Response, next: NextFunction) {
            return res.status(404).send({
                status: false,
                message: `Route '${req.url}' not found.`,
            });
        });

        // 500 - Any server error
        app.use(function (err, req: Request, res: Response, next: NextFunction) {
            return res.status(500).send({
                status: false,
                message: 'Internal Server Error',
                error: err,
            });
        });
    }
}

export default ExpressRouter;
