import { LeadManagerRepository } from './lead-manager.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CreateLeadManagerDto } from './dto/create-lead-manager.dto';
import { UpdateLeadManagerDto } from './dto/update-lead-manager.dto';
import { LeadManagerEntity } from './entities/lead-manager.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Connection, DeleteResult, UpdateResult } from 'typeorm';
import { SearchLeadManagerAndCount } from './interfaces/search.interface';
import { AssignLeadToManagerDto } from './dto/assign-lead-to-manager.dto';

@Injectable()
export class LeadManagerService {
  private readonly logger = new Logger(LeadManagerService.name);

  constructor(
    @InjectRepository(LeadManagerRepository)
    private leadManagerRepository: LeadManagerRepository,
  ) {}

  async createLeadManager(
    createLeadManagerDto: CreateLeadManagerDto,
  ): Promise<LeadManagerEntity> {
    return await this.leadManagerRepository.createLeadManager(
      createLeadManagerDto,
    );
  }

  async GetAllLeadManager(
    options: IPaginationOptions,
  ): Promise<Pagination<LeadManagerEntity>> {
    return await this.leadManagerRepository.GetAllLeadManager(options);
  }

  async getLeadManagerById(leadManagerId: string): Promise<LeadManagerEntity> {
    return await this.leadManagerRepository.getLeadManagerById(leadManagerId);
  }

  async searchLeadManager(name: string): Promise<SearchLeadManagerAndCount> {
    return await this.leadManagerRepository.searchLeadManager(name);
  }

  async assignLeadToManager(
    assignLeadToManagerDto: AssignLeadToManagerDto,
  ): Promise<LeadManagerEntity> {
    return await this.leadManagerRepository.assignLeadToManager(
      assignLeadToManagerDto,
    );
  }

  async assignOldestLeadToManager(
    leadManager: LeadManagerEntity,
  ): Promise<LeadManagerEntity> {
    return await this.leadManagerRepository.assignOldestLeadToManager(
      leadManager,
    );
  }

  async updateLeadManager(
    leadManagerId: string,
    updateLeadManagerDto: UpdateLeadManagerDto,
  ): Promise<LeadManagerEntity> {
    return await this.leadManagerRepository.updateLeadManager(
      leadManagerId,
      updateLeadManagerDto,
    );
  }

  async isLeadManagerInterest(
    leadManagerId: string,
    interest: boolean,
  ): Promise<LeadManagerEntity> {
    return await this.leadManagerRepository.isLeadManagerInterest(
      leadManagerId,
      interest,
    );
  }

  async softDeleteLeadManager(leadManagerId: string): Promise<UpdateResult> {
    return await this.leadManagerRepository.softDeleteLeadManager(
      leadManagerId,
    );
  }

  async removeLeadManager(leadManagerId: string): Promise<DeleteResult> {
    return await this.leadManagerRepository.removeLeadManager(leadManagerId);
  }
}
