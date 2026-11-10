# StudyBuddy \- Task Management SPA App

## Overview

StudyBuddy is a Single Page Application (SPA) designed to help students organize their academic life efficiently. The application provides tools for task management, habit tracking, and learning resource organization through a simple and user\-friendly interface.

## Features

- Task creation and management
- Habit tracking system
- Learning resources organization
- Responsive user interface
- Single Page Application architecture
- Easy\-to\-use design for students

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Nginx
- Docker


StudyBuddy-/
│
├── .github/
│   └── workflows/
│
├── docs/
│   ├── notes.md
│   └── screenshots/
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── LICENSE
├── Makefile
├── README.md
├── app.js
├── docker-compose.yml
├── health.html
├── index.html
├── resources.json
└── style.css


## Docker Setup

### Build the Docker Image

docker build \-t studybuddy .

### Run the Container

docker run \-d \-p 8080:80 \-\-name studybuddy\-app studybuddy

### Access the Application

Open the browser and visit:

[http://localhost:8080](http://localhost:8080)

### Stop the Container

docker stop studybuddy\-app

### Remove the Container

docker rm studybuddy\-app

## Docker Compose

To start the application using Docker Compose:

docker compose up \-d

To stop the application:

docker compose down

## Testing

After running the container:

1. Open the application in a web browser.
2. Verify that the homepage loads correctly.
3. Verify that all main interface elements are displayed properly.
4. Confirm that the application is accessible through port 8080.

Assignment Documentation
This project was containerized using Docker.

## Documentation

Additional notes are available in:

docs/notes.md

Screenshots are stored in:

docs/screenshots/

## Author

Yosuf Zoher Eldaor

## License

This project is licensed under the MIT License.

