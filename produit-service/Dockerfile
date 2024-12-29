FROM node:latest
WORKDIR /app
COPY package*.json .
RUN npm install
COPY  Produit.js .
EXPOSE 4000
CMD [ "npm", "run", "start" ]
