import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateGuestsTable1700000000004 implements MigrationInterface {
  name = 'CreateGuestsTable1700000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if guests table already exists
    const guestsTableExists = await queryRunner.hasTable('guests');
    
    if (!guestsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'guests',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
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
              name: 'email',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'phone',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'eventId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'notes',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'checkedIn',
              type: 'boolean',
              default: false,
              isNullable: false,
            },
            {
              name: 'checkedOut',
              type: 'boolean',
              default: false,
              isNullable: false,
            },
            {
              name: 'checkInTime',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'checkOutTime',
              type: 'timestamp',
              isNullable: true,
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
              default: "'registered'",
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

      // Create indexes for guests table (matching entity definitions)
      await queryRunner.createIndex(
        'guests',
        new TableIndex({
          name: 'IDX_guests_email',
          columnNames: ['email'],
        }),
      );

      await queryRunner.createIndex(
        'guests',
        new TableIndex({
          name: 'IDX_guests_eventId',
          columnNames: ['eventId'],
        }),
      );

      await queryRunner.createIndex(
        'guests',
        new TableIndex({
          name: 'IDX_guests_checkedIn',
          columnNames: ['checkedIn'],
        }),
      );

      await queryRunner.createIndex(
        'guests',
        new TableIndex({
          name: 'IDX_guests_checkInTime',
          columnNames: ['checkInTime'],
        }),
      );

      // Create composite indexes (from entity)
      await queryRunner.createIndex(
        'guests',
        new TableIndex({
          name: 'IDX_guests_event_checkin',
          columnNames: ['eventId', 'checkedIn', 'checkInTime'],
        }),
      );

      await queryRunner.createIndex(
        'guests',
        new TableIndex({
          name: 'IDX_guests_email_event',
          columnNames: ['email', 'eventId'],
        }),
      );

      // Create foreign key to events table
      const eventsTableExists = await queryRunner.hasTable('events');
      if (eventsTableExists) {
        await queryRunner.createForeignKey(
          'guests',
          new TableForeignKey({
            name: 'FK_guests_eventId',
            columnNames: ['eventId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'events',
            onDelete: 'CASCADE',
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const guestsTableExists = await queryRunner.hasTable('guests');
    
    if (guestsTableExists) {
      // Drop foreign key
      const guestsTable = await queryRunner.getTable('guests');
      if (guestsTable) {
        const eventForeignKey = guestsTable.foreignKeys.find(
          (fk) => fk.columnNames.indexOf('eventId') !== -1,
        );
        if (eventForeignKey) {
          await queryRunner.dropForeignKey('guests', eventForeignKey);
        }
      }


       // Drop regular indexes
       const guestsTableForIndexes = await queryRunner.getTable('guests');
       if (guestsTableForIndexes) {
         const indexes = guestsTableForIndexes.indices;
         for (const index of indexes) {
           await queryRunner.dropIndex('guests', index);
         }
       }

      // Drop table
      await queryRunner.dropTable('guests');
    }
  }
}
