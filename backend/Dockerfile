FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Gere os arquivos TS
RUN npm run build

# Exponha a porta do NestJS (ex: 3000)
EXPOSE 3000
CMD ["node", "dist/src/main.js"]