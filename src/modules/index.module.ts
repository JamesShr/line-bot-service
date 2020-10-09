import { Module } from '@nestjs/common';
// import { UserModule } from './user/user.module';
// import { HeartModule } from './heart/heart.module';
// import { EyeModule } from './eye/eye.module';
// import { GroupModule } from './group/group.module';
// import { SampleModule } from './sample/sample.module';
import { EventModule } from '@/modules/event/enevt.module';
import { MessageModule } from '@/modules/message/message.module';

@Module({
  imports: [
    EventModule,
    // HeartModule,
    // EyeModule,
    // GroupModule,
    // SampleModule,
    // ChatModule,
    MessageModule,
  ],
})

export class IndexModule { }
