import { Repository } from 'typeorm';

import { appDataSource } from '../config/app-data-source';
import { User } from '../entities';

export default class UserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = appDataSource.getRepository(User);
  }

  async singUp(userName: string): Promise<User> {
    const checkName = await this.findUserByName(userName);

    if (checkName) {
      throw new Error(`User with name ${userName} already exists`);
    }

    const user: User = await this.userRepository.save({
      name: userName
    });

    return user;
  }

  async signIn(userName: string): Promise<User> {
    return await this.findUserByName(userName);
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findUserByName(payload: string | undefined) {
    const user = await this.userRepository.findOne({ where: { name: payload } });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}