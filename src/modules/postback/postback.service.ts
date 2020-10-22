/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-return */
import { Injectable, Logger, Inject } from '@nestjs/common';
import { TYPES } from '@/types';
import { LineApiService } from '@/services/line-api/line-api.service';
import { RedisService } from '@/services/redis/redis.service';
import { UnknownError } from '@/errors/all.exception';
import { PostbackDto, ReplyMessageDto } from '@/modules/postback/dto/postback.dto';
import { quickReplyList } from '@/modules/common/quickReplyList/replyList';
import { ThingService } from '@/modules/thing/thing.service';
import {
  ProductDto, RedisDeviceInfoDto, DeviceListDto,
} from '@/modules/thing/dto/thing.dto';

export interface PostbackService {
  handlePostback(
    userId: string,
    replyToken: string,
    postback: PostbackDto,
  ): Promise<any>;
}

@Injectable()
export class PostbackServiceImpl implements PostbackService {
  constructor(
    @Inject(TYPES.RedisService)
    private readonly redis: RedisService,
    @Inject(TYPES.LineApiService)
    private readonly line: LineApiService,
    @Inject(TYPES.ThingService)
    private readonly thingService: ThingService,
  ) { }

  public async handlePostback(
    userId: string,
    replyToken: string,
    postback: PostbackDto,
  ): Promise<any> {
    const returnMessage = [];
    let productData: ProductDto[];
    let deviceList: DeviceListDto;
    let handleProduct: string[];
    const handleAction = postback.data.split('&');
    const handleType = handleAction[0].split('=');
    if (handleAction[1]) {
      handleProduct = handleAction[1].split('=');
    }
    if (handleType[0] === 'action') {
      switch (handleType[1]) {
        case 'helpKeyWord':
          Logger.log('run');
          returnMessage.push({
            type: 'text',
            text: '目前提供以下名詞說明!',
            quickReply: {
              items: quickReplyList,
            },
          });
          break;
        case 'productList':
          productData = await this.thingService.getProduct();
          if (productData.length > 0) {
            returnMessage.push({
              type: 'template',
              altText: '現有 Product',
              template: {
                type: 'carousel',
                columns: [],
                imageAspectRatio: 'rectangle',
                imageSize: 'cover',
              },
            });
            productData.map((product) => {
              returnMessage[0].template.columns.push({
                thumbnailImageUrl: 'https://profile.line-scdn.net/0h9zVWIb6LZlVrLk-1wiEZAldraDgcAGAdE0sgNEl6ODZAGiABUU8vZE0sPTUWHHRUXkgqMk98PmVG',
                imageBackgroundColor: '#FFFFFF',
                title: product.name,
                text: product.id,

                actions: [
                  {
                    type: 'postback',
                    label: '目前連線裝置',
                    data: `action=onlineDevice&product=${product.id}`,
                  },
                ],
              });
              return product;
            });
          }
          break;
        case 'onlineDevice':
          deviceList = await this.thingService.getDeviceList(handleProduct[1], userId);
          const onlineDevice = await this.thingService.getRedisDeviceList(deviceList);
          if (onlineDevice.length === 0) {
            returnMessage.push({
              type: 'text',
              text: '目前該Product底下沒有任何裝置連線',
            });
          } else {
            returnMessage.push({
              type: 'template',
              altText: '現在連線裝置',
              template: {
                type: 'carousel',
                columns: [],
                imageAspectRatio: 'rectangle',
                imageSize: 'cover',
              },
            });
            onlineDevice.map((device) => {
              returnMessage[0].template.columns.push({
                thumbnailImageUrl: 'https://profile.line-scdn.net/0h9zVWIb6LZlVrLk-1wiEZAldraDgcAGAdE0sgNEl6ODZAGiABUU8vZE0sPTUWHHRUXkgqMk98PmVG',
                imageBackgroundColor: '#FFFFFF',
                title: device.deviceId,
                text: device.deviceId,
                actions: [
                  {
                    type: 'uri',
                    label: '下控連結',
                    uri: device.lanIp,
                  },
                ],
              });
              return device;
            });
          }
          break;
        default:
          break;
      }
    }
    Logger.log(returnMessage);
    await this.replyMessage(replyToken, returnMessage);
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
}
