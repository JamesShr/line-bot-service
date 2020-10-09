
export interface LineRequestDto {
  events: {
    type: string;
    replyToken: string;
    source: {
      userId: string;
      type: string;
    };
    timestamp: number;
    mode: string;
    message: {
      type: string;
      id: number;
      text: string;
    };
    postback: {
      data: string;
    };
  }[];
  destination: string;
}
