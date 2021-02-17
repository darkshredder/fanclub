FROM node:alpine


RUN mkdir /usr/backend
WORKDIR /usr/backend

COPY ./package.json ./

RUN npm install

CMD ["npm","run","start"]