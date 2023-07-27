import { Application } from 'express';
import roomsRouter from './room.route';
import userRouter from './user.route';

class AppRouter {
  constructor(private app: Application) { }

  init() {
    this.app.get('/', (_req, res) => {
      res.send('API Running');
    });
    this.app.use('/rooms', roomsRouter);
    this.app.use('/user', userRouter);
  }
}

export default AppRouter;