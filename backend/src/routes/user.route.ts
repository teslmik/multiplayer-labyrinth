import { Router } from 'express';
import userController from '../controllers/user.controller';

const router: Router = Router();

router.get('', userController.getAllUsers.bind(userController));
router.get('/me', userController.getOneUserByName.bind(userController));
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

export default router;
