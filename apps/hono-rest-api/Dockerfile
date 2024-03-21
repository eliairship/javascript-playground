FROM node:18

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY . .

RUN npm install -g nodemon

ENTRYPOINT ["sh", "-c"]

RUN npm install
RUN npm run build

EXPOSE 4000 

CMD ["npm run start"]
