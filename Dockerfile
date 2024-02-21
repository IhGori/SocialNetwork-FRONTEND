FROM node:lts-alpine

WORKDIR /vue-social-network

COPY vue-social-network .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]