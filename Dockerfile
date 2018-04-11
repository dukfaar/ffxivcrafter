FROM node:8
RUN apt-get install git python make g++

WORKDIR /rc/build

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:8
RUN apt-get install git python make g++

COPY package.json package.json
RUN npm install --production
COPY . .
COPY --from=0 /rc/build/bundle ./bundle

CMD [ "npm", "start" ]
EXPOSE 3000
