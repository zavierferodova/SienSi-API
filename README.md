# SienSi
Sistem Informasi Presensi, website rekapitulasi tamu undangan dengan scan Kode QR.

## Setup
1. Install Node Depedencies
   ```sh
   npm install --legacy-peer-deps
2. Copy `.env.example` dan rename menjadi `.env`
   ```sh
   cp .env.example .env
   ```
3. Konfigurasi environment variables pada file `.env` seperti contoh berikut
   ```env
   # Application Configuration
   APP_KEY=SienSi-App-Key
   APP_SIGNATURE=SienSi-App-Signature

   # Database Configuration
   DB_NAME=SienSiDB.db
   ```
4. Lakukan migration dan seeding pada database untuk menyiapkan SQlite Database
   ```sh
   npm run migrate
   npm run seed
   ```

## Development
### Project Structure
Tree top directory structure :
```
.
├── public
├── resources
│   ├── css
│   ├── js
│   └── views
└── src
```

Penjelasan :
1. Folder `public` digunakan untuk menyimpan aset web yang dapat diakses pengguna secara terbuka
2. Folder `resources` merupakan tempat kode Front - End Web
3. Folder `src` merupakan tempat kode Server Express JS

### Menjalankan Development Server
- Express JS Development Server
  ```sh
  npm run dev
  ```
- Laravel Mix Front - End development server
  ```sh
  npm run mix-watch
  ```

## Production
1. Bundling aset Front - End
   ```sh
   npm run mix-prod
   ```
2. Jalankan Express Server
   ```sh
   npm run start
   ```
## Libraries
1. [ExpressJS](https://expressjs.com/)
2. [Sequelize ORM](https://sequelize.org/)
3. [Laravel Mix](https://laravel-mix.com/)
