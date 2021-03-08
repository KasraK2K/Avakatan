import { LeadManagerRepository } from './lead-manager.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LeadManagerService } from './lead-manager.service';
import { LeadManagerController } from './lead-manager.controller';
import { LeadRepository } from 'src/lead/lead.repository';
import { rabbitmqOptions } from 'src/config/rabbitmq.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LEAD_MANAGER_SERVICE',
        transport: Transport.RMQ,
        options: rabbitmqOptions,
      },
    ]),
    TypeOrmModule.forFeature([LeadManagerRepository, LeadRepository]),
  ],
  controllers: [LeadManagerController],
  providers: [LeadManagerService],
})
export class LeadManagerModule {}
