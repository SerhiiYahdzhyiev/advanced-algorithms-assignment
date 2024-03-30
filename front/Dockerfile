FROM node:lts-alpine

RUN yarn global add @angular/cli

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN yarn install

COPY . /usr/src/app

CMD ["yarn","start"]

EXPOSE 4200

