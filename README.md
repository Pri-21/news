# News

**This project contains the building blocks of a REST API and is meant to be a clone of a real world back-end service such as reddit.**

### Hosted version of the app-

[News App](https://pri-news-nc-app.herokuapp.com/api "News App")

---

### Clone the project with this URL

[News.git](https://github.com/Pri-21/news.git "News.git")

### Install

- [Node](https://nodejs.org/en/download/current/ "Node") - minimum version 17

##

- [PostgresSql](https://www.postgresql.org/download/ "PostgresSql") - minimum version 8

##

- [Node PG-format](https://www.npmjs.com/package/pg-format "PG-format") - minimum version 1

##

- [dotenv](https://www.npmjs.com/package/dotenv "dotenv") - minimum version 16

##

- [Express](https://www.npmjs.com/package/express "Express") - minimum version 4.17

##

- [Jest](https://jestjs.io/docs/getting-started "Jest") - minimum version 27.5

##

- [Jest extended](https://www.npmjs.com/package/jest-extended "Jest extended") - minimum version 2

##

- [Jest sorted](https://www.npmjs.com/package/jest-sorted "Jest sorted") - minimum version 1

##

- [SuperTest](https://www.npmjs.com/package/supertest "SuperTest") - minimum version 6.2

##

- [Husky](https://www.npmjs.com/package/husky "Husky") - minimum version 7

---

### To connect to the two databases after cloning the repo

_Add the following files:_

##

- .env.test

##

- .env.development

_Contents of both files:_

In the .env.test file include-

- PGDATABASE=nc_news_test

In the .env.development file include-

- PGDATABASE=nc_news

**Note**

##

Some WSL users may have to start up their PG sever with the command below

```bash
sudo service postgresql start
```

### To set up and seed the local database

Run the following commands

```bash
npm run setup-dbs
npm run seed
npm start
```

## To run tests

```bash
npm test
```

The test file is set up to seed the database every time it is run. App and Utils tests are located in the tests folder.
