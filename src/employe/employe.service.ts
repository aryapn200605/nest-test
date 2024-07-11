import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employe } from './entities/employe.entity';
import { BaseResponse } from '../common/BaseResponse';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import * as fastcsv from 'fast-csv';
import { Writable } from 'stream';

@Injectable()
export class EmployeService {
    constructor(
        @InjectRepository(Employe) private readonly employeRepository: Repository<Employe>,
    ) { }

    async createEmploye(createEmployeDto: CreateEmployeDto): Promise<BaseResponse<Employe>> {
        const employe = this.employeRepository.create(createEmployeDto);

        try {
            await this.employeRepository.save(employe);
            return new BaseResponse<Employe>('success', 'Employe created successfully', employe);
        } catch (error) {
            throw new BadRequestException('Failed to create employe');
        }
    }

    async importCsv(filePath: string): Promise<BaseResponse<Employe[]>> {
        try {
            const employes: CreateEmployeDto[] = [];
            return new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        const employe = new CreateEmployeDto();
                        employe.name = row.nama;
                        employe.number = parseInt(row.nomor, 10);
                        employe.departement = row.departmen;
                        employe.jabatan = row.jabatan;
                        employe.date_of_entry = row.tanggal_masuk;
                        employe.photo = row.foto;
                        employe.status = row.status as 'kontrak' | 'tetap' | 'probation';
                        employes.push(employe);

                    })
                    .on('end', async () => {
                        try {
                            const employeEntities = employes.map(dto => {
                                return this.employeRepository.create(dto);
                            });
                            await this.employeRepository.save(employeEntities);

                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error('Failed to delete the file:', err);
                                } else {
                                    console.log('File deleted successfully');
                                }
                            });

                            resolve(new BaseResponse<Employe[]>('success', 'Employes imported successfully', employeEntities));
                        } catch (error) {
                            reject(new BadRequestException('Failed to import employes'));
                        }
                    })
                    .on('error', (error) => {
                        reject(new BadRequestException('Failed to parse CSV file'));
                    });
            });
        } catch (error) {
            throw new BadRequestException('Failed to import employes');
        }
    }

    async exportToCsv(): Promise<BaseResponse<Buffer>> {
        try {
            const employes = await this.employeRepository.find();

            if (employes.length === 0) {
                throw new BadRequestException('No employe data found');
            }

            const csvBuffer = await new Promise<Buffer>((resolve, reject) => {
                const chunks: Buffer[] = [];
                const writableStream = new Writable({
                    write(chunk, encoding, callback) {
                        chunks.push(chunk);
                        callback();
                    }
                });

                writableStream.on('finish', () => resolve(Buffer.concat(chunks)));
                writableStream.on('error', (error) => reject(error));
                
                const csvStream = fastcsv
                    .write(employes)
                    .on('error', (error) => reject(error))
                    .pipe(writableStream);

                csvStream.on('end', () => writableStream.end()); // Properly ending the writable stream
            });

            return new BaseResponse<Buffer>('success', 'CSV data generated successfully', csvBuffer);
        } catch (error) {
            console.error('Error generating CSV data:', error);
            throw new BadRequestException(`Failed to export employes to CSV: ${error.message}`);
        }
    }

    async exportToPdf(): Promise<BaseResponse<Buffer>> {
        try {
            const employes = await this.employeRepository.find();
    
            if (employes.length === 0) {
                throw new BadRequestException('Tidak ada data karyawan yang ditemukan');
            }
    
            const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
                const doc = new PDFDocument({ bufferPages: true, size: 'letter', layout: 'landscape' });
                const buffers: Buffer[] = [];
    
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });
                doc.on('error', (error) => reject(error));
    
                // Set up table headers
                const headers = ['Nama', 'Nomor', 'Jabatan', 'Departemen', 'Tanggal Masuk', 'Status'];
                const tableData = [headers, ...employes.map(e => [
                    e.name,
                    e.number,
                    e.jabatan,
                    e.departement,
                    e.date_of_entry,
                    e.status
                ])];
    
                // Menghitung lebar kolom untuk disesuaikan
                const columnWidths = [150, 50, 100, 100, 100, 100, 100]; // Atur lebar sesuai kebutuhan
    
                // Margin atas tabel
                const startY = 50;
                let currentY = startY;
    
                // Menulis header tabel
                doc.font('Helvetica-Bold').fontSize(12);
                tableData[0].forEach((header, i) => {
                    doc.text(header, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[i], align: 'center' });
                });
    
                currentY += 20; // Tambahkan jarak untuk baris berikutnya
    
                // Menulis data karyawan
                doc.font('Helvetica').fontSize(10);
                for (let i = 1; i < tableData.length; i++) {
                    tableData[i].forEach((cell, j) => {
                        doc.text(cell, 50 + columnWidths.slice(0, j).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[j], align: 'center' });
                    });
                    currentY += 20; // Tambahkan jarak untuk baris berikutnya
                }
    
                doc.end();
            });
    
            return new BaseResponse<Buffer>('success', 'Data PDF berhasil dibuat', pdfBuffer);
        } catch (error) {
            console.error('Error generating PDF data:', error);
            throw new BadRequestException(`Gagal mengekspor data karyawan ke PDF: ${error.message}`);
        }
    }

    async findAllEmploye(): Promise<BaseResponse<Employe[]>> {
        try {
            const employes = await this.employeRepository.find();
            return new BaseResponse<Employe[]>('success', 'Employes found', employes);
        } catch (error) {
            throw new BadRequestException('Failed to find employes');
        }
    }

    async viewEmploye(id: number): Promise<BaseResponse<Employe>> {
        try {
            const employe = await this.employeRepository.findOneBy({ id });

            if (employe) {
                return new BaseResponse<Employe>('success', 'Employe found', employe);
            } else {
                return new BaseResponse<Employe>('error', 'Employe not found', null);
            }
        } catch (error) {
            throw new BadRequestException('Failed to find employe');
        }
    }

    async updateEmploye(id: number, updateEmployeDto: UpdateEmployeDto): Promise<BaseResponse<Employe>> {
        const employe = await this.employeRepository.findOneBy({ id });

        if (!employe) {
            return new BaseResponse<Employe>('error', 'Employe not found', null);
        }

        try {
            await this.employeRepository.update(id, updateEmployeDto);
            return new BaseResponse<Employe>('success', 'Employe updated successfully', { ...employe, ...updateEmployeDto });
        } catch (error) {
            throw new BadRequestException('Failed to update employe');
        }
    }

    async removeEmploye(id: number): Promise<BaseResponse<{ affected?: number }>> {
        const result = await this.employeRepository.delete(id);

        if (result.affected && result.affected > 0) {
            return new BaseResponse<{ affected?: number }>('success', 'Employe deleted successfully', { affected: result.affected });
        } else {
            return new BaseResponse<{ affected?: number }>('error', 'Employe not found', null);
        }
    }

    private convertDateFormat(dateString: string): string {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }

        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    }
}
