import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateEventsTable1700000000003 implements MigrationInterface {
  name = 'CreateEventsTable1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if events table already exists
    const eventsTableExists = await queryRunner.hasTable('events');
    
    if (!eventsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'events',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'title',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'startDate',
              type: 'timestamp',
              isNullable: false,
            },
            {
              name: 'endDate',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'location',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'category',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'maxGuests',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'organizerId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'organizationId',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
              isNullable: false,
            },
            {
              name: 'guestCount',
              type: 'int',
              default: 0,
              isNullable: false,
            },
            {
              name: 'metadata',
              type: 'jsonb',
              isNullable: true,
            },
            {
              name: 'status',
              type: 'varchar',
              length: '20',
              default: "'draft'",
              isNullable: false,
            },
            {
              name: 'publishedAt',
              type: 'timestamp',
              isNullable: true,
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

      // Create indexes for events table (matching entity definitions)
      await queryRunner.createIndex(
        'events',
        new TableIndex({
          name: 'IDX_events_startDate',
          columnNames: ['startDate'],
        }),
      );

      await queryRunner.createIndex(
        'events',
        new TableIndex({
          name: 'IDX_events_organizerId',
          columnNames: ['organizerId'],
        }),
      );

      await queryRunner.createIndex(
        'events',
        new TableIndex({
          name: 'IDX_events_isActive',
          columnNames: ['isActive'],
        }),
      );

      await queryRunner.createIndex(
        'events',
        new TableIndex({
          name: 'IDX_events_status',
          columnNames: ['status'],
        }),
      );

      // Create composite indexes (from entity)
      await queryRunner.createIndex(
        'events',
        new TableIndex({
          name: 'IDX_events_organizer_date',
          columnNames: ['organizerId', 'startDate'],
        }),
      );

      await queryRunner.createIndex(
        'events',
        new TableIndex({
          name: 'IDX_events_date_status',
          columnNames: ['startDate', 'isActive'],
        }),
      );

      // Create foreign keys
      const usersTableExists = await queryRunner.hasTable('users');
      if (usersTableExists) {
        await queryRunner.createForeignKey(
          'events',
          new TableForeignKey({
            name: 'FK_events_organizerId',
            columnNames: ['organizerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          }),
        );
      }

      const organizationsTableExists = await queryRunner.hasTable('organizations');
      if (organizationsTableExists) {
        await queryRunner.createForeignKey(
          'events',
          new TableForeignKey({
            name: 'FK_events_organizationId',
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
    const eventsTableExists = await queryRunner.hasTable('events');
    
    if (eventsTableExists) {
      // Drop foreign keys
      const eventsTable = await queryRunner.getTable('events');
      if (eventsTable) {
        const organizerForeignKey = eventsTable.foreignKeys.find(
          (fk) => fk.columnNames.indexOf('organizerId') !== -1,
        );
        if (organizerForeignKey) {
          await queryRunner.dropForeignKey('events', organizerForeignKey);
        }

        const organizationForeignKey = eventsTable.foreignKeys.find(
          (fk) => fk.columnNames.indexOf('organizationId') !== -1,
        );
        if (organizationForeignKey) {
          await queryRunner.dropForeignKey('events', organizationForeignKey);
        }
      }


       // Drop regular indexes
       const eventsTableForIndexes = await queryRunner.getTable('events');
       if (eventsTableForIndexes) {
         const indexes = eventsTableForIndexes.indices;
         for (const index of indexes) {
           await queryRunner.dropIndex('events', index);
         }
       }

      // Drop table
      await queryRunner.dropTable('events');
    }
  }
}
