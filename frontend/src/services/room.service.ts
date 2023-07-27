import { AxiosResponse } from 'axios';
import { APP_KEYS } from '../constants';
import { RoomInfoType } from '../types';
import api from './http.service';

class RoomService {
  static async create(roomData: {
    userName: string | null
    name: string;
    cellSize: number;
    mazeSize: number;
  }): Promise<AxiosResponse<RoomInfoType>> {
    return api.post<RoomInfoType>(
      `${APP_KEYS.BACKEND_KEYS.ROOMS}${APP_KEYS.BACKEND_KEYS.NEW}`,
      { roomData },
    );
  }

  static async join(roomId: string, userName: string | null): Promise<AxiosResponse<RoomInfoType>> {
    return api.post<RoomInfoType>(
      `${APP_KEYS.BACKEND_KEYS.ROOMS}${APP_KEYS.BACKEND_KEYS.JOIN}`,
      { roomId, userName },
    );
  }

  static async getAllRooms(): Promise<AxiosResponse<RoomInfoType[]>> {
    return api.get(`${APP_KEYS.BACKEND_KEYS.ROOMS}`);
  }
}

export { RoomService };