import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairRecord } from '../../entity/repairRecord.entity';
import { UnknownError } from '@/errors/all.exception';


type repairRecordData = {
  repairId: string;
  userId: string;
  streetlightId: number;
  lightId: string;
  phone: string;
  brokenReasonId: number;
  distId: number;
  villageId: number;
  address: string;
}
export interface RepairRecordRepository {
  createNewRepair(repairData: repairRecordData);
}

@Injectable()
export class RepairRecordRepositoryImpl implements RepairRecordRepository {
  public constructor(
    @InjectRepository(RepairRecord)
    private readonly repairRecordRepository: Repository<RepairRecord>,
  ) { }

  public async createNewRepair(repairData: repairRecordData): Promise<void> {
    try {
      const newRepair = new RepairRecord();
      newRepair.repairId = repairData.repairId;
      newRepair.userId = repairData.userId;
      newRepair.streetlightId = repairData.streetlightId;
      newRepair.lightId = repairData.lightId;
      newRepair.phone = repairData.phone;
      newRepair.brokenReasonId = repairData.brokenReasonId;
      newRepair.distId = repairData.distId;
      newRepair.villageId = repairData.villageId;
      newRepair.address = repairData.address;
      await this.repairRecordRepository.save(newRepair);
      return;
    } catch (e) {
      throw new UnknownError(e.stack);
    }
  }
}
