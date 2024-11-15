# Education Connection Backend

## Description
This project, 'education-connection', is a backend service designed to help teachers perform administrative functions for their students. It's built using the NestJS framework, offering robust API endpoints for clients.

## Features
- Teacher can register students.
- Teacher can retrieve a list of students common to a given list of teachers.
- Teacher can suspend a specified student.
- Teacher can retrieve a list of students who can receive a given notification.

## Tech Stack

This project is built using a robust tech stack for optimal performance and scalability:

- **Backend Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Testing**: Jest
- **Code Formatting and Linting**: ESLint, Prettier

### Prerequisites
- Node.js v18.19.0

## Installation
To install the project, follow these steps:

```bash
git clone https://github.com/huynhquanhht/education-connection
cd education-connection
npm install
```

## Environment Setup

To run this project, you will need to set up the following environment variables. You can do this by creating a `.env` (local).
Let's create a new database and replace the values of environment variables.
```plaintext
# MySQL
PORT=8080
DB_HOST_MYSQL=127.0.0.1
DB_PORT_MYSQL=3306
DB_USERNAME_MYSQL=admin
DB_PASSWORD_MYSQL=admin@123
DB_NAME_MYSQL=education_connection
DB_LOGGING=DISABLED
```

## Database Migrations
To run migrations:
```bash
npm run migration:run
```

## Seeding
To run for seeding:
```bash
npm run seed:run
```


## Usage
To start the application in development mode:

```bash
npm run start
```

To build the application for production:
```bash
npm run build
```

## Running Tests
To run tests:
```bash
npm run test
```

## Running and checking coverage
```bash
npm run test:cov
```

## Note
- Following the requirement, I didn't create the API for registering a specific teacher or a specific student. Please run the seeding first to generate data. 
- Attach the postman: [Postman File](./education-connection.postman_collection.json)