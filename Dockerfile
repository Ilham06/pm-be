# Gunakan image Node.js
FROM node:18

# Set direktori kerja
WORKDIR /app

# Copy file package.json dan lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code, termasuk .env
COPY . . 

# Copy file .env ke dalam container (jika ada)
COPY .env ./

# Jalankan prisma generate dengan memberi tahu lokasi schema.prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Jalankan migrasi database
RUN npx prisma migrate deploy --schema=src/prisma/schema.prisma

# Build NestJS
RUN npm run build

# Start app
CMD ["node", "dist/main.js"]
