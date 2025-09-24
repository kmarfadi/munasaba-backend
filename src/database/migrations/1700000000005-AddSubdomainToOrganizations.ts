import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddSubdomainToOrganizations1700000000005 implements MigrationInterface {
  name = 'AddSubdomainToOrganizations1700000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if organizations table exists
    const organizationsTableExists = await queryRunner.hasTable('organizations');
    
    if (organizationsTableExists) {
      // Add subdomain column
      await queryRunner.query(`
        ALTER TABLE organizations 
        ADD COLUMN IF NOT EXISTS "subdomain" varchar UNIQUE NOT NULL;
      `);

      // Create index for subdomain
      await queryRunner.createIndex(
        'organizations',
        new TableIndex({
          name: 'IDX_organizations_subdomain',
          columnNames: ['subdomain'],
        }),
      );

      // Create composite index for subdomain + isActive (useful for tenant resolution)
      await queryRunner.createIndex(
        'organizations',
        new TableIndex({
          name: 'IDX_organizations_subdomain_active',
          columnNames: ['subdomain', 'isActive'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const organizationsTableExists = await queryRunner.hasTable('organizations');
    
    if (organizationsTableExists) {
      // Drop indexes
      await queryRunner.dropIndex('organizations', 'IDX_organizations_subdomain_active');
      await queryRunner.dropIndex('organizations', 'IDX_organizations_subdomain');

      // Drop subdomain column
      await queryRunner.query(`
        ALTER TABLE organizations 
        DROP COLUMN IF EXISTS "subdomain";
      `);
    }
  }
}
