FROM ubuntu

COPY package.json package.json
RUN npm install --production
COPY . .

CMD [ "npm", "start" ]
EXPOSE 3000
