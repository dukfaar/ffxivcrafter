FROM node:8-alpine
RUN apk add --update git python make g++ fftw fftw-dev
RUN apk add --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing --update vips vips-dev
RUN rm -rf /var/cache/apk/*

WORKDIR /rc/build

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:8-alpine
RUN apk add --update git python make g++ fftw fftw-dev
RUN apk add --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing --update vips vips-dev
RUN rm -rf /var/cache/apk/*

COPY package.json package.json
RUN npm install --production
COPY . .
COPY --from=0 /rc/build/bundle ./bundle

CMD [ "npm", "start" ]
EXPOSE 3000
