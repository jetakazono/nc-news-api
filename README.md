# Northcoders News API
Northcoders News API is an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

----
[🌐 Check the hosted version here](https://nc-news-api-tts7.onrender.com/api)

## Minimum Requirements:
- Node.js: [Download and Install Node.js](https://link-url-here.org)
- PostgreSQL: [Download and Install PostgreSQL](https://www.postgresql.org/download/)

## Built with
- Node.Js
- PostgreSQL

Project dependencies:
```
 "dotenv": "^16.0.0",
 "express": "^4.18.2",
 "pg": "^8.7.3"
```
Dev dependencies:
```
 "jest": "^25.0.0",
 "jest-sorted": "^1.0.14",
 "pg-format": "^1.0.4",
 "supertest": "^6.3.3"
```
## Installing / Getting Started
##### Clone the repository:
``` shell
 git clone https://github.com/jetakazono/nc-news-api.git
```
##### Install the dependencies:
Navigate to the project directory:
``` shell
cd nc-news-api
```
Install dependencies
```
npm install
```
##### Set up the environment variables
In your project root folder create two environment variables:
    `.env.test`
    `.env.development`

Into each add: `PGDATABASE=<database_name_here>`, with the correct database name for that environment.
See `.env-example` for assistance.
###### :warning: .env files **must be** .gitignored! 

##### :seedling: Seeding database 
set up the database:
```
  npm run setup-dbs
```
set up the connection:
```
  npm run seed
```
#### Testing
Run tests:

```
  npm test
```

## Endpoints

#### Core Endpoints
* GET `/api/topics`
    * responds with a list of topics
* GET `/api`
    * responds with a list of available endpoints
* GET `/api/articles/:article_id`
    * responds with a single article by article_id
* GET `/api/articles`
    * responds with a list of articles
* GET `/api/articles/:article_id/comments`
    * responds with a list of comments by article_id
* POST `/api/articles/:article_id/comments`
    * add a comment by article_id
* PATCH `/api/articles/:article_id`
    * updates an article by article_id
* DELETE `/api/comments/:comment_id`
    * deletes a comment by comment_id
* GET `/api/users`
    * responds with a list of users

#### Feature Endpoints
* GET `/api/articles (queries)`
    * allows articles to be filtered and sorted
* GET `/api/articles/:article_id` (comment count)
    * adds a comment count to the response when retrieving a single article

### :rocket: Deploying / Publishing

* Hosting PSQL DB: [ElephantSQL](https://www.elephantsql.com/)
* Hosting the API: [Render](https://render.com/)

### Author
👩🏻‍💻 Jessica, with valuable mentorship provided by [Northcoders](https://northcoders.com/)
