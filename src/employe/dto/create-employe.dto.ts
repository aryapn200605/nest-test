import {
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    isURL,
    IsUrl,
    MinLength,
  } from 'class-validator';
  
  export class CreateEmployeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsInt()
    @IsNotEmpty()
    number: number;
  
    @IsString()
    @IsNotEmpty()
    jabatan: string;
  
    @IsString()
    @IsNotEmpty()
    departement: string;
  
    @IsDateString()
    @IsNotEmpty()
    date_of_entry: string;
  
    @IsNotEmpty()
    @IsUrl()
    photo: string;
  
    @IsEnum(['kontrak', 'tetap', 'probation'])
    @IsNotEmpty()
    status: 'kontrak' | 'tetap' | 'probation';
  }
  