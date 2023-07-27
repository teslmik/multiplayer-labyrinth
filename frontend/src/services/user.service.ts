import { AxiosResponse } from 'axios';
import { APP_KEYS } from '../constants';
import { UserType } from '../types';
import api from './http.service';

class UserService {
  static async login(userName: string): Promise<AxiosResponse<UserType>> {
    return api.post<UserType>(
      `${APP_KEYS.BACKEND_KEYS.USER}${APP_KEYS.BACKEND_KEYS.LOGIN}`,
      { userName },
    );
  }

  static async registration(
    userName: string,
  ): Promise<AxiosResponse<UserType>> {
    return api.post<UserType>(
      `${APP_KEYS.BACKEND_KEYS.USER}${APP_KEYS.BACKEND_KEYS.REGISTER}`,
      { userName },
    );
  }

  static async getUser(
    userName: string,
  ): Promise<AxiosResponse<UserType>> {
    return api.get<UserType>(
      `${APP_KEYS.BACKEND_KEYS.USER}${APP_KEYS.BACKEND_KEYS.ME}`,
      {
        params: userName
      },
    );
  }

}

export { UserService };