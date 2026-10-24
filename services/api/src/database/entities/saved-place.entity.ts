// ============================================================
// Entity: SavedPlace
// Represents saved passenger locations (Casa, Trabalho, Favorito, etc.)
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('saved_places')
export class SavedPlace {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36 })
  userId!: string;

  @ManyToOne(() => User, (user) => user.savedPlaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'varchar', length: 50 })
  label!: string; // 'Casa' | 'Trabalho' | 'Favorito' | custom

  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @Column({ type: 'float' })
  lat!: number;

  @Column({ type: 'float' })
  lng!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
