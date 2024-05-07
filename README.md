# hometest

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)

## About <a name = "about"></a>

This is a simple project to test the home assignment for the position of Backend Developer at CodingCollective.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Tech Stack

**Server:** Node, NestJs, Prisma, Bull, Redis, Postgres, JWT, Docker

## Documentation

- [Download JSON](https://github.com/dhanisetiaji/hometest/blob/main/doc/hometest.postman_collection.json)

## Run Locally

Go to the project directory

```bash
  cd hometest
```

Install dependencies

```bash
  yarn
```

Running DB, redis

```bash
    docker compose up -d
```

Create the database

```bash
  npx prisma migrate dev
```

Seed the database

```bash
  npx prisma db seed
```

Start the server

```bash
  yarn run start:dev
```
