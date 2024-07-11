# Sistem Manajemen Karyawan

## Deskripsi
Proyek ini adalah contoh sederhana dari Sistem Manajemen Karyawan menggunakan NestJS sebagai backend API. Aplikasi ini dirancang untuk melakukan operasi CRUD (Create, Read, Update, Delete) terhadap data karyawan. Menggunakan TypeORM untuk interaksi dengan database, proyek ini spesifik menggunakan PostgreSQL sebagai basis data utama.

## Fitur-fitur
1. **CRUD Karyawan**
   - Membuat, Membaca, Memperbarui, dan Menghapus data karyawan.
   - Endpoint API untuk mengelola data karyawan.

2. **Informasi Karyawan**
   - Menyimpan informasi karyawan seperti nama, nomor karyawan, jabatan, departemen, tanggal masuk, foto, dan status.

3. **Import Data dari CSV**
   - Kemampuan untuk mengimpor data karyawan dari file CSV ke dalam sistem.

4. **Export Data ke PDF dan CSV**
   - Mengeksport data karyawan ke dalam format file PDF dan CSV.

## Instalasi
1. Clone repository: `git clone https://github.com/aryapn200605/nest-test.git`
2. Masuk ke direktori proyek: `cd nest-test`
3. Install dependencies: `npm install`
4. Pastikan database `db_test` telah dibuat di PostgreSQL.

Pastikan untuk mengkonfigurasi koneksi database pada file `.env` sesuai dengan pengaturan database PostgreSQL Anda.


## Menjalankan Aplikasi
```bash
npm run start
```

Pastikan untuk memastikan koneksi database telah terkonfigurasi dengan benar sebelum menjalankan aplikasi.

## Endpoint API
Gunakan URL localhost:3000 untuk semua endpoint berikut:
- **GET /employes**: Mendapatkan semua data karyawan.
- **GET /employes/:id**: Mendapatkan data karyawan berdasarkan ID.
- **POST /employes**: Membuat data karyawan baru.
  - Body:
    ```json
    {
      "name": "John Doe",
      "number": "EMP001",
      "jabatan": "Backend Developer",
      "department": "Tech",
      "date_of_entry": "2024-07-11",
      "photo": "https://url.com",
      "status": "tetap"
    }
    ```
- **PUT /employes/:id**: Memperbarui data karyawan berdasarkan ID.
  - Body (mirip dengan POST).
- **DELETE /employes/:id**: Menghapus data karyawan berdasarkan ID.
- **POST /employes/import-csv**: Mengimpor data menggunakan file CSV.
- **GET /employes/csv**: Mengekspor data ke dalam file CSV.
- **GET /employes/pdf**: Mengekspor data ke dalam file PDF.


## Teknologi yang Digunakan
- NestJS
- TypeScript 
- TypeORM
- PostgreSQL
