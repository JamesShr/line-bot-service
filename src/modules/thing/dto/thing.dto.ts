export interface ThingEventDto {
  deviceId: string;
  type: string;
  connect?: {
    type: string;
    resultCode: string;
    startTime: number;
    endTime: number;
    connectionId: string;
  };
  result?: {
    scenarioId: string;
    revision: number;
    startTime: number;
    endTime: number;
    resultCode: string;
    errorReason?: string;
    bleNotificationPayload?: string;
    actionResults: {}[];
    connectionId: string;
  };
  disconnect?: {
    connectionId: string;
    disconnectedTime: number;
  };
}

export interface ProductDto {
  id: string;
  name: string;
  type: string;
  channelId: number;
  liffId?: string;
  serviceUuid: string;
  psdiServiceUuid: string;
  psdiCharacteristicUuid: string;
}

export interface DeviceListDto {
  items: {
    userId: string;
    device: {
      id: string;
      productId: string;
    };
  }[];
}

export interface DeviceInfoDto {
  id: string;
  productId: string;
  productSpecificDeviceId: string;
}

export interface ScenarioDto {
  productId: string;
  autoClose: boolean;
  suppressionInterval: number;
  revision: number;
  scenarios: {
    id: string;
    trigger: {
      type: string;
    };
    actions: {
      type: string;
      serviceUuid: string;
      characteristicUuid: string;
      data?: string;
    }[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface RedisDeviceInfoDto {
  deviceId: string;
  lanIp: string;
  led: number;
  buttonClick: number;
}

export interface LineThings {
  product: {
    id: string;
    name: string;
    type: string;
    channelId: number;
    serviceUuid: string;
    psdiServiceUuid: string;
    psdiCharacteristicUuid: string;
    devices: DeviceListDto;
    scenario: ScenarioDto;
  }[];
}
