import { Router } from 'express';
import SystemController from './controller';

class SystemRouter {
    private router: Router = Router();

    constructor() {
        this.router.get('/', SystemController.helloWorld);
    }

    public getRouter() {
        return this.router;
    }
}

export default SystemRouter;
