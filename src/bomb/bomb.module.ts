import { Module } from '@nestjs/common';
import { BombController } from '@/bomb/bomb.controller';
import { BombService } from '@/bomb/bomb.service';

@Module({
  controllers: [BombController],
  providers: [BombService],
})
export class BombModule {}
