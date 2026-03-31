import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UrlModule, PrismaModule, 
      ConfigModule.forRoot({
        isGlobal: true,
      })],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

