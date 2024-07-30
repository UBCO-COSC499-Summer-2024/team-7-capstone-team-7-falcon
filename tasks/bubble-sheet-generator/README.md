# Developing Guidelines

- [Tools](#tools)
- [Setup and Installation](#setup-and-installation)
- [Running locally](#running-locally)
  - [Running the bubble sheet generator outside of a container](#running-the-bubble-sheet-generator-outside-of-a-container)
  - [Running the bubble sheet generator within a container](#running-the-bubble-sheet-generator-within-a-container)

## Tools

You will need to install the following command line tools and applications to run the application:

1. [Docker](https://docs.docker.com/get-docker/)
2. [Poetry](https://python-poetry.org/docs/)

## Setup and Installation

1. Make sure you are in the `bubble-sheet-generator` folder by running in your CLI:

```bash
pwd
```

Confirm that the output follows the following format:

```bash
**/team-7-capstone-team-7-falcon/tasks/bubble-sheet-generator
```

2. Install dependencies:

```bash
poetry install
```

3. Now, move to the `bubble_sheet_generator` folder. 

```bash
cd bubble_sheet_generator/
```

Confirm that you are in the right folder using `pwd`. The output should follow the following format:

```bash
**/team-7-capstone-team-7-falcon/tasks/bubble-sheet-generator/bubble_sheet_generator
```

4. Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

## Running locally

### Running the bubble sheet generator outside of a container

The following steps assume that PostgreSQL and Redis are running (for example, in a Docker container).

To start the bubble sheet generator, run:

```bash
poetry run python -m main
```

### Running the bubble sheet generator within a container

```bash
# TODO
```
