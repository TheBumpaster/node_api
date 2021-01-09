import { Request, Response } from 'express';

class SystemController {
    public static async helloWorld(request: Request, response: Response) {
        try {
            //
            response.status(200);
            return response.json({
                message: 'Hello, world!',
            });
        } catch (e) {
            response.status(500);
            return response.json({ error: e });
        }
    }
}

export default SystemController;
