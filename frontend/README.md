# Developing Guidelines

- [Tools](#tools)
- [Setup and Installation](#setup-and-installation)
- [Running locally](#running-locally)
  - [Running the frontend application outside of a container](#running-the-frontend-application-outside-of-a-container)

## Tools

You will need to install the following command line tools and applications to run the application:

1. [Docker](https://docs.docker.com/get-docker/)
2. [nvm](https://github.com/nvm-sh/nvm)

## Setup and Installation

1. In the root of the `frontend` folder, create a `.env.local` file from `.env.local.example`:

```bash
cp .env.local.example .env.local
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
cp .env.docker.example .env.docker
```

## Running locally

### Running the frontend application outside of a container

Note: For the frontend to function correctly, the backend, bubble sheet generator, and OMR tool must be running.

To run the frontend application in development mode:

```bash
npm run dev
```

To run the application in production mode:

```bash
npm run build && npm run start
```

After running one of these commands, you can visit [http://localhost:3000](http://localhost:3000) to verify that the application is running.
