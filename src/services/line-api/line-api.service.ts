import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import {
  ProductDto, DeviceListDto, DeviceInfoDto, ScenarioDto,
} from '@/modules/thing/dto/thing.dto';
import { UserProfileDto } from '@/modules/event/dto/event.dto';

import {
  CHATBOT_TOKEN,
} from '@/env';

export interface LineApiService {
  reply(replyMessage: string): Promise<void>;
  getProfile(userId: string): Promise<UserProfileDto>;
  getLineThingProduct(): Promise<ProductDto[]>;
  getDeviceList(productId: string, userId: string): Promise<DeviceListDto>;
  getDeviceInfo(deviceId: string): Promise<DeviceInfoDto>;
  getProductScenario(productId: string): Promise<ScenarioDto>;
  updateScenarioSet(productId: string, scanarioSet: string): Promise<ScenarioDto>;
}

@Injectable()
export class LineApiServiceImpl implements LineApiService {
  // public constructor() { }

  public async reply(replyMessage: string): Promise<void> {
    const result = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CHATBOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: replyMessage,
    });
    const resutnData = await result.json();
  }

  public async getProfile(userId: string): Promise<UserProfileDto> {
    const result = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHATBOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const resutnData: UserProfileDto = await result.json();
    return resutnData;
  }

  public async getLineThingProduct(): Promise<ProductDto[]> {
    const result = await fetch('https://api.line.me/things/v1/trial/products', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHATBOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const resutnData: ProductDto[] = await result.json();
    return resutnData;
  }

  public async getDeviceList(productId: string, userId: string): Promise<DeviceListDto> {
    const result = await fetch(`https://api.line.me/things/v1/products/${productId}/users/${userId}/links`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHATBOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const resutnData: DeviceListDto = await result.json();
    return resutnData;
  }

  public async getDeviceInfo(deviceId: string): Promise<DeviceInfoDto> {
    const result = await fetch(`https://api.line.me/things/v1/devices/${deviceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHATBOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const resutnData: DeviceInfoDto = await result.json();
    return resutnData;
  }

  public async getProductScenario(productId: string): Promise<ScenarioDto> {
    const result = await fetch(`https://api.line.me/things/v1/products/${productId}/scenario-set`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHATBOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const resutnData: ScenarioDto = await result.json();
    return resutnData;
  }

  public async updateScenarioSet(productId: string, scanarioSet: string): Promise<ScenarioDto> {
    const result = await fetch(`https://api.line.me/things/v1/products/${productId}/scenario-set`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${CHATBOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: scanarioSet,
    });
    const resutnData: ScenarioDto = await result.json();
    return resutnData;
  }
}
