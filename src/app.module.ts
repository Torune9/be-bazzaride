import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MasterModule } from './modules/master.module';

@Module({
  imports: [PrismaModule, MasterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
