FROM node:latest
WORKDIR /app
COPY package*.json .
RUN npm install
COPY  utilisateur.js .
EXPOSE 4002
CMD [ "npm", "run", "start" ]