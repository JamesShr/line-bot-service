import { Injectable, Logger } from '@nestjs/common';
import mqtt, { MqttClient } from 'mqtt';
import {
  MQTT_HOST, MQTT_PORT, MQTT_SUB_TOPIC, MQTT_PUB_TOPIC,
} from '@/env';

export interface MQTTService{
  pub(payload: string);
}

@Injectable()
export class MQTTServiceImpl implements MQTTService {
  private readonly client: MqttClient;

  public constructor() {
    const opt = {
      port: MQTT_PORT,
      clientId: 'node.js',
    };
    this.client = mqtt.connect(`mqtt:${MQTT_HOST}`, opt);
    this.client.on('connect', () => {
      Logger.log('is connected mqtt server');
      this.client.subscribe(MQTT_SUB_TOPIC);// 訂閱主題
      this.client.publish('clinetPublish', '[client msg:hello world]');
    });
    this.client.on('message', (topic, msg) => {
      Logger.log(`收到 ${topic} 主題，訊息：${msg.toString()}`);
    });
  }

  async pub(payload: string): Promise<void> {
    this.client.publish(MQTT_PUB_TOPIC, payload, {
      retain: true,
      qos: 1,
    });
  }
}
