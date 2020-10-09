import { Module } from '@nestjs/common';
// import { UserModule } from './user/user.module';
// import { HeartModule } from './heart/heart.module';
// import { EyeModule } from './eye/eye.module';
// import { GroupModule } from './group/group.module';
// import { SampleModule } from './sample/sample.module';
// import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    // UserModule,
    // HeartModule,
    // EyeModule,
    // GroupModule,
    // SampleModule,
    // ChatModule,
    MessageModule,
  ],
})

export class IndexModule { }
