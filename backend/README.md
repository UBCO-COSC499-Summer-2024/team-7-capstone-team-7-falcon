# Developing Guidelines

- [Tools](#tools)
- [Setup and Installation](#setup-and-installation)
- [Running locally](#running-locally)
  - [Running backend application outside of container](#running-backend-application-outside-of-container)
  - [Running backend application within a container](#running-backend-application-within-a-container)
- [Development](#development)
  - [Database Changes](#database-changes)
    - [Migrations](#migrations)
  - [Testing](#testing)

## Tools

You will need to install the following command line tools and applications to run the application:

1. [Docker](https://docs.docker.com/get-docker/)
2. [psql](https://blog.timescale.com/tutorials/)
3. [nvm](https://github.com/nvm-sh/nvm)
4. [Prettier](https://prettier.io/)

## Setup and Installation

If you are planning to run or develop the application outside of the docker container, you will need to follow the steps below:

1. In the root folder of the project:

```bash
cp .env.example .env
```

2. Set Node version to 20 via nvm:

```bash
nvm use 20
```

2. Install NPM packages:

```bash
npm install
```

3. Create an `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Create an `.env.docker` file from `.env.example`:

```bash
cp .env.example .env.docker && echo "DB_HOST=postgres" | cat - .env.docker > /dev/null
```

Note (Database credentials): You don't have to modify the default values provided in the `.env` unless the root [.env](../.env) values do not match.

## Running locally

### Running backend application outside of container

The following step assumes that you either started a Docker Postgresql container or running it using a different application.

To start the backend application running in development mode:

```bash
npm run start:dev
```

To run application in production:

```bash
npm run build && npm run start:prod
```

Then, you can go to `http://localhost:3001/api/v1/health` to check if application is running

### Running backend application within a container

To start the backend application running in development mode:

```bash
docker-compose up backend postgres
```

NOTE: This might take a bit of time to start, you should check if application is running when you see the following line:

```
[Nest] 29  - **/**/2024, **:**:** **     LOG [NestFactory] Starting Nest application...
```

Then, you can go to `http://localhost:3001/api/v1/health` to check if application is running

## Development

### Database Changes

This project uses [TypeORM](https://typeorm.io/) to manage interaction with database. Files ending with `*.entity.ts` are used to define the database schema.

#### Migrations

Once you will create your entity class, you will need to generate a migration file, so that production application could synchronize your changes in database.

For the development environment, NestJS will automatically synchronize your code, but you have to commit the migration file to GitHub.

Steps to follow:

1. Ensure that you currently in the backend folder in your CLI by running:

```bash
pwd
```

and confirm output looks like:

```bash
**/team-7-capstone-team-7-falcon/backend
```

2. Run:

```bash
npm run migration:generate migrations/<MIGRATION_NAME>
```

3. You are done!

### Testing

In this project, every line of code you are adding must be tested both manually and automatically. For automation purposes, we use [Jest](https://jestjs.io/) to run unit and integration tests.

Unit tests, typically for files ending with `*.service.ts`, are added to the same workspace with the following file extension `*.service.spec.ts`.

Integration tests, typically for files ending with `*.controller.ts`, are added to the `test` folder with the the file extension `*.integration.ts`.

Before running the tests you will have to create a test database as integration tests depend on it. NOTE: You will only need to do this once unless you re-created Postgres docker image.

To create a database, run (it will prompt you for a `postgres` user password):

```bash
psql -c 'create database test;' -U postgres -h localhost
```
