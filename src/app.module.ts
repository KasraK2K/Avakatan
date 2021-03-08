import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { LeadModule } from './lead/lead.module';
import { LeadManagerModule } from './lead-manager/lead-manager.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    EventEmitterModule.forRoot(),
    LeadModule,
    LeadManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
