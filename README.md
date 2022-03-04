# News

Link to the hosted version of the app
https://pri-news-nc-app.herokuapp.com/api

Clone the project with this URL
https://github.com/Pri-21/news.git

Install node - minimum version 17
Install PostgresSql - minimum version 8

Dependencies to install
dotenv 16
express 4.17.3
pg 8.7.3
pg-format 1.0.4

Dev dependencies to install
jest 27.5.1
jest extended 2
jest sorted 1
supertest 6.2.2
husky 7

To connect to the two databases after cloning the repo,

Add the following files:
.env.test
.env.development

Contents of both files:

In the .env.test file include-
PGDATABASE=nc_news_test

In the .env.development file include-
PGDATABASE=nc_news

Some WSL users may have to start up their PG sever with the command below
sudo service postgresql start

To set up and seed the local database, run the following commands
npm run setup-dbs
npm run seed
npm start

The test file is set up to seed the database every time it is run
npm test
npm test app.test to specifically run tests using the jest framework
