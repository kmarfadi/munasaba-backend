import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateUsersTable1700000000002 implements MigrationInterface {
  name = 'CreateUsersTable1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if users table already exists
    const usersTableExists = await queryRunner.hasTable('users');
    
    if (!usersTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'email',
              type: 'varchar',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'password',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'firstName',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'lastName',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
              isNullable: false,
            },
            {
              name: 'organizationId',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'role',
              type: 'varchar',
              length: '20',
              default: "'member'",
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

      // Create indexes for users table (only email as defined in entity - unique constraint handles this)
      // No additional indexes needed beyond the unique constraint on email

      // Create foreign key to organizations table
      const organizationsTableExists = await queryRunner.hasTable('organizations');
      if (organizationsTableExists) {
        await queryRunner.createForeignKey(
          'users',
          new TableForeignKey({
            name: 'FK_users_organizationId',
            columnNames: ['organizationId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'organizations',
            onDelete: 'SET NULL',
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usersTableExists = await queryRunner.hasTable('users');
    
    if (usersTableExists) {
      // Drop foreign key
      const usersTable = await queryRunner.getTable('users');
      if (usersTable) {
        const organizationForeignKey = usersTable.foreignKeys.find(
          (fk) => fk.columnNames.indexOf('organizationId') !== -1,
        );
        if (organizationForeignKey) {
          await queryRunner.dropForeignKey('users', organizationForeignKey);
        }
      }

      // Drop indexes
      const usersTableForIndexes = await queryRunner.getTable('users');
      if (usersTableForIndexes) {
        const indexes = usersTableForIndexes.indices;
        for (const index of indexes) {
          await queryRunner.dropIndex('users', index);
        }
      }

      // Drop table
      await queryRunner.dropTable('users');
    }
  }
}
