import {
  Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';


@Entity()
export class RepairRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  repairId: string;

  @Column()
  userId: string;

  @Column()
  streetlightId: number;

  @Column()
  lightId: string;

  @Column()
  phone: string;

  @Column()
  brokenReasonId: number;

  @Column()
  distId: number;

  @Column()
  villageId: number;

  @Column()
  address: string;
}
