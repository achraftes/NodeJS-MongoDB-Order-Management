

FROM node:latest
WORKDIR /app
COPY package*.json .
RUN npm install
COPY Commande.js .
EXPOSE 4001

CMD [ "npm", "run", "start" ]
