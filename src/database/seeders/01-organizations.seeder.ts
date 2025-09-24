import { DataSource } from 'typeorm';
import { Organization } from '../../modules/organizations/entities/organization.entity';

export class OrganizationsSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const organizationRepository = this.dataSource.getRepository(Organization);

    // Check if organizations already exist
    const existingCount = await organizationRepository.count();
    if (existingCount > 0) {
      console.log(`✅ Organizations already seeded (${existingCount} found)`);
      return;
    }

    const organizations = [
      {
        name: 'TechCorp Inc.',
        slug: 'techcorp-inc',
        subdomain: 'techcorp',
        description: 'Leading technology company specializing in software solutions',
        settings: {
          theme: 'dark',
          notifications: true,
          features: ['events', 'analytics', 'custom-branding']
        },
        isActive: true,
        plan: 'pro' as const,
      },
      {
        name: 'Event Masters',
        slug: 'event-masters',
        subdomain: 'eventmasters',
        description: 'Professional event management and planning services',
        settings: {
          theme: 'light',
          notifications: false,
          features: ['events', 'guest-management']
        },
        isActive: true,
        plan: 'enterprise' as const,
      },
      {
        name: 'StartupHub',
        slug: 'startup-hub',
        subdomain: 'startuphub',
        description: 'Innovation center for emerging startups',
        settings: {
          theme: 'blue',
          notifications: true,
          features: ['events']
        },
        isActive: true,
        plan: 'free' as const,
      },
      {
        name: 'Community Center',
        slug: 'community-center',
        subdomain: 'community',
        description: 'Local community organization promoting social events',
        settings: {
          theme: 'green',
          notifications: true,
          features: ['events', 'guest-management']
        },
        isActive: false,
        plan: 'free' as const,
      },
    ];

    try {
      const createdOrganizations = await organizationRepository.save(organizations);
      console.log(`✅ Seeded ${createdOrganizations.length} organizations`);
    } catch (error) {
      console.error('❌ Error seeding organizations:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    const organizationRepository = this.dataSource.getRepository(Organization);
    
    try {
      await organizationRepository.query('DELETE FROM organizations');
      console.log('🗑️ Cleared all organizations');
    } catch (error) {
      console.error('❌ Error clearing organizations:', error);
      throw error;
    }
  }
}
