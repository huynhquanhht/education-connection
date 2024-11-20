FROM node:18-alpine
 
WORKDIR '/education-connection'
 
COPY package.json .
 
RUN npm install
 
COPY . .

CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]