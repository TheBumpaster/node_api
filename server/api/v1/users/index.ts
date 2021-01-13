import { Router } from 'express';
import { authenticationMiddleware } from '../../middleware/auth';
import UserController from './controller';

class UserRouter {
    /**
     * @swagger
     * components:
     *   schemas:
     *     listOfUsers:
     *       type: object
     *       properties:
     *         status:
     *           type: boolean
     *         result:
     *           type: array
     *           items:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               email:
     *                 type: string
     *               _id:
     *                 type: string
     *               createdAt:
     *                 type: string
     *               updatedAt:
     *                 type: string
     */

    private router: Router = Router();

    constructor() {
        /**
         * @swagger
         * /api/v1/users/:
         *   get:
         *     tags:
         *     - Users
         *     description: |
         *      Returns a list of users by optional query
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         schema:
         *           type: string
         *         required: true
         *         description: JWT Token
         *       - in: query
         *         name: query
         *         schema:
         *           type: string
         *         required: false
         *         description: User filter keys and values ('...{[property]:[value]}' etc.. email:example@mail.com,username:TheBumpaster)
         *       - in: query
         *         name: skip
         *         schema:
         *           type: number
         *         description: Number of matches to skip from begging of query (default: 0)
         *       - in: query
         *         name: limit
         *         schema:
         *           type: number
         *         description: Number of matches in total to return (default: 10)
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

        this.router.get('/', authenticationMiddleware, UserController.users);
    }

    public getRouter() {
        return this.router;
    }
}

export default UserRouter;
