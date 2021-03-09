FROM node:alpine


RUN mkdir /usr/frontend
WORKDIR /usr/frontend

COPY ./package.json ./

RUN yarn

CMD ["yarn", "start"]