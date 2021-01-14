import { Request, Response } from 'express';
import * as Joi from 'joi';
import { UserModel } from '../../../models/user';
import { sign } from 'jsonwebtoken';
import { hashPassword } from '../../middleware/password';
import { IAuthSession } from '../../middleware/auth';

/**
 * Handles methods for related requests of group of auth router
 * @class AuthController
 */
class AuthController {
    /**
     * Creates new user and provides jwt and access token
     * @param request
     * @param response
     * @returns Promise
     */
    public static async register(request: Request, response: Response): Promise<unknown> {
        // Check request body
        if (!request.body.email || !request.body.password || !request.body.username) {
            response.status(400);
            response.json({
                status: false,
                message: 'Please provide email, password and username.',
            });
        }
        try {
            // Validate payload
            const validate = await AuthController.checkRegisterPayload(request.body);
            if (validate.details) {
                response.status(400);
                return response.json({
                    status: false,
                    message: validate.details[0].message,
                });
            }

            // Check if user already exists
            const userExistsEmail = await UserModel.getUserByEmail(request.body.email);
            if (userExistsEmail) {
                response.status(400);
                return response.json({
                    status: false,
                    message: 'User already exists with this email',
                });
            }
            const userExistsUsername = await UserModel.getUserByUsername(request.body.username);
            if (userExistsUsername) {
                response.status(400);
                return response.json({
                    status: false,
                    message: 'User already exists with this username',
                });
            }

            // Hash user password
            const payload = {
                username: request.body.username,
                email: request.body.email,
                password: hashPassword(request.body.password),
            };
            const user = await UserModel.createUser(payload);

            // handle session for refresh token & jwt
            const token = hashPassword(new Date().toDateString());

            (request.session as IAuthSession).user = {
                _id: user._id,
                token,
            };
            request.session.save();
            const jwt = sign(
                {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                },
                process.env.SECRET,
                { expiresIn: '10min' },
            );

            response.status(201);
            return response.json({
                status: true,
                jwt,
                token,
            });
        } catch (e) {
            response.status(500);
            return response.json({
                status: false,
                message: e,
            });
        }
    }

    /**
     * Logs in a user and provides jwt and access token
     * @param request
     * @param response
     * @returns Promise
     */
    public static async login(request: Request, response: Response): Promise<unknown> {
        if (!request.body.email || !request.body.password) {
            response.status(400);
            response.json({
                status: false,
                message: 'Please provide email and password.',
            });
        }
        try {
            // Validate payload
            const validate = await AuthController.checkLoginPayload(request.body);
            if (validate.details) {
                response.status(400);
                return response.json({
                    status: false,
                    message: validate.details[0].message,
                });
            }

            // Check if user already exists
            const user = await UserModel.getUserByEmail(request.body.email);
            if (!user) {
                response.status(400);
                return response.json({
                    status: false,
                    message: 'User does not exist with this email',
                });
            }
            // handle session for refresh token & jwt
            const token = hashPassword(new Date().toDateString());

            (request.session as IAuthSession).user = {
                _id: user._id,
                token,
            };
            request.session.save();

            const jwt = sign(
                {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                },
                process.env.SECRET,
                { expiresIn: '10min' },
            );

            response.status(200);
            return response.json({
                status: true,
                jwt,
                token,
            });
        } catch (e) {
            response.status(500);
            return response.json({
                status: false,
                message: e,
            });
        }
    }

    /**
     * Logs out a user and clears access token
     * @param request
     * @param response
     * @returns Promise
     */
    public static async logout(request: Request, response: Response): Promise<unknown> {
        try {
            request.session.destroy((error) => {
                if (error) {
                    response.status(501);
                    return response.json({
                        status: false,
                        message: error,
                    });
                }
            });
            response.status(200);
            response.end();
        } catch (e) {
            response.status(500);
            return response.json({
                status: false,
                error: e,
            });
        }
    }

    public static async refresh(request: Request, response: Response): Promise<unknown> {
        console.log(request.session);
        if (!request.header('Authorization')) {
            response.status(403);
            return response.json({
                status: false,
                message: 'Invalid access token',
            });
        }
        try {
            const access_token = request.header('Authorization');

            if ((request.session as IAuthSession).user.token === access_token) {
                const user = await UserModel.getUserById((request.session as IAuthSession).user._id);
                const jwt = sign(
                    {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                    },
                    process.env.SECRET,
                    { expiresIn: '10min' },
                );

                response.status(200);
                return response.json({
                    status: true,
                    jwt,
                });
            } else {
                response.status(403);
                return response.json({
                    status: false,
                    message: 'Invalid access token',
                });
            }
        } catch (e) {
            response.status(500);
            return response.json({
                status: false,
                error: e,
            });
        }
    }

    private static async checkRegisterPayload(payload: unknown) {
        try {
            const userObjectScheme = Joi.object({
                email: Joi.string().email({ minDomainSegments: 2 }).messages({
                    'string.base': 'Email must be type of string.',
                    'string.empty': 'Email can not be empty.',
                    'string.email': 'Email must be valid.',
                    'any.required': 'Email is required property.',
                }),
                username: Joi.string().required().messages({
                    'string.base': 'Username must be type of string.',
                    'string.empty': 'Username can not be empty.',
                    'any.required': 'Username is required property.',
                }),
                password: Joi.string()
                    .required()
                    .min(8)
                    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
                    .messages({
                        'string.base': 'Password must be type of string.',
                        'string.empty': 'Password can not be empty.',
                        'string.min': 'Password should be at least 8 characters long.',
                        'string.pattern.base':
                            'Password should contain at least 1 uppercase character, 1 lowercase character and 1 number.',
                        'any.required': 'Password is required property.',
                    }),
            });

            return await userObjectScheme.validateAsync(payload);
        } catch (e) {
            return e;
        }
    }
    private static async checkLoginPayload(payload: unknown) {
        try {
            const userObjectScheme = Joi.object({
                email: Joi.string().email({ minDomainSegments: 2 }).messages({
                    'string.base': 'Email must be type of string.',
                    'string.empty': 'Email can not be empty.',
                    'string.email': 'Email must be valid.',
                    'any.required': 'Email is required property.',
                }),
                password: Joi.string()
                    .required()
                    .min(8)
                    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
                    .messages({
                        'string.base': 'Password must be type of string.',
                        'string.empty': 'Password can not be empty.',
                        'string.min': 'Password should be at least 8 characters long.',
                        'string.pattern.base':
                            'Password should contain at least 1 uppercase character, 1 lowercase character and 1 number.',
                        'any.required': 'Password is required property.',
                    }),
            });

            return await userObjectScheme.validateAsync(payload);
        } catch (e) {
            return e;
        }
    }
}

export default AuthController;
