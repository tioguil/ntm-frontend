	#FROM node:8
	#WORKDIR /var/www/ntm
	#COPY package*.json ./
	#RUN npm install
	#COPY . .
	#CMD ["npm", "start"]


# base image
FROM node:8

# set working directory
RUN mkdir /usr/src/ntm
WORKDIR /usr/src/ntm

# add `/usr/src/ntm/node_modules/.bin` to $PATH
ENV PATH /usr/src/ntm/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/ntm/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent

# start app
CMD ["npm", "start"]