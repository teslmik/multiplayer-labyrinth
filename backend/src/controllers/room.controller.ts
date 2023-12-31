import { Response, Request, NextFunction } from 'express';
import { CreateRoomType } from '../types/index.js';
import RoomService from '../services/room.service.js';

export class RoomController {
  constructor(private roomService: RoomService) { }

  async create(req: Request, res: Response, next: NextFunction) {
    const roomData: CreateRoomType = req.body.roomData;
    const newRoom = await this.roomService.create(roomData);

    res.status(201).json(newRoom);

    next();
  }

  async join(req: Request, res: Response, next: NextFunction) {
    const { roomId, userName }: { roomId: string, userName: string } = req.body;

    const newRoom = await this.roomService.join({ roomId, userName });

    res.status(201).json(newRoom);

    next();
  }

  async getAllRooms(_: Request, res: Response) {
    const rooms = await this.roomService.findAll();
    res.json(rooms);
    
  }

  async getOneRoomByName(req: Request, res: Response) {
    const room = await this.roomService.findRoomById(req.body.roomId);
    res.json(room);
  }
}

const roomController = new RoomController(new RoomService());
export default roomController;