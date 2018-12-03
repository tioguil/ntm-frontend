FROM node:8
WORKDIR /var/www/ntm
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]