FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["node", "--experimental-global-webcrypto", "./node_modules/vite/bin/vite.js"]