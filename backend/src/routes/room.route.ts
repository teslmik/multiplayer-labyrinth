import { Router } from 'express';
import { tryCatchMiddleware } from '../middlewares/try-catch.middleware';
import roomController from '../controllers/room.controller';

const router: Router = Router();

router.get('', tryCatchMiddleware(roomController.getAllRooms.bind(roomController)));
router.post('/new', tryCatchMiddleware(roomController.create.bind(roomController)));
router.post('/join', tryCatchMiddleware(roomController.join.bind(roomController)));

export default router;