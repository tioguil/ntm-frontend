FROM node:8
WORKDIR /var/wwww/ntm
COPY package*.json ./
RUN npm install
COPY . .
CMD {"npm", "start"}
