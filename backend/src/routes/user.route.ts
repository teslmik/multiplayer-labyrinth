import { Router } from 'express';
import { tryCatchMiddleware } from '../middlewares/try-catch.middleware.js';
import userController from '../controllers/user.controller.js';

const router: Router = Router();

router.get('', tryCatchMiddleware(userController.getAllUsers.bind(userController)));
router.get('/me', tryCatchMiddleware(userController.getOneUserByName.bind(userController)));
router.post('/register', tryCatchMiddleware(userController.register.bind(userController)));
router.post('/login', tryCatchMiddleware(userController.login.bind(userController)));

export default router;
