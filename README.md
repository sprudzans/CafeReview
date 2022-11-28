# Café Review
## _Simple but difficult_

## Features

- CRUD User
- CRUD Café
- CRUD Review
- CR_D Comments 

## Libs

Application uses a number of open source projects to work properly:

- [Express & Multer] - object storage 
- [NextJS] - react framework
- [Mongoose] - ORM 
- [Axios] - all requests in app 
- [Passport] - user authorizing 
- [Next-Session] - user session 
- [React-editor-js] - block styled editor
- [React-hook-form] - controlling and validate forms
- [React-redux] - controlled user's state
- [MaterialUI] - UI library of components 

## Installation

Application requires [Node.js](https://nodejs.org/) to run.

Two steps to start
- Create .env.local from .env.template and change MONGODB_URI
- Install the dependencies and start.

```sh
cd cafereview
npm i
npm run build
npm run start
```

## Docker

Application is ready to start in docker-compose. App's image will use mongo image from docker. 

```sh
cd cafereview
docker-compose up -d
``` 

## Heroku

For deployment on Heroku you need change MONGODB_URI in Dockerfile

```sh
cd cafereview
heroku create
git push heroku 
heroku open
``` 