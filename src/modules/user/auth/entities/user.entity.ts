import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from '../../../events/event.entity';
import { Organization } from '../../../organizations/entities/organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  // New organization support
  @Column('uuid', { nullable: true })
  organizationId: string;

  @Column({ type: 'varchar', length: 20, default: 'member' })
  role: 'owner' | 'admin' | 'member';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Event, event => event.organizer)
  events: Event[];

  @ManyToOne(() => Organization, organization => organization.users)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
