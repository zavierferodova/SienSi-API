# SienSi-API
Sistem Informasi Presensi, website rekapitulasi tamu undangan dengan scan Kode QR.

## Setup
1. Install Node depedencies,
   ```sh
   npm install
   ```
2. Copy `.env.example` dan rename menjadi `.env`,
   ```sh
   cp .env.example .env
   ```
3. Konfigurasi environment variables pada file `.env` seperti contoh berikut,
   ```env
   # Application Configuration
   APP_KEY=SienSi-App-Key
   APP_SIGNATURE=SienSi-App-Signature

   # Database Configuration
   DB_NAME=SienSiDB.db
   ```
4. Lakukan migration dan seeding pada database untuk menyiapkan SQlite Database,
   ```sh
   npm run migrate
   npm run seed
   ```
5. Jalankan perintah untuk development atau production,
6. Enjoyy..

## Development
```sh
npm run dev
```

## Production
```sh
npm run start
```

## Authentication
```
Email    : admin@mail.com
Password : mimin
```

## Libraries
1. [ExpressJS](https://expressjs.com/)
2. [Sequelize ORM](https://sequelize.org/)
