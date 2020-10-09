import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class RepairRecord1583207780063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'repair_record',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'repairId',
          type: 'varchar',
        },
        {
          name: 'userId',
          type: 'varchar',
        },
        {
          name: 'streetlightId',
          type: 'int',
        },
        {
          name: 'lightId',
          type: 'varchar',
        },
        {
          name: 'phone',
          type: 'varchar',
        },
        {
          name: 'brokenReasonId',
          type: 'int',
        },
        {
          name: 'distId',
          type: 'int',
        },
        {
          name: 'villageId',
          type: 'int',
        },
        {
          name: 'address',
          type: 'varchar',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('repair_record');
  }
}
