import { Request, Response, NextFunction } from 'express';
import { Session } from 'express-session';
import { verify } from 'jsonwebtoken';
import { IUser } from '../../models/user';

export interface IAuthRequest extends Request {
    user: IUser;
}
export interface IAuthSession extends Session {
    user: { _id: string; token: string };
}
export function authenticationMiddleware(request: IAuthRequest, response: Response, next: NextFunction): unknown {
    const token = request.header('Authorization');

    if (!token) {
        response.status(401);
        return response.json({
            status: false,
            message: 'You need to be authorized.',
        });
    }

    verify(token, process.env.SECRET, (error, user) => {
        if (error) {
            response.status(401);
            return response.json({
                status: false,
                message: 'Invalid token.',
            });
        }

        if (!user) {
            response.status(401);
            return response.json({
                status: false,
                message: 'Invalid token.',
            });
        }
        request.user = user;
        next();
    });
}
