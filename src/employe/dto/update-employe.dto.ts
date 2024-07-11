import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class UpdateEmployeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsInt()
  number?: number;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  jabatan?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  departement?: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  date_of_entry?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  photo?: string;

  @IsOptional()
  @IsEnum(['kontrak', 'tetap', 'probation'])
  @IsNotEmpty()
  status?: 'kontrak' | 'tetap' | 'probation';
}
