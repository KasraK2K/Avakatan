import { LeadRepository } from './lead.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadCredentialsDto } from './dto/lead-credentials.dto';
import { LeadEntity } from './entities/lead.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { BulkInsertResponseInterface } from './interfaces/lead.interface';

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    @InjectRepository(LeadRepository) private leadRepository: LeadRepository,
  ) {}

  async createLead(
    leadCredentialsDto: LeadCredentialsDto,
    debug: boolean = false,
  ): Promise<LeadEntity> {
    return await this.leadRepository.createLead(leadCredentialsDto, debug);
  }

  async getAllLead(
    options: IPaginationOptions,
  ): Promise<Pagination<LeadEntity>> {
    return await this.leadRepository.getAllLead(options);
  }

  async getLeadById(leadId: string): Promise<LeadEntity> {
    return await this.leadRepository.getLeadById(leadId);
  }

  async getOldLeadToAssign() {
    return await this.leadRepository.getOldLeadToAssign();
  }

  async updateLead(
    leadId: string,
    leadCredentialsDto: LeadCredentialsDto,
  ): Promise<LeadEntity> {
    return await this.leadRepository.updateLead(leadId, leadCredentialsDto);
  }

  async softDeleteLead(leadId: string): Promise<UpdateResult> {
    return await this.leadRepository.softDeleteLead(leadId);
  }

  async removeLead(leadId: string): Promise<DeleteResult> {
    return await this.leadRepository.removeLead(leadId);
  }

  async bulkInsert(
    file: Express.Multer.File,
  ): Promise<BulkInsertResponseInterface> {
    return await this.leadRepository.bulkInsert(file);
  }
}
