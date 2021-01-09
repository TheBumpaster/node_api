import { Application, Request, Response, NextFunction } from 'express';
import SystemRouter from './v1/system';
import UserRouter from './v1/users';

class ExpressRouter {
    public static initializeRouter(app: Application): void {
        app.use('/api/v1/', new SystemRouter().getRouter());
        app.use('/api/v1/users/', new UserRouter().getRouter());

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
