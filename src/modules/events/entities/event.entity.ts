import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Guest } from '../../guests/entities/guest.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column()
  location: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'int', nullable: true })
  maxGuests: number;

  @Column('uuid')
  organizerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.events)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @OneToMany(() => Guest, guest => guest.event)
  guests: Guest[];
}
