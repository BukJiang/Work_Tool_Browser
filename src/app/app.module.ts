import { Module } from '@nestjs/common';
import { AppController } from '@/app/app.controller';
import { BombModule } from '@/bomb/bomb.module';

@Module({
  imports: [BombModule, AppModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
