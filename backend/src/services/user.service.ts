import { Repository } from 'typeorm';

import { appDataSource } from '../config/app-data-source.js';
import { User } from '../entities/index.js';

export default class UserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = appDataSource.getRepository(User);
  }

  async singUp(userName: string): Promise<User> {
    const checkName = await this.userRepository.findOne({ where: { name: userName } });

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

  async update(socketId: string, userName: string): Promise<User> {
    const user = await this.findUserByName(userName);

    await this.userRepository.update(user.id, { socketId });
    const updateUser = await this.findUserByName(userName);

    return updateUser;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findUserByName(name: string | undefined) {
    const user = await this.userRepository.findOne({ where: { name } });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}