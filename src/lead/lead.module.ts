import { LeadRepository } from './lead.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeadRepository])],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
