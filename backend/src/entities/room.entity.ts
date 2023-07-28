import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryType } from '../types/index.js';
import { User } from './user.entity.js';

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json', { default: [] })
  players: User[];

  @Column()
  name: string;

  @Column({ default: false })
  isGameStarted: boolean;

  @Column({ default: false })
  isGameEnd: boolean;

  @Column('json', { nullable: true })
  config: { mazeSize: number; cellSize: number };

  @Column('json', { default: [[]] })
  maze: boolean[][];

  @Column('json', { default: [] })
  history: HistoryType[];

  @Column({
    type: 'timestamp',
    default: () => 'NOW()',
  })
  createdAt: string;

  @ManyToOne(() => User, (user) => user.rooms, { cascade: true })
  owner: User;
}
