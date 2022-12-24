# Build dependencies
FROM node:17-alpine as dependencies
WORKDIR /src
COPY package.json .
RUN npm i
COPY . . 
FROM dependencies as builder
RUN npm run build
EXPOSE 8081
CMD npm run start