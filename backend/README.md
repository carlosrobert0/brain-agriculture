<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

- Backend:
  - cd backend
  - crie o arquivo .env: DATABASE_URL="postgresql://postgres:password@localhost:5432/brain_agriculture_db"
  - Instale as dependências com `npm install`
  - Rodar os containers com `docker-compose up -d`
  - Execute as migrações com o prisma com `npx prisma migrate dev`
  - Rode a aplicação: `npm run start:dev`
  - Acesse a API em `http://localhost:3001`
  - Documentação com Swagger em: `http://localhost:3001/docs`
  - Testes unitários
  - TypeScript, NestJS, Docker, Postgres, Prisma, Zod
