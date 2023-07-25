
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { HistoryType } from "../types/types.js";
import { User } from "./index.js";

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  name: string;

  @Column({ default: false })
  isGameStarted: boolean;

  @Column({ default: false })
  isGameEnd: boolean;

  @Column('json')
  config: { mazeSize: number; cellSize: number };

  @Column('json', { array: true })
  maze: boolean[][];

  @Column('json', { array: true })
  history: HistoryType[];

  @Column({
    type: 'timestamp',
    default: () => 'NOW()'
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.rooms)
  players: User[];
}
