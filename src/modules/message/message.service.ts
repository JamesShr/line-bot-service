/* eslint-disable no-useless-return */
import { Injectable, Logger, Inject } from '@nestjs/common';
// import { UnknownError } from '@/errors/all.exception';
import fetch from 'node-fetch';
import { TYPES } from '@/types';
import { RedisService } from '@/services/redis/redis.service';
import { CHATBOT_TOKEN, TAOYUAN_HOST } from '@/env';
import { UnknownError } from '@/errors/all.exception';
import { RepairRecordRepository } from '@/modules/message/message.repository';

type messageRequest = {
  type: string;
  id: number;
  text: string;
}

type postbackRequest = {
  data: string;
}

export interface MessageService {
  handleMessage(
    userId: string,
    replyToken: string,
    message: messageRequest,
  ): Promise<any>;
  handlePostback(
    userId: string,
    replyToken: string,
    postback: postbackRequest,
  ): Promise<any>;
  handleLightId(
    userId: string,
    replyToken: string,
    message: messageRequest,
    redisData: any,
  ): Promise<any>;
  handlBrokenReasonId(
    userId: string,
    replyToken: string,
    message: messageRequest,
    redisData: any,
  ): Promise<any>;
  handlePhone(
    userId: string,
    replyToken: string,
    message: messageRequest,
    redisData: any,
  ): Promise<any>;
  // submit(lineId: string, lineName: string);
  replyMessage(replyToken: string, defaultMessage: string): Promise<any | null>;
  searchStreetlightByLightId(poleCode: string): Promise<any | null>;
  createNewRepair(postBody: any): Promise<any | null>;
}

@Injectable()
export class MessageServiceImpl implements MessageService {
  constructor(
    @Inject(TYPES.RedisService)
    private readonly redis: RedisService,
    @Inject(TYPES.MessageRepository)
    private readonly repairRecordRepository: RepairRecordRepository,
  ) { }

  public async handleMessage(
    userId: string,
    replyToken: string,
    message: messageRequest,
  ): Promise<any> {
    const redisResult = await this.redis.getRedisClient().getAsync(userId);
    if (redisResult === null) {
      await this.replyMessage(replyToken, '請使用圖文選單通報');
    } else {
      const redisData = JSON.parse(redisResult);
      switch (redisData.step) {
        case 'enterLightId':
          await this.handleLightId(userId, replyToken, message, redisData);
          break;
        case 'enterBrokenReasonId':
          await this.handlBrokenReasonId(userId, replyToken, message, redisData);
          break;
        case 'enterPhone':
          await this.handlePhone(userId, replyToken, message, redisData);
          break;
        default:
          break;
      }
    }
  }

  public async handleLightId(
    userId: string,
    replyToken: string,
    message: messageRequest,
    redisData: any,
  ): Promise<any> {
    // fetch api to search lightId
    const userEnterId = message.text;
    const streetlightData = await this.searchStreetlightByLightId(userEnterId);
    if (streetlightData.data === null) {
      try {
        await this.replyMessage(replyToken, '找不到此路燈編號，請再確認並輸入正確的路燈編號');
      } catch (error) {
        throw new UnknownError(error);
      }
    } else {
      const updateRedisData = redisData;
      updateRedisData.step = 'enterBrokenReasonId';
      updateRedisData.repairData.lightId = streetlightData.PoleCode;
      updateRedisData.repairData.streetlightid = streetlightData.lightID;
      updateRedisData.repairData.distId = streetlightData.DistID || 0;
      updateRedisData.repairData.villageId = streetlightData.VillageID || 0;
      await this.redis.getRedisClient().setAsync(userId, JSON.stringify(updateRedisData));
      try {
        await this.replyMessage(
          replyToken,
          '請輸入故障原因代號(1~9,99)\n\n1.路燈不亮\n2.全天亮\n3.時亮時不亮\n4.整排路燈不亮\n5.漏電火花\n6.燈桿傾斜或折斷\n7.燈具損壞或不亮\n8.閃爍\n9.燈頭不見\n99.其他狀況',
        );
      } catch (error) {
        throw new UnknownError(error);
      }
    }
  }

  public async handlBrokenReasonId(
    userId: string,
    replyToken: string,
    message: messageRequest,
    redisData: any,
  ): Promise<any> {
    const updateRedisData = redisData;
    const brokenTable = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '99'];
    const result = brokenTable.findIndex((number: string) => number === message.text);
    if (result === -1) {
      try {
        await this.replyMessage(replyToken, '故障代號錯誤，請輸入正確的故障代號');
      } catch (error) {
        throw new UnknownError(error);
      }
    } else {
      updateRedisData.step = 'enterPhone';
      updateRedisData.repairData.brokenreasonId = parseInt(message.text, 10);
      await this.redis.getRedisClient().setAsync(userId, JSON.stringify(updateRedisData));
      try {
        await this.replyMessage(replyToken, '請輸入您的聯絡電話');
      } catch (error) {
        throw new UnknownError(error);
      }
    }
  }

  public async handlePhone(
    userId: string,
    replyToken: string,
    message: messageRequest,
    redisData: any,
  ): Promise<any> {
    const updateRedisData = redisData;
    updateRedisData.repairData.reporterPhone = message.text;
    // post api to taoyuan platform
    const postBody = {
      lihtId: updateRedisData.repairData.lightId,
      brokenreasonid: updateRedisData.repairData.brokenreasonId,
      reportername: updateRedisData.repairData.reporterName,
      reporterphone: updateRedisData.repairData.reporterPhone,
      streetlightid: updateRedisData.repairData.streetlightid,
      distid: updateRedisData.repairData.distId,
      villageid: updateRedisData.repairData.villageId,
    };
    const repairNum = await this.createNewRepair(postBody);
    if (repairNum.result === 'success') {
      // insert to db
      const insertObj = {
        repairId: repairNum.code,
        userId: postBody.reportername,
        streetlightId: postBody.streetlightid,
        lightId: postBody.lihtId,
        phone: postBody.reporterphone,
        brokenReasonId: postBody.brokenreasonid,
        distId: postBody.distid,
        villageId: postBody.villageid,
        address: '',
      };
      Logger.log(insertObj);
      this.repairRecordRepository.createNewRepair(insertObj);
      await this.redis.getRedisClient().delkeysAsync(userId);
      try {
        await this.replyMessage(replyToken, '報修單已建立，感謝您的通報');
      } catch (error) {
        throw new UnknownError(error);
      }
    } else {
      await this.redis.getRedisClient().delkeysAsync(userId);
      try {
        await this.replyMessage(replyToken, '報修單建立失敗，請重新開始');
      } catch (error) {
        throw new UnknownError(error);
      }
    }
  }

  public async handlePostback(
    userId: string,
    replyToken: string,
    postback: postbackRequest,
  ): Promise<any> {
    if (postback.data === 'action=startCreateRepair') {
      await this.redis.getRedisClient().setAsync(userId, JSON.stringify({
        step: 'enterLightId',
        repairData: {
          lightId: '',
          brokenreasonId: 0,
          reporterName: userId,
          reporterPhone: '',
          streetlightid: 0,
          distId: 0,
          villageId: 0,
        },
      }));
      await this.replyMessage(replyToken, '請輸入路燈編號');
    }
    return;
  }

  public async replyMessage(replyToken: string, defaultMessage: string): Promise<any> {
    try {
      const replyMessage = {
        replyToken,
        messages: [
          {
            type: 'text',
            text: defaultMessage,
          },
        ],
      };

      await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CHATBOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyMessage),
      });
      return;
    } catch (error) {
      throw new UnknownError(error);
    }
  }

  public async searchStreetlightByLightId(poleCode: string): Promise<any | null> {
    try {
      const result = await fetch(`${TAOYUAN_HOST}/openApi/light/getLightDetail?poleCode=${poleCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const streetlight = await result.json();
      return streetlight;
    } catch (error) {
      throw new UnknownError(error);
    }
  }

  public async createNewRepair(postBody): Promise<any | null> {
    try {
      const result = await fetch(`${TAOYUAN_HOST}/openApi/maintain/newRepair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postBody),
      });
      const repairNum = await result.json();
      return repairNum;
    } catch (error) {
      throw new UnknownError(error);
    }
  }
}
