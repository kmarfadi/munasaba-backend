import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateOrganizationsTable1700000000001 implements MigrationInterface {
  name = 'CreateOrganizationsTable1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if organizations table already exists
    const organizationsTableExists = await queryRunner.hasTable('organizations');
    
    if (!organizationsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'organizations',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'slug',
              type: 'varchar',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'settings',
              type: 'jsonb',
              isNullable: true,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
              isNullable: false,
            },
            {
              name: 'plan',
              type: 'varchar',
              length: '20',
              default: "'free'",
              isNullable: false,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
          ],
        }),
        true,
      );

      // Create indexes for organizations table (only slug as defined in entity)
      await queryRunner.createIndex(
        'organizations',
        new TableIndex({
          name: 'IDX_organizations_slug',
          columnNames: ['slug'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const organizationsTableExists = await queryRunner.hasTable('organizations');
    
    if (organizationsTableExists) {
      // Drop indexes
      const organizationsTable = await queryRunner.getTable('organizations');
      if (organizationsTable) {
        const indexes = organizationsTable.indices;
        for (const index of indexes) {
          await queryRunner.dropIndex('organizations', index);
        }
      }

      // Drop table
      await queryRunner.dropTable('organizations');
    }
  }
}
