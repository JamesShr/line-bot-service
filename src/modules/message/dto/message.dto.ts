export interface MessageDto {
  type: string;
  id: number;
  text?: string;
}

export interface ReplyMessageDto {
  type: string;
  text?: string;
}
