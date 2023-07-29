import { Repository } from 'typeorm';
import { appDataSource } from '../config/app-data-source.js';
import { CreateRoomType, RoomInfoType } from '../types/index.js';
import { Room } from '../entities/index.js';
import { removeMazeFromRoom } from '../helpers/index.js';
import UserService from './user.service.js';

export default class RoomService {
  private readonly roomRepository: Repository<Room>;
  private readonly userService = new UserService();

  constructor() {
    this.roomRepository = appDataSource.getRepository(Room);
  }

  async create(roomData: CreateRoomType): Promise<RoomInfoType> {
    const user = await this.userService.findUserByName(roomData.userName);

    if (!user) {
      throw new Error('User not found, reload your page');
    }

    const room: Room = await this.roomRepository.save({
      name: roomData.name,
      config: {
        cellSize: roomData.cellSize,
        mazeSize: roomData.mazeSize,
      },
      players: [user],
      owner: user,
    });

    return removeMazeFromRoom(room) as RoomInfoType;
  }

  async join({ roomId, userName }: { roomId: string; userName: string }): Promise<RoomInfoType> {
    const user = await this.userService.findUserByName(userName);
    const currentRoom = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['owner'],
    });

    if (!currentRoom || !user) {
      throw new Error('Internar Error,  reload your page');
    }

    const { players, ...restRoom } = currentRoom;

    await this.roomRepository.update(roomId, {
      ...restRoom,
      players: [...players, user ],
    });

    const updatedRoom = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['owner'],
    });

    if (!updatedRoom) {
      throw new Error(`Can't join room!`);
    }

    return removeMazeFromRoom(updatedRoom) as RoomInfoType;
  }

  async update(roomId: string, room: Partial<Room>): Promise<RoomInfoType> {
    await this.roomRepository.update(roomId, room);

    const updatedRoom = await this.roomRepository.findOne({
      where: { id: room.id },
      relations: ['owner'],
    });

    if (!updatedRoom) {
      throw new Error(`Can't update room!`);
    }

    return removeMazeFromRoom(updatedRoom) as RoomInfoType;
  }

  async delete(roomId: string): Promise<Room[]> {
    await this.roomRepository.delete(roomId);
    const rooms = await this.findAll();

    return rooms;
  }

  async findAll() {
    const rooms = await this.roomRepository.find({ relations: ['owner'] });
    return rooms;
  }

  async findRoomById(payload: string) {
    const room = await this.roomRepository.findOne({
      where: { id: payload },
    });

    if (!room) {
      throw new Error(`Room not found!`);
    }

    return room;
  }
}