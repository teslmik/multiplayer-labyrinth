import { Response, Request, NextFunction } from 'express';
import UserService from '../services/user.service';

export class UserController {
  constructor(private userService: UserService) { }

  async register(req: Request, res: Response, next: NextFunction) {
    const userName: string = req.body.userName;

    const userData = await this.userService.singUp(userName);
    res.status(201).json(userData);

    next();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const userName: string = req.body.userName;
    const userData = await this.userService.signIn(userName);

    res.json(userData);

    next();
  }

  async getAllUsers(_: Request, res: Response) {
    const users = await this.userService.findAll();
    res.json(users);
  }

  async getOneUserByName(req: Request, res: Response) {
    const user = await this.userService.findUserByName(req.body.name);

    if (!user) {
      throw new Error('User not found');
    }

    res.json(user);
  }
}

const userController = new UserController(new UserService());
export default userController;