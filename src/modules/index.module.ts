import { Module } from '@nestjs/common';
// import { UserModule } from './user/user.module';
// import { HeartModule } from './heart/heart.module';
// import { EyeModule } from './eye/eye.module';
// import { GroupModule } from './group/group.module';
// import { SampleModule } from './sample/sample.module';
import { EventModule } from '@/modules/event/enevt.module';
import { WebClientModule } from '@/modules/web-client/web-client.module';
import { MessageModule } from '@/modules/message/message.module';
import { ThingModule } from '@/modules/thing/thing.module';
@Module({
  imports: [
    EventModule,
    WebClientModule,
    // HeartModule,
    // EyeModule,
    // GroupModule,
    // SampleModule,
    // ChatModule,
    MessageModule,
    ThingModule,
  ],
})

export class IndexModule { }
