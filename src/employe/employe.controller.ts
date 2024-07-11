import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EmployeService } from './employe.service';
import { Employe } from './entities/employe.entity';
import { BaseResponse } from '../common/BaseResponse';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller('employes')
export class EmployeController {
  constructor(private readonly employeService: EmployeService) { }

  @Post()
  async create(
    @Body() createEmployeDto: CreateEmployeDto,
  ): Promise<BaseResponse<Employe>> {
    try {
      const employe = await this.employeService.createEmploye(createEmployeDto);
      return employe;
    } catch (error) {
      return new BaseResponse<Employe>('error', error.message, null);
    }
  }

  @Get('csv')
  async exportToCsv(@Res() res: Response): Promise<void> {
    const result: BaseResponse<Buffer> = await this.employeService.exportToCsv();
    if (result.status === 'success') {
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename="employes.csv"');
      res.send(result.data);
    } else {
      res.status(400).json(result);
    }
  }

  @Get('pdf')
  async exportToPdf(@Res() res: Response): Promise<void> {
    const result: BaseResponse<Buffer> = await this.employeService.exportToPdf();
    if (result.status === 'success') {
      res.header('Content-Type', 'application/pdf');
      res.header('Content-Disposition', 'attachment; filename="employes.pdf"');
      res.send(result.data);
    } else {
      res.status(400).json(result);
    }
  }

  @Get()
  async findAll(): Promise<BaseResponse<Employe[]>> {
    try {
      const employes = await this.employeService.findAllEmploye();
      return employes;
    } catch (error) {
      return new BaseResponse<Employe[]>('error', error.message, null);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BaseResponse<Employe>> {
    try {
      const employe = await this.employeService.viewEmploye(id);
      return employe;
    } catch (error) {
      return new BaseResponse<Employe>('error', error.message, null);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEmployeDto: UpdateEmployeDto,
  ): Promise<BaseResponse<Employe>> {
    try {
      const employe = await this.employeService.updateEmploye(id, updateEmployeDto);
      return employe;
    } catch (error) {
      return new BaseResponse<Employe>('error', error.message, null);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<BaseResponse<{ affected?: number }>> {
    try {
      const result = await this.employeService.removeEmploye(id);
      return result;
    } catch (error) {
      return new BaseResponse<{ affected?: number }>('error', error.message, null);
    }
  }

  @Post('import-csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const newFilename = `${name}-${Date.now()}${fileExtName}`;
          cb(null, newFilename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(csv)$/)) {
          return cb(new BadRequestException('Only CSV files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async importCsv(@UploadedFile() file: Express.Multer.File): Promise<BaseResponse<Employe[]>> {
    try {
      const result = await this.employeService.importCsv(file.path);
      return result;
    } catch (error) {
      return new BaseResponse<Employe[]>('error', error.message, null);
    }
  }
}
