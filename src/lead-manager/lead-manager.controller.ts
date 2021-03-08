import { LeadEntity } from 'src/lead/entities/lead.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Logger,
  ParseIntPipe,
  Query,
  ParseUUIDPipe,
  Patch,
  ParseBoolPipe,
  Inject,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import * as config from 'config';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { LeadManagerService } from './lead-manager.service';
import { CreateLeadManagerDto } from './dto/create-lead-manager.dto';
import { UpdateLeadManagerDto } from './dto/update-lead-manager.dto';
import { LeadManagerEntity } from './entities/lead-manager.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SearchLeadManagerAndCount } from './interfaces/search.interface';
import { AssignLeadToManagerDto } from './dto/assign-lead-to-manager.dto';

const pagination = config.get('pagination');
const server = config.get('server');
const events = config.get('events');
const RMQConfig = config.get('RMQ');

@ApiTags('lead-managers')
@Controller('lead-managers')
export class LeadManagerController {
  private readonly logger = new Logger(LeadManagerController.name);

  constructor(
    @Inject('LEAD_MANAGER_SERVICE') private readonly client: ClientProxy,
    private readonly leadManagerService: LeadManagerService,
    private eventEmitter: EventEmitter2,
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                                  Endpoints                                 */
  /* -------------------------------------------------------------------------- */
  @Post()
  async createLeadManager(
    @Body(ValidationPipe) createLeadManagerDto: CreateLeadManagerDto,
  ): Promise<LeadManagerEntity> {
    const leadManager = await this.leadManagerService.createLeadManager(
      createLeadManagerDto,
    );
    // emit event to assign lead to new lead manager after create the new lead manager
    this.eventEmitter.emit(events.leadManager.free, leadManager);
    return leadManager;
  }

  @Get()
  async GetAllLeadManager(
    @Query('page', ParseIntPipe) page: number = pagination.page,
    @Query('limit', ParseIntPipe) limit: number = pagination.limit,
  ): Promise<Pagination<LeadManagerEntity>> {
    return await this.leadManagerService.GetAllLeadManager({
      page,
      limit,
      route: `${server.address}/lead-managers`,
    });
  }

  @Get('/:leadManagerId')
  async getLeadManagerById(
    @Param('leadManagerId', ParseUUIDPipe) leadManagerId: string,
  ): Promise<LeadManagerEntity> {
    return this.leadManagerService.getLeadManagerById(leadManagerId);
  }

  @Get('/search/:name')
  async searchLeadManager(
    @Param('name') name: string,
  ): Promise<SearchLeadManagerAndCount> {
    return this.leadManagerService.searchLeadManager(name);
  }

  @Patch('/assign')
  async assignLeadToManager(
    @Body(ValidationPipe) assignLeadToManagerDto: AssignLeadToManagerDto,
  ): Promise<LeadManagerEntity> {
    return await this.leadManagerService.assignLeadToManager(
      assignLeadToManagerDto,
    );
  }

  @Patch('/:leadManagerId')
  async updateLeadManager(
    @Param('leadManagerId') leadManagerId: string,
    @Body(ValidationPipe) updateLeadManagerDto: UpdateLeadManagerDto,
  ): Promise<LeadManagerEntity> {
    return await this.leadManagerService.updateLeadManager(
      leadManagerId,
      updateLeadManagerDto,
    );
  }

  @Patch('/is/interest/:leadManagerId')
  async isLeadManagerInterest(
    @Param('leadManagerId') leadManagerId: string,
    @Body('interest', ParseBoolPipe) interest: boolean,
  ): Promise<LeadManagerEntity> {
    const leadManager = await this.leadManagerService.isLeadManagerInterest(
      leadManagerId,
      interest,
    );
    // send intereste message
    if (interest)
      this.client.emit(RMQConfig.message.leadInterestedCreated, leadManager);
    // emit event to assign lead to free lead manager
    this.eventEmitter.emit(events.leadManager.free, leadManager);
    return leadManager;
  }

  @Delete('/:leadManagerId')
  async softDeleteLeadManager(
    @Param('leadManagerId', ParseUUIDPipe) leadManagerId: string,
  ): Promise<UpdateResult> {
    return await this.leadManagerService.softDeleteLeadManager(leadManagerId);
  }

  @Delete('/remove/:leadManagerId')
  async removeLeadManager(
    @Param('leadManagerId', ParseUUIDPipe) leadManagerId: string,
  ): Promise<DeleteResult> {
    return await this.leadManagerService.removeLeadManager(leadManagerId);
  }

  /* -------------------------------------------------------------------------- */
  /*                               Event Listeners                              */
  /* -------------------------------------------------------------------------- */
  @OnEvent(events.leadManager.free)
  async assignLeadToNewManager(leadManager: LeadManagerEntity): Promise<void> {
    if (leadManager.lead) delete leadManager.lead;
    await this.leadManagerService.assignOldestLeadToManager(leadManager);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  RabbitMQ                                  */
  /* -------------------------------------------------------------------------- */
  @MessagePattern(RMQConfig.message.leadInterestedCreated)
  async hello(
    @Payload() leadManager: LeadManagerEntity,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log(`${leadManager.name} interested to a lead.`);
    channel.ack(originalMsg);
  }
}
