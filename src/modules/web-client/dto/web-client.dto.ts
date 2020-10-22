export interface UpdateScenarioDto {
  ssid: string;
  password: string;
}

export interface SendCommandDto {
  lanIp: string;
  value: number;
}
