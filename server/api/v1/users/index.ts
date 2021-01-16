import { Router } from 'express';
import UserController from './controller';
import { requiresAuth } from 'express-openid-connect';

class UserRouter {
    /**
     * @swagger
     * components:
     *   schemas:
     *     newUser:
     *       type: object
     *       properties:
     *         username:
     *           type: string
     *         email:
     *           type: string
     *         password:
     *           type: string
     *         profile:
     *           type: object
     *           properties:
     *             dateOfBirth:
     *               type: string
     *             firstName:
     *               type: string
     *             lastName:
     *               type: string
     *             phoneNumber:
     *               type: number
     *             avatar:
     *               type: string
     *       required:
     *         - username
     *         - email
     *         - password
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
         *         description: Number of matches to skip from begging of query (default 0)
         *       - in: query
         *         name: limit
         *         schema:
         *           type: number
         *         description: Number of matches in total to return (default 10)
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

        this.router.get('/', requiresAuth, UserController.users);

        /**
         * @swagger
         * /api/v1/users/:
         *   post:
         *     tags:
         *     - Users
         *     description: |
         *      Creates a new user
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         schema:
         *           type: string
         *         required: true
         *         description: JWT Token
         *     requestBody:
         *       description: User Data
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/newUser'
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

        this.router.post('/', requiresAuth, UserController.users);
    }

    public getRouter() {
        return this.router;
    }
}

export default UserRouter;
