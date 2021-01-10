import { Request, Response } from 'express';
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
    public static async helloWorld(request: Request, response: Response): Promise<unknown> {
        try {
            //
            response.status(200);
            return response.json({
                status: true,
                message: 'Hello, world!',
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
