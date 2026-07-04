# Backend Docker Setup

Maine backend ko locally run karne ke liye Dockerise kar diya hai. Ab database manually set up karne ki ya `.env` variables khud configure karne ki zarurat nahi padegi.

## Kaise Run Karein?

1. Apne terminal mein project ki root directory mein jayein:
   ```bash
   cd /home/rajku/small_dih_big_dreams/alaska
   ```

2. Docker Compose ke through services start karein:
   ```bash
   docker-compose up --build
   ```

## Yeh kya karega?
- **db:** Ek PostgreSQL container start karega jiska user `postgres` aur password `password` hoga.
- **api:** Aapka Node.js backend start karega (using `nodemon` taaki aapka code save hote hi auto-restart ho).
- **Auto Migration:** Start hote hi backend automatically `npx prisma db push` run karega taaki DB me saare tables generate ho jayein.

Backend API aapko http://localhost:3000 par mil jayegi!
