FROM node:18

WORKDIR /app

COPY package*.json ./

ENV SESSION_SECRET "secretkey"
ENV MONGODB_URI "mongodb://mongo:27017/dbname"
ENV NEXT_PUBLIC_UPLOAD_LINK "http://127.0.0.1:5000/"

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
