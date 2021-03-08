import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignLeadToManagerDto {
  @ApiProperty({ example: '6934a808-f3b6-4c13-a23c-d9c1c2f42157' })
  @IsUUID()
  leadId: string;

  @ApiProperty({ example: '6934a808-f3b6-4c13-a23c-d9c1c2f42157' })
  @IsUUID()
  leadManagerId: string;
}
