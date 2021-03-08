import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateLeadManagerDto } from './create-lead-manager.dto';

export class UpdateLeadManagerDto extends PartialType(CreateLeadManagerDto) {
  @ApiProperty({ example: 'Kasra' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
