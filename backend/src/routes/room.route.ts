import { Router } from 'express';
import { tryCatchMiddleware } from '../middlewares/try-catch.middleware.js';
import roomController from '../controllers/room.controller.js';

const router: Router = Router();

router.get('', tryCatchMiddleware(roomController.getAllRooms.bind(roomController)));
router.post('/new', tryCatchMiddleware(roomController.create.bind(roomController)));
router.post('/join', tryCatchMiddleware(roomController.join.bind(roomController)));

export default router;