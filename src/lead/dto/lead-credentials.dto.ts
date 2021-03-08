import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class LeadCredentialsDto {
  @ApiProperty({ example: 'Kasra' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Karami' })
  @IsString()
  @IsNotEmpty()
  family_name: string;

  @ApiProperty({ example: 'Kasra_K2K@yahoo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '09183619290' })
  @IsString()
  @Length(11)
  @Matches(/(^(09)[0123459]\d{8}$)/, {
    message: 'mobile number is wrong',
  })
  cellphone: string;
}
