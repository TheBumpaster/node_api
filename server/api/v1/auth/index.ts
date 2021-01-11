import { Router } from 'express';
import AuthController from './controller';

/**
 * Group of unique auth routes
 * @class AuthRouter
 */
class AuthRouter {
    /**
     * @variable {Router} router
     */
    private router: Router = Router();
    /**
     * @swagger
     * components:
     *   schemas:
     *     SuccessAuthRequest:
     *       type: object
     *       properties:
     *         status:
     *           type: boolean
     *         jwt:
     *           type: string
     *         token:
     *           type: string
     *       example:
     *         status: true
     *         jwt:
     *         token:
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
         * /api/v1/auth/register:
         *   post:
         *     tags:
         *     - Authorization
         *     description: |
         *      Creates new user and generates jwt and access token
         *     responses:
         *       201:
         *         description: Response acknowledging successfully returned message
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/SuccessAuthRequest'
         *       400:
         *         description: Response acknowledging bad payload
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ServerError'
         *       500:
         *         description: Response acknowledging internal server error
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ServerError'
         */
        this.router.post('/register', AuthController.register);

        /**
         * @swagger
         * /api/v1/auth/login:
         *   post:
         *     tags:
         *     - Authorization
         *     description: |
         *      Creates a new session, checks users credentials and generates new jwt and access token.
         *     responses:
         *       200:
         *         description: Response acknowledging successfully returned message
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/SuccessAuthRequest'
         *       400:
         *         description: Response acknowledging bad payload
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ServerError'
         *       500:
         *         description: Response acknowledging internal server error
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ServerError'
         */
        this.router.post('/login', AuthController.login);

        /**
         * @swagger
         * /api/v1/auth/logout:
         *   delete:
         *     tags:
         *     - Authorization
         *     description: |
         *      Destroys a session, would not be able to refresh jwt token
         *     responses:
         *       200:
         *         description: Response acknowledging successfully returned message
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/SuccessAuthRequest'
         *       400:
         *         description: Response acknowledging bad payload
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ServerError'
         *       500:
         *         description: Response acknowledging internal server error
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ServerError'
         */
        this.router.delete('/logout', AuthController.logout);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default AuthRouter;
