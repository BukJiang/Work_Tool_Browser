import { All, Controller } from '@nestjs/common';
import { BombService } from '@/bomb/bomb.service';

@Controller()
export class BombController {
  constructor(private readonly bombService: BombService) {}

  @All('/bomb/invoke')
  async invoke() {
    this.bombService.invoke();
  }
}
