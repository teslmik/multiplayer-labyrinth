import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CellPosType } from "../types/index.js";
import { Room } from "./room.entity.js";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  socketId: string;

  @Column()
  name: string;

  @Column({ default: false })
  canMove: boolean;

  @Column('json', { nullable: true })
  startPoint: CellPosType | null;

  @Column('json', { nullable: true })
  finishPoint: CellPosType | null;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date;

  @OneToMany(() => Room, (room) => room.owner)
  rooms: Room[];
}