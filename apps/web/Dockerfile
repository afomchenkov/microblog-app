FROM node:20-bullseye

WORKDIR /app

COPY apps/web/package*.json ./
RUN npm install

COPY apps/web ./

EXPOSE 5173
CMD ["npm", "start"]
