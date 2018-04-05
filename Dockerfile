FROM node:9

RUN apt-get install git python make g++

COPY package.json package.json
RUN npm install --production
COPY . .

CMD [ "npm", "start" ]
EXPOSE 3000
