# Advanced Algorithms Module Assignment

This repository contains the code for the Advanced Algorithms module assignment
, which consists of a mock database and an Single Page Application with
minimalistic interface. The provided `docker-compose.yaml` file allows users to
easily set up and run the entire application stack using Docker Compose.

The main goal of this assignment was to design an algorithm to schedule the
lectures in the university. The SPA consists of three pages, each one represents
a key entity: _Professor_, _Lecture_, and _Classroom_. There is also a
`Generate Schedule` button in the main header, which triggers the algorythm. All
entities have their attributes. More detailed reviview will be provided in the
submited report of this assignment.

## Getting Started

To get started with running the application, follow these instructions:

### Prerequisites

The following software needs to be installed on your machine:

- Docker
- Docker Compose

You can use this links for detailed installation instructions:

- [Get Docker](https://docs.docker.com/get-docker/)
- [Install Docker Engine](https://docs.docker.com/engine/install/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/SerhiiYahdzhyiev/advanced-algorithms-assignment.git
   ```

2. Navigate into the project directory:

   ```bash
   cd advanced-algorithm-assignment
   ```

3. Build and start the Docker containers:

   ```bash
   docker-compose up -d --build
   ```

4. Once the containers are up and running, you can access the Angular SPA at
   `http://localhost:4200`.

## License

This project is licensed under the [MIT License](LICENSE).
