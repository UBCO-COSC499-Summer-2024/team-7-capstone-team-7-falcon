# Developing Guidelines

- [Tools](#tools)
- [Setup and Installation](#setup-and-installation)
- [Running locally](#running-locally)
  - [Running the backend application outside of a container](#running-the-backend-application-outside-of-a-container)
  - [Running the backend application within a container](#running-the-backend-application-within-a-container)
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

To run or continue development of the application, follow the following steps:

1. In the root of the `backend` folder, run:

```bash
cp .env.example .env
```

2. Set the Node version to 20 via nvm:

```bash
nvm use 20
```

3. Install NPM packages:

```bash
npm install
```

4. Create an `.env.docker` file from `.env.docker.example`:

```bash
cp .env.docker.example .env.docker && \
echo "DB_HOST=postgres" >> .env.docker && \
echo "REDIS_HOST=redis" >> .env.docker
```

Note about database credentials: You do not have to modify the default values provided in `.env` unless the root [.env](../.env) values do not match.

In addition, make sure that you replace the values marked with asterisks with valid credentials in `.env` and `.env.docker`.

## Running locally

### Running the backend application outside of a container

The following steps assume that PostgreSQL is running (for example, in a Docker container).

To run the backend application in development mode:

```bash
npm run start:dev
```

To run the application in production mode:

```bash
npm run build && npm run start:prod
```

After running one of these commands, you can visit `http://localhost:3001/api/v1/health` to verify that the application is running.

### Running the backend application within a container

To run the backend application in development mode:

```bash
docker-compose up backend postgres
```

NOTE: This might take a moment to start. Wait until you see

```
[Nest] 29  - **/**/2024, **:**:** **     LOG [NestFactory] Starting Nest application...
```

in the terminal logs before verifying that the application is running by visiting `http://localhost:3001/api/v1/health`.

## Development

### Database Changes

This project uses [TypeORM](https://typeorm.io/) to manage interactions with the database. Files ending with `*.entity.ts` are used to define the database schema.

#### Migrations

After creating an entity class, you will need to generate a migration file. This allows your changes to be synchronized with the production application's database.

When running in development, NestJS will automatically synchronize your code, but you will need to commit the migration file to GitHub.

Steps to follow:

1. Make sure you are in the `backend` folder by running in your CLI:

```bash
pwd
```

Confirm that the output follows the following format:

```bash
**/team-7-capstone-team-7-falcon/backend
```

2. Run:

```bash
npm run migration:generate migrations/<MIGRATION_NAME>
```

3. You are done!

### Testing

In this project, every line of code added has to be both manually and automatically tested. For automation purposes, we use [Jest](https://jestjs.io/) to run unit and integration tests.

Unit tests, typically for files ending with `*.service.ts`, are added to the same workspace with the following file extension `*.service.spec.ts`.

Integration tests, typically for files ending with `*.controller.ts`, are added to the `test` folder with the the file extension `*.integration.ts`.

Before running the tests, you will first have to create a test database as the integration tests require it. Note that you will only need to do this once unless the Postgres docker image was re-created.

To create a database, run (you will be prompted to enter a `postgres` user password):

```bash
psql -c 'create database test;' -U postgres -h localhost
```
