import { DataSource } from 'typeorm';
import { User } from '../../modules/user/auth/entities/user.entity';
import { Organization } from '../../modules/organizations/entities/organization.entity';
import { hash } from 'bcrypt';

export class UsersSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);
    const organizationRepository = this.dataSource.getRepository(Organization);

    // Check if users already exist
    const existingCount = await userRepository.count();
    if (existingCount > 0) {
      console.log(`✅ Users already seeded (${existingCount} found)`);
      return;
    }

    // Get organizations for user assignment
    const organizations = await organizationRepository.find();
    if (organizations.length === 0) {
      console.log('⚠️ No organizations found. Run organizations seeder first.');
      return;
    }

    const hashedPassword = await hash('password123', 10);

    const users = [
      {
        email: 'admin@techcorp.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Admin',
        isActive: true,
        organizationId: organizations.find(org => org.slug === 'techcorp-inc')?.id,
        role: 'owner' as const,
      },
      {
        email: 'manager@techcorp.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Manager',
        isActive: true,
        organizationId: organizations.find(org => org.slug === 'techcorp-inc')?.id,
        role: 'admin' as const,
      },
      {
        email: 'user@techcorp.com',
        password: hashedPassword,
        firstName: 'Bob',
        lastName: 'User',
        isActive: true,
        organizationId: organizations.find(org => org.slug === 'techcorp-inc')?.id,
        role: 'member' as const,
      },
      {
        email: 'admin@eventmasters.com',
        password: hashedPassword,
        firstName: 'Alice',
        lastName: 'EventMaster',
        isActive: true,
        organizationId: organizations.find(org => org.slug === 'event-masters')?.id,
        role: 'owner' as const,
      },
      {
        email: 'coordinator@eventmasters.com',
        password: hashedPassword,
        firstName: 'Charlie',
        lastName: 'Coordinator',
        isActive: true,
        organizationId: organizations.find(org => org.slug === 'event-masters')?.id,
        role: 'admin' as const,
      },
      {
        email: 'organizer@startuphub.com',
        password: hashedPassword,
        firstName: 'David',
        lastName: 'Organizer',
        isActive: true,
        organizationId: organizations.find(org => org.slug === 'startup-hub')?.id,
        role: 'owner' as const,
      },
      {
        email: 'inactive@community.com',
        password: hashedPassword,
        firstName: 'Eve',
        lastName: 'Inactive',
        isActive: false,
        organizationId: organizations.find(org => org.slug === 'community-center')?.id,
        role: 'member' as const,
      },
    ];

    try {
      const createdUsers = await userRepository.save(users);
      console.log(`✅ Seeded ${createdUsers.length} users`);
    } catch (error) {
      console.error('❌ Error seeding users:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);
    
    try {
      await userRepository.query('DELETE FROM users');
      console.log('🗑️ Cleared all users');
    } catch (error) {
      console.error('❌ Error clearing users:', error);
      throw error;
    }
  }
}
