# OwlMark: bubble-sheet marking made easy

- [Project Description](#project-description)
- [Code Structure](#code-structure)
- [Dependencies](#dependencies)
- [Installation and Setup](#installation-and-setup)
- [Built with](#built-with)
- [Authors](#authors)

## Project Description

OwlMark is a responsive web application that supports the marking and management of optically-marked exams. 

Our application was developed to be an efficient alternative to the sole Scantron machine at UBC Okanagan (UBCO). It was commissioned by Dr. Ramon Lawrence, the Academic Director of UBCO's Centre for Teaching & Learning to address the deficiencies of the university's current approach to bubble-sheet exam marking. The main target users are instructors, but students will also be able to view and review their marked exams. In particular, OwlMark allows instructors to batch upload bubble-sheet exams, efficiently mark them using an optical mark recognition (OMR) system, and to view the associated exam statistics. To account for marking errors, our system also offers a reporting system to users. 

## Code Structure

```
.
├── backend                         # Backend infrastructure
|   ├── migrations                  # Database migration files
|   ├── src                         # Relavant source code for the backend
|   ├── test                        # Integration tests for backend endpoints
|   ├── uploads                     # Files uploaded to backend that can be used by frontend application
│   └── ...
├── docs                            # Documentation files
│   ├── TOC.md                      # Table of contents
│   ├── communication               # Meeting notes and client communication
│   ├── design                      # Documentation related to the project design
│   ├── final                       # Final documentation
│   ├── plan                        # Project plan
│   └── weekly logs                 # Individual and team logs
├── frontend                        # Frontend infrastructure
|   ├── public                      # Static assets
|   ├── src                         # Source code for the frontend
│   └── ...
├── tasks                           # Utilities for the OMR system
|   ├── bubble-sheet-generator      # Utility for generating custom bubble sheets
|   ├── OMR-tool                    # Utility for grading bubble-sheet exams using computer vision
├── uploads                         # Files uploaded to the system
├── ...
├── LICENSE                         # The license for this project
└── README.md                       # This file!
```

## Dependencies

In order to run the application, the following dependencies need to be installed:

1. [Docker](https://docs.docker.com/get-docker/)
2. [psql](https://blog.timescale.com/tutorials/)
3. [nvm](https://github.com/nvm-sh/nvm)
4. [Poetry](https://python-poetry.org/docs/)

## Installation and Setup (WIP)

Please refer to the READMEs found in the subfolders for instructions to run individual components of the application.

This project uses Docker and an easy way to get the application running is to simply run 

```bash
docker-compose up
```

in the root directory.

In order to do so, you must first:

1. Setup the backend by following the [installation steps](./backend/README.md#setup-and-installation).

2. Setup the frontend by following the [installation steps](./frontend/README.md#setup-and-installation).

3. Setup the OMR utlities for the [bubble sheet generator](./tasks/bubble-sheet-generator/README.md#setup-and-installation) and the [OMR tool]().

4. Finally, in the root folder of this project (where this README is located), run:

```bash
cp .env.example .env
```

## Built with

- Frontend
  - [NextJS](https://nextjs.org/)
  - [Tailwind CSS with Flowbite](https://flowbite.com/)
- Backend
  - [NestJS](https://nestjs.com/)
  - [Python](https://www.python.org/)
- Database
  - [PostgreSQL](https://www.postgresql.org/)
- Containerization
  - [Docker](https://www.docker.com/)

## Authors

OwlMark is delivered to you by

- [Bennett Chang](https://github.com/BennettChang) 
- [Dmytro Zhuravel](https://github.com/d3li0n)
- [Francisco Perella-Holfeld](https://github.com/fperellaholfeld)
- [Ishika Agarwal](https://github.com/ishikaubc)
- [Paula Wong-Chung](https://github.com/KafkaNoNeko)
