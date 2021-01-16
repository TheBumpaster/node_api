import { Response } from 'express';
import { OpenidRequest } from 'express-openid-connect';

/**
 * Handles methods for related requests of group of system router
 * @class SystemController
 */
class SystemController {
    /**
     * Returns response contaning json
     * @param request
     * @param response
     * @returns Promise
     */
    public static async helloWorld(request: OpenidRequest, response: Response): Promise<unknown> {
        try {
            //
            response.status(200);
            return response.json({
                status: true,
                message: 'Hello, world!',
                isAuthenticated: request.oidc.isAuthenticated(),
            });
        } catch (e) {
            response.status(500);
            return response.json({
                status: false,
                message: e,
            });
        }
    }
}

export default SystemController;
