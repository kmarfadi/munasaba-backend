import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { User } from '../user/auth/entities/user.entity';
import { Guest } from '../guests/guest.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Entity('events')
@Index(['organizerId', 'startDate'])
@Index(['startDate', 'isActive'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  @Index()
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
  @Index()
  organizerId: string;

  // New scalability fields
  @Column({ default: true })
  @Index()
  isActive: boolean;

  @Column({ default: 0 })
  guestCount: number; // Denormalized for performance

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Flexible data storage

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  @Index()
  status: 'draft' | 'published' | 'cancelled' | 'completed';

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.events)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @OneToMany(() => Guest, guest => guest.event)
  guests: Guest[];

  @ManyToOne(() => Organization, organization => organization.events)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
