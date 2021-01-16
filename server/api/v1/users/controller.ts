import { Request, Response } from 'express';
import { UserModel } from '../../../models/user/index';
class UserController {
    /**
     * Query a list of users
     * @param request
     * @param response
     */
    public static async users(request: Request, response: Response) {
        try {
            // Transform query into object
            let query = {};
            if (request.query.query !== undefined) {
                query = UserController.transformQueryKeys(request.query.query as string);
            }

            const users = await UserModel.getUsers(
                query,
                request.query.skip ? Number(request.query.skip) : 0,
                request.query.limit ? Number(request.query.limit) : 10,
            );

            response.status(200);
            return response.json({
                status: true,
                result: users,
            });
        } catch (e) {
            response.status(500);
            return response.json({ error: e });
        }
    }
    /**
     * Create a new user
     * @param request
     * @param response
     */
    public static async newUser(request: Request, response: Response) {
        try {
        } catch (e) {
            response.status(500);
            return response.json({
                status: false,
                error: e,
            });
        }
    }

    /**
     * Update a user
     * @param request
     * @param response
     */
    public static async updateUser(request: Request, response: Response) {
        try {
        } catch (e) {
            response.status(500);
            return response.json({
                status: false,
                error: e,
            });
        }
    }

    /**
     * Delete a user
     * @param request
     * @param response
     */
    public static async deleteUser(request: Request, response: Response) {
        try {
        } catch (e) {
            response.status(500);
            return response.json({
                status: false,
                error: e,
            });
        }
    }

    private static transformQueryKeys(query: string): unknown {
        // {key:value},{key:value}
        // email:example@mail.com,username:JohnDoe
        const object = {};

        const list = query.split(',');
        for (const item of list) {
            const [key, value] = item.split(':');
            object[key] = value;
        }

        return object;
    }
}

export default UserController;
