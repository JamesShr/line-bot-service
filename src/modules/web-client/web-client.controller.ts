/* eslint-disable @typescript-eslint/indent */
import {
  Controller, Post, Inject, UseInterceptors, Headers, Param,
  Request, Logger, UsePipes, Body, Get, Patch,
} from '@nestjs/common';
import { TYPES } from '@/types';
import { OkInterceptor } from '@/modules/common/interceptors/ok.interceptor';
import { YupValidationPipe } from '@/modules/common/pipes/yupValidation.pipe';
import { ParseDtoPipe } from '@/modules/common/pipes/parseDto.pipe';
import { ThingService } from '@/modules/thing/thing.service';
import { authVerify } from '@/modules/common/auth-verify/auth-verify';
import { UpdateScenarioDto, SendCommandDto } from '@/modules/web-client/dto/web-client.dto';
import { updateScenarioValidation, sendCommandValidation } from '@/modules/web-client/validations/web-client.validation';

@Controller('/api')
@UseInterceptors(OkInterceptor)
export class WebClientController {
  constructor(
    @Inject(TYPES.ThingService)
    private readonly thingService: ThingService,
  ) { }

  @Get('/healthcheck')
  public async test(
    @Headers() headers,
  ): Promise<any> {
    authVerify.findUser({}, headers);
    return 'success';
  }

  @Get('/get-products')
  public async getProducts(
    @Headers() headers,
  ): Promise<any> {
    authVerify.findUser({}, headers);
    const productData = await this.thingService.getProduct();
    return productData;
  }

  @Get('/get-device-list/:productId')
  public async getDeviceList(
    @Headers() headers, @Param('productId') productId: string,
  ): Promise<any> {
    const user = authVerify.findUser({}, headers);
    if (!productId) {
      throw new Error('productId not found');
    }
    const productData = await this.thingService.getDeviceList(productId, user.userId);
    return productData.items;
  }

  @Get('/get-scenario/:productId')
  public async getScenario(
    @Headers() headers, @Param('productId') productid: string,
  ): Promise<any> {
    authVerify.findUser({}, headers);
    const scenarioData = await this.thingService.getScenario(productid);
    const returnData = {
      ssid: '',
      password: '',
    };
    // FOR DEMO Transform
    await Promise.all(scenarioData.scenarios.map((scenario) => {
      if (scenario.trigger.type === 'IMMEDIATE') {
        scenario.actions.map((action) => {
          const decodeData = Buffer.from(action.data || '', 'base64').toString('ascii');
          Logger.log(decodeData);
          const verifyData = decodeData.split(':');
          if (verifyData[0] === 'ssid') {
            const ssid = verifyData[1] || '';
            returnData.ssid = ssid;
          }
          if (verifyData[0] === 'password') {
            const password = verifyData[1] || '';
            returnData.password = password;
          }
          return action;
        });
      }
      return scenario;
    }));
    //
    return returnData;
  }

  @Get('/get-online-device/:productId')
  public async getConnectDevice(
    @Headers() headers, @Param('productId') productId: string,
  ): Promise<any> {
    const user = authVerify.findUser({}, headers);
    if (!productId) {
      throw new Error('productId not found');
    }
    const deviceList = await this.thingService.getDeviceList(productId, user.userId);
    const connectList = await this.thingService.getRedisDeviceList(deviceList);
    return connectList;
  }

  @Patch('/update-scenario/:productId')
  public async updateScenario(
    @Headers() headers, @Param('productId') productId: string,
    @Body(new YupValidationPipe(updateScenarioValidation)) body: UpdateScenarioDto,
  ): Promise<any> {
    authVerify.findUser({}, headers);
    const { ssid, password } = body;
    const productData = await this.thingService.getProduct();
    let productServiceUuid: string;
    productData.map((product) => {
      if (product.id === productId) {
        productServiceUuid = product.serviceUuid;
      }
      return product;
    });
    const scenarioData = await this.thingService.getScenario(productId);
    const { autoClose, suppressionInterval } = scenarioData;
    const updatePayload = {
      autoClose,
      suppressionInterval,
      scenarios: [],
    };
    const writeSsid = Buffer.from(`ssid:${ssid}`).toString('base64');
    const writePassword = Buffer.from(`password:${password}`).toString('base64');
    updatePayload.scenarios.push({
      trigger: {
        type: 'IMMEDIATE',
      },
      actions: [
        {
          type: 'GATT_WRITE',
          serviceUuid: productServiceUuid,
          characteristicUuid: 'E9062E71-9E62-4BC6-B0D3-35CDCD9B027B',
          data: writeSsid,
        },
        {
          type: 'GATT_WRITE',
          serviceUuid: productServiceUuid,
          characteristicUuid: 'E9062E71-9E62-4BC6-B0D3-35CDCD9B027B',
          data: writePassword,
        },
      ],
    });
    updatePayload.scenarios.push({
      trigger: {
        type: 'BLE_NOTIFICATION',
        serviceUuid: productServiceUuid,
        characteristicUuid: '62FBD229-6EDD-4D1A-B554-5C4E1BB29169',
      },
      actions: [],
    });
    const result = await this.thingService.updateScenarioSet(
      productId,
      JSON.stringify(updatePayload),
    );
    Logger.log(result);
    return {};
  }

  @Post('/device-command/:deviceId')
  public async sendCommand(
    @Headers() headers, @Param('deviceId') deviceId: string,
    @Body(new YupValidationPipe(sendCommandValidation)) body: SendCommandDto,
  ): Promise<any> {
    const userData = authVerify.findUser({}, headers);
    Logger.log({
      user: userData.userId,
      device: deviceId,
      command: body.value,
    });
    return {
      message: 'success',
    };
  }
}
