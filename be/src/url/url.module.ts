import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';

@Module({
  imports: [AuthModule],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
