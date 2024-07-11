import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'int' })
    number: number;

    @Column({ type: 'varchar', length: 50 })
    jabatan: string;

    @Column({ type: 'varchar', length: 50 })
    departement: string;

    @Column({ type: 'date' })
    date_of_entry: string;

    @Column({ type: 'varchar', length: 500 })
    photo: string;

    @Column({ type: 'enum', enum: ['kontrak', 'tetap', 'probation'] })
    status: 'kontrak' | 'tetap' | 'probation';
}
