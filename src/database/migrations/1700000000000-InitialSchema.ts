import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
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

    // Create events table
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

    // Create guests table
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

    // Create indexes
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_email',
        columnNames: ['email'],
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
        name: 'IDX_events_startDate',
        columnNames: ['startDate'],
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
        name: 'IDX_guests_email',
        columnNames: ['email'],
      }),
    );

    // Create foreign keys
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const eventsTable = await queryRunner.getTable('events');
    const guestsTable = await queryRunner.getTable('guests');

    if (eventsTable) {
      const organizerForeignKey = eventsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('organizerId') !== -1,
      );
      if (organizerForeignKey) {
        await queryRunner.dropForeignKey('events', organizerForeignKey);
      }
    }

    if (guestsTable) {
      const eventForeignKey = guestsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('eventId') !== -1,
      );
      if (eventForeignKey) {
        await queryRunner.dropForeignKey('guests', eventForeignKey);
      }
    }

    // Drop indexes
    await queryRunner.dropIndex('guests', 'IDX_guests_email');
    await queryRunner.dropIndex('guests', 'IDX_guests_eventId');
    await queryRunner.dropIndex('events', 'IDX_events_startDate');
    await queryRunner.dropIndex('events', 'IDX_events_organizerId');
    await queryRunner.dropIndex('users', 'IDX_users_email');

    // Drop tables
    await queryRunner.dropTable('guests');
    await queryRunner.dropTable('events');
    await queryRunner.dropTable('users');
  }
}
