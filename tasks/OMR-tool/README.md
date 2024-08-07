# OMR Tool Backend Service

## Overview

This Python app completes all the tasks needed for grading submitted bubble sheets. The app completes the following steps when a job is created for it:

1. Receives the answer key and submission PDFs from the backend.
2. Converts the PDFs into image lists that can be used by OpenCV and the inferencer.
3. The answer key images are first processed by the inferencer, detecting the question obejects, from there, contour detection and thresholding is done on each question to populate an answer key list.
4. The submissions are then processed, divided by the number of pages in the answer key, a list of images is run through the inferencer, which finds the student number section and the questions for each group of submission pages.
5. Contour detection and thresholding are done on each page and a results dict is generated to store expected and answered values, student number, final score, and if any errors are flagged.
6. Each page is also overlayed with marks denoting correct answers, wrong answers, and errors in processing to be store in the server filesystem.
7. Finally, the pages are compiled into a PDF file again, and the results and PDF file for each submission are sent as a payload to be stored in the backend, and subsequently relayed to the frontend for the professor to view.

## Installation

To run this app, you must have Poetry installed. [You may view the  installation instructions for Poetry here](https://python-poetry.org/docs/)

Once you have poetry installed, it is as simple as running 
``` poetry install ``` to install all the necessary dependencies.

You can then run the app within the poetry environment by running it within the poetry shell.
First run ```poetry shell```, and then run ```python omr_tool/app.py``` To initialize the endpoints.

As a note, if you are running the whole project on docker, these steps are covered in the Dockerfile and are not necessary to do manually within the container.

## The Object Detection Model

This repository includes a pretrained ONNX formatted model. You can find the model under ```./model_training/trained_model_onnx```

The model was trained off of a set of labeled images containing UBC bubble sheets and our own custom sheets. [You can find the image corpus here.](https://universe.roboflow.com/owlmark/omr-question-detection)

The code used to train the model is found under the submodule ```model_training/OMR-model-training```

[You can find the training submodule's repository here.](https://github.com/fperellaholfeld/OMR-model-inference)

## Developing Guidelines

- [OMR Tool Backend Service](#omr-tool-backend-service)
  - [Overview](#overview)
  - [Installation](#installation)
  - [The Object Detection Model](#the-object-detection-model)
  - [Developing Guidelines](#developing-guidelines)
    - [Tools](#tools)
    - [Setup and Installation](#setup-and-installation)
    - [Running locally](#running-locally)
      - [Running the bubble sheet generator outside of a container](#running-the-bubble-sheet-generator-outside-of-a-container)

### Tools

You will need to install the following command line tools and applications to run the application:

1. [Docker](https://docs.docker.com/get-docker/)
2. [Poetry](https://python-poetry.org/docs/)

### Setup and Installation

1. Make sure you are in the `OMR-tool` folder by running in your CLI:

```bash
pwd
```

Confirm that the output follows the following format:

```bash
**/team-7-capstone-team-7-falcon/tasks/OMR-tool
```

2. Install dependencies:

```bash
poetry install
```

3. Now, move to the `omr_tool` folder. 

```bash
cd omr_tool/
```

Confirm that you are in the right folder using `pwd`. The output should follow the following format:

```bash
**/team-7-capstone-team-7-falcon/tasks/OMR-tool/omr_tool
```

4. Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

### Running locally

#### Running the bubble sheet generator outside of a container

The following steps assume that PostgreSQL and Redis are running (for example, in a Docker container).

To start the bubble sheet generator, run:

```bash
poetry run python -m app.py
```
