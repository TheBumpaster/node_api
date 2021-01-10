import { Router } from 'express';
import UserController from './controller';

class UserRouter {
    private router: Router = Router();

    constructor() {
        this.router.get('/', UserController.users);
    }

    public getRouter() {
        return this.router;
    }
}

export default UserRouter;
