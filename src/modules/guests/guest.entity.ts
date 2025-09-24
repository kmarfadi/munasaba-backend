import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Event } from '../events/event.entity';

@Entity('guests')
@Index(['eventId', 'checkedIn', 'checkInTime'])
@Index(['email', 'eventId'])
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column('uuid')
  @Index()
  eventId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  @Index()
  checkedIn: boolean;

  @Column({ default: false })
  checkedOut: boolean;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  checkInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutTime: Date;

  // New fields for better tracking
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'varchar', length: 20, default: 'registered' })
  status: 'registered' | 'checked-in' | 'checked-out' | 'no-show';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Event, event => event.guests)
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
