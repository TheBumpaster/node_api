import { Router } from 'express';
import SystemController from './controller';

/**
 * Group of unique system routes
 * @class SystemRouter
 */
class SystemRouter {
    /**
     * @variable {Router} router
     */
    private router: Router = Router();
    /**
     * @swagger
     * components:
     *   schemas:
     *     SuccessRequest:
     *       type: object
     *       properties:
     *         status:
     *           type: boolean
     *         message:
     *           type: string
     *       example:
     *         status: true
     *         message: Hello, world!
     *     ServerError:
     *       type: object
     *       properties:
     *         status:
     *           type: boolean
     *         message:
     *           type: string
     *       example:
     *         status: false,
     *         message: TypeError at line index.js:153:13
     */
    constructor() {
        /**
         * @swagger
         * /api/v1/:
         *   get:
         *     tags:
         *     - System
         *     description: |
         *      Returns Hello, world response in json
         *     responses:
         *       201:
         *         description: Response acknowledging successfully returned message
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/SuccessRequest'
         *       500:
         *         description: Response acknowledging internal server error
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ServerError'
         */
        this.router.get('/', SystemController.helloWorld);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default SystemRouter;
