import { LeadRepository } from './../lead/lead.repository';
import { LeadEntity } from './../lead/entities/lead.entity';
import {
  Connection,
  DeleteResult,
  EntityRepository,
  getCustomRepository,
  Repository,
  UpdateResult,
} from 'typeorm';
import {
  ConflictException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as _ from 'lodash';
import * as config from 'config';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { LeadManagerEntity } from './entities/lead-manager.entity';
import { CreateLeadManagerDto } from './dto/create-lead-manager.dto';
import { UpdateLeadManagerDto } from './dto/update-lead-manager.dto';
import { SearchLeadManagerAndCount } from './interfaces/search.interface';
import { AssignLeadToManagerDto } from './dto/assign-lead-to-manager.dto';

@EntityRepository(LeadManagerEntity)
export class LeadManagerRepository extends Repository<LeadManagerEntity> {
  private readonly logger = new Logger(LeadManagerRepository.name);
  private leadRepository = getCustomRepository(LeadRepository);

  async createLeadManager(
    createLeadManagerDto: CreateLeadManagerDto,
  ): Promise<LeadManagerEntity> {
    const { name } = createLeadManagerDto;
    const leadManager = new LeadManagerEntity();
    _.assign(leadManager, { name });
    try {
      return await this.save(leadManager);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('leadManager with this name already exist');
      else throw new InternalServerErrorException(error.message);
    }
  }

  async GetAllLeadManager(
    options: IPaginationOptions,
  ): Promise<Pagination<LeadManagerEntity>> {
    const leadManagers = await this.createQueryBuilder('lead_managers').orderBy(
      'created_at',
      'ASC',
    );
    return await paginate<LeadManagerEntity>(leadManagers, options);
  }

  async getLeadManagerById(leadManagerId: string): Promise<LeadManagerEntity> {
    const leadManager = await this.findOne(leadManagerId);
    if (!leadManager)
      throw new NotFoundException('lead manager with this id not found');
    return leadManager;
  }

  async searchLeadManager(name: string): Promise<SearchLeadManagerAndCount> {
    const queryBuilder = await this.createQueryBuilder('lead_managers').where(
      "to_tsvector('simple', name) @@ to_tsquery('simple', :name)",
      {
        name: name + ':*',
      },
    );
    try {
      const resultAndCount = await queryBuilder.getManyAndCount();
      return { result: resultAndCount[0], count: resultAndCount[1] };
    } catch (error) {
      throw new InternalServerErrorException(
        `error on search lead manager: ${error.message}`,
      );
    }
  }

  async assignLeadToManager(
    assignLeadToManagerDto: AssignLeadToManagerDto,
  ): Promise<LeadManagerEntity> {
    const { leadId, leadManagerId } = assignLeadToManagerDto;
    const lead = await this.leadRepository.getLeadById(leadId);
    const leadManager = await this.getLeadManagerById(leadManagerId);
    leadManager.lead = lead;
    try {
      return await this.save(leadManager);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('this leadManager already have lead');
      else throw new InternalServerErrorException(error.message);
    }
  }

  async assignOldestLeadToManager(
    leadManager: LeadManagerEntity,
  ): Promise<LeadManagerEntity> {
    if (leadManager.hasOwnProperty('lead'))
      throw new ConflictException('this lead manager already has lead');
    const lead = await this.leadRepository.getOldLeadToAssign();
    if (lead) {
      leadManager.lead = lead;
      return await this.save(leadManager);
    }
  }

  async updateLeadManager(
    leadManagerId: string,
    updateLeadManagerDto: UpdateLeadManagerDto,
  ): Promise<LeadManagerEntity> {
    const leadManager = await this.getLeadManagerById(leadManagerId);
    _.assign(leadManager, updateLeadManagerDto);
    try {
      await this.save(leadManager);
    } catch (error) {
      if (error.code === '23505') throw new ConflictException(error.detail);
      else throw new InternalServerErrorException(error.message);
    }
    return leadManager;
  }

  async isLeadManagerInterest(
    leadManagerId: string,
    interest: boolean,
  ): Promise<LeadManagerEntity> {
    const leadManager = await this.getLeadManagerById(leadManagerId);
    if (!leadManager.lead)
      throw new NotFoundException('This lead Manager has not any lead');
    const lead = leadManager.lead;
    _.assign(lead, {
      interest,
      lead_manager: null,
    });
    await this.leadRepository.save(lead);
    return leadManager;
  }

  async softDeleteLeadManager(leadManagerId: string): Promise<UpdateResult> {
    return await this.softDelete(leadManagerId);
  }

  async removeLeadManager(leadManagerId: string): Promise<DeleteResult> {
    const leadManager = await this.getLeadManagerById(leadManagerId);
    leadManager.lead = null;
    await this.save(leadManager);
    return await this.delete(leadManagerId);
  }
}
