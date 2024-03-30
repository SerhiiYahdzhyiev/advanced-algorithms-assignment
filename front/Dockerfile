FROM node:alpine

RUN npm install -g @angular/cli

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

CMD ["npm", "run", "start:prod"]

EXPOSE 4200

