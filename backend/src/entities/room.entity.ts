import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryType } from '../types/types';
import { User } from './user.entity';

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

  @Column('json', { nullable: true, default: { mazeSize: 5, cellSize: 70 } })
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

  @ManyToOne(() => User, (user) => user.rooms, { onDelete: 'CASCADE' })
  owner: User;
}
