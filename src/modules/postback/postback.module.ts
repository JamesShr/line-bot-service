import { Module } from '@nestjs/common';
import { TYPES } from '@/types';
import { PostbackServiceImpl } from '@/modules/postback/postback.service';
import { ThingModule } from '@/modules/thing/thing.module';

const modules = [
  {
    provide: TYPES.PostbackService,
    useClass: PostbackServiceImpl,
  },
];

@Module({
  imports: [
    ThingModule,
  ],
  controllers: [],
  providers: modules,
  exports: modules,
})

export class PostbackModule {
}
