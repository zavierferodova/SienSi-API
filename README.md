# SienSi-API
Sistem Informasi Presensi, website rekapitulasi tamu undangan dengan scan Kode QR.

## Setup
1. Install Node depedencies,
   ```sh
   npm install
   ```
2. Pastikan anda sudah memiliki akun [Resend](https://resend.com) dengan domain terferifikasi,
3. Pastikan komputer anda telah terinstall [Redis](https://redis.io) server dengan host `localhost` dan port `6379`,
4. Copy `.env.example` dan rename menjadi `.env`,
   ```sh
   cp .env.example .env
   ```
5. Konfigurasi environment variables pada file `.env` seperti contoh berikut,
   ```env
   # Application Configuration
   APP_KEY=SienSi-App-Key
   APP_SIGNATURE=SienSi-App-Signature

   # Database Configuration
   DB_NAME=SienSiDB.db

   # Resend Mail Configuration
    RESEND_API_KEY=<your_resend_key>
    RESEND_VERIFIED_DOMAIN=<your_verified_domain>
   ```
6. Lakukan migration dan seeding pada database untuk menyiapkan SQlite Database,
   ```sh
   npm run migrate
   npm run seed
   ```
7. Jalankan perintah untuk development atau production,
8. Enjoyy..

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
