FROM node:20.12.2
WORKDIR /app
COPY package*.json ./
COPY ./public/ /app/public/
COPY ./src/ /app/src/
RUN npm install
EXPOSE 3000
