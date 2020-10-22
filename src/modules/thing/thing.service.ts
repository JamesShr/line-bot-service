/* eslint-disable no-case-declarations */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-useless-return */
import { Injectable, Logger, Inject } from '@nestjs/common';
import { TYPES } from '@/types';
import { UnknownError } from '@/errors/all.exception';
import { LineApiService } from '@/services/line-api/line-api.service';
import { RedisService } from '@/services/redis/redis.service';
import { SocketService } from '@/services/socket/socket.service';
import {
  ProductDto, DeviceListDto, ThingEventDto, ScenarioDto, RedisDeviceInfoDto,
} from '@/modules/thing/dto/thing.dto';
import { ReplyMessageDto } from '@/modules/message/dto/message.dto';

export interface ThingService {
  handleEvent(
    userId: string,
    replyToken: string,
    thing: ThingEventDto,
  ): Promise<any>;
  getProduct(): Promise<ProductDto[]>;
  getScenario(productId: string): Promise<ScenarioDto>;
  getDeviceList(productId: string, userId: string): Promise<DeviceListDto>;
  getRedisDeviceList(deviceList: DeviceListDto): Promise<RedisDeviceInfoDto[]>;
  updateScenarioSet(productId: string, updatePayload: string): Promise<ScenarioDto>;
}

@Injectable()
export class ThingServiceImpl implements ThingService {
  constructor(
    @Inject(TYPES.RedisService)
    private readonly redis: RedisService,
    @Inject(TYPES.LineApiService)
    private readonly line: LineApiService,
    @Inject(TYPES.SocketService)
    private readonly socket: SocketService,
  ) { }

  public async handleEvent(
    userId: string,
    replyToken: string,
    thing: ThingEventDto,
  ): Promise<any> {
    const returnMessage = [];
    const userProfile = await this.line.getProfile(userId);
    Logger.log('handleEvent');
    switch (thing.type) {
      case 'link':
        returnMessage.push({
          type: 'text',
          text: `使用者 : ${userProfile.displayName} \n設備：${thing.deviceId} \n操作 : 列入配對清單`,
        });
        break;
      case 'connect':
        returnMessage.push({
          type: 'text',
          text: `使用者 : ${userProfile.displayName} \n設備：${thing.deviceId} \n操作 : 配對連線`,
        });
        await this.createDeviceCache(thing);
        break;
      case 'disconnect':
        returnMessage.push({
          type: 'text',
          text: `使用者 : ${userProfile.displayName} \n設備：${thing.deviceId} \n操作 : 配對斷線`,
        });
        await this.deleteDeviceCache(thing);
        break;
      case 'unlink':
        returnMessage.push({
          type: 'text',
          text: `使用者 : ${userProfile.displayName} \n設備：${thing.deviceId} \n操作 : 移除配對清單`,
        });
        break;
      case 'scenarioResult':
        returnMessage.push({
          type: 'text',
          text: `使用者 : ${userProfile.displayName} \n操作 : 設備操作`,
        });
        const notifyData = await this.updateDeviceCache(thing) || '(連線獲得預設值)';
        returnMessage.push({
          type: 'text',
          text: `設備：${thing.deviceId} \n設備回報 : ${notifyData}`,
        });
        break;
      default:
        returnMessage.push({
          type: 'text',
          text: `使用者 : ${userProfile.displayName} \n操作 : 未知`,
        });
        break;
    }
    await this.replyMessage(replyToken, returnMessage);
  }

  public async getProduct(): Promise<ProductDto[]> {
    const productList = await this.line.getLineThingProduct();
    return productList;
  }

  public async getScenario(productId: string): Promise<ScenarioDto> {
    const productList = await this.line.getProductScenario(productId);
    return productList;
  }

  public async getDeviceList(productId: string, userId: string): Promise<DeviceListDto> {
    const deviceList = await this.line.getDeviceList(productId, userId);
    return deviceList;
  }

  public async getRedisDeviceList(deviceList: DeviceListDto): Promise<RedisDeviceInfoDto[]> {
    const returnData = [];
    await Promise.all(deviceList.items.map(async (item) => {
      const redisCache = await this.redis.getRedisClient().getAsync(item.device.id);
      if (redisCache) {
        const redisData = JSON.parse(redisCache);
        returnData.push(redisData);
      }
      return item;
    }));
    return returnData;
  }

  public async updateScenarioSet(productId: string, updatePayload: string): Promise<ScenarioDto> {
    const productList = await this.line.updateScenarioSet(productId, updatePayload);
    return productList;
  }

  public async replyMessage(replyToken: string, defaultMessage: ReplyMessageDto[]): Promise<any> {
    try {
      const replyMessage = {
        replyToken,
        messages: defaultMessage,
      };
      await this.line.reply(JSON.stringify(replyMessage));
      return;
    } catch (error) {
      throw new UnknownError(error);
    }
  }

  public async createDeviceCache(thing: ThingEventDto): Promise<void> {
    const devicePayload = {
      deviceId: thing.deviceId,
      led: 0,
      lanIp: '',
      buttonClick: 0,
    };
    await this.redis.getRedisClient().setAsync(
      thing.deviceId,
      JSON.stringify(devicePayload),
    );
    await this.socket.sendMessage(false, '', 'NEW_DEVICE_CONNECT', devicePayload);
  }

  public async deleteDeviceCache(thing: ThingEventDto): Promise<void> {
    await this.redis.getRedisClient().delkeysAsync(thing.deviceId);
    await this.socket.sendMessage(false, '', 'DEVICE_DISCONNECT', { deviceId: thing.deviceId });
  }

  public async updateDeviceCache(thing: ThingEventDto): Promise<string> {
    const deviceCache = await this.redis.getRedisClient().getAsync(thing.deviceId);
    const deviceData = JSON.parse(deviceCache);
    let decodeMessage: string;
    if (thing.result.bleNotificationPayload) {
      decodeMessage = Buffer.from(thing.result.bleNotificationPayload || '', 'base64').toString('ascii');
      const decodeData = decodeMessage.split(':');
      switch (decodeData[0]) {
        case 'LanIP':
          deviceData.lanIp = `http://${decodeData[1].split('\r')[0]}`;
          break;
        case 'LED':
          deviceData.led = parseInt(decodeData[1], 10);
          break;
        case 'BTN':
          deviceData.buttonClick = decodeData[1];
          break;
        default:
          break;
      }
    }
    await this.redis.getRedisClient().setAsync(
      thing.deviceId,
      JSON.stringify(deviceData),
    );
    await this.socket.sendMessage(true, thing.deviceId, 'UPDATE_DEVICE_STATUS', deviceData);
    return decodeMessage;
  }
}
