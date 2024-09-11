FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install\
    && npm install typescript -g

COPY . .

RUN tsc

EXPOSE 5000
CMD ["node", "dist/server.js"]