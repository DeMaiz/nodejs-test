import UserController from '../controllers/UserController';
import { BaseRoutes } from './BaseRoutes';
import { checkJwt } from '../middlewares/checkJwt';


export class UserRoutes extends BaseRoutes {
    private userController: UserController;

    public constructor() {
        super();
        this.userController = new UserController();
        this.routes();
    }

    public routes(): void {
        this.router.post('/', this.userController.newUser);
        this.router.get('/', this.userController.listAll); // add authorization by [checkJwt]
        this.router.get('/:id', this.userController.getOne);
    }
}
