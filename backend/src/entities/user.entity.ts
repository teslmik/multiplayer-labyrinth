
import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CellPosType } from "../types/types.js";
import { Room } from "./index.js";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToMany(() => Room, (room) => room.players)
  @JoinTable()
  rooms: Room[];
}