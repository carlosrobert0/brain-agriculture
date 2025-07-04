# **Brain Agriculture - Documentação da Aplicação de Cadastro de Produtores Rurais**

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

- Frontend:

  - cd frontend
  - Instale as dependências com `npm install`
  - Inicie o servidor de desenvolvimento com `npm run dev`
  - crie o arquivo .env: NEXT_PUBLIC_API_URL=http://localhost:3001
  - Acesse a aplicação em `http://localhost:3000`
  - Nextjs, Fetch, TailwindCSS, ContextAPI, Typescript, Zod

## **O que foi desenvolvido?**

Uma aplicação para gerenciar o cadastro de produtores rurais, com os seguintes dados:

- CPF ou CNPJ
- Nome do produtor
- Nome da fazenda (propriedade)
- Cidade
- Estado
- Área total da fazenda (em hectares)
- Área agricultável (em hectares)
- Área de vegetação (em hectares)
- Safras (ex: Safra 2021, Safra 2022)
- Culturas plantadas (ex.: Soja na Safra 2021, Milho na Safra 2021, Café na Safra 2022)

### **Requisitos de negócio Garantidos**

1. Permitir o cadastro, edição e exclusão de produtores rurais.
2. Validar o CPF ou CNPJ fornecido pelo usuário.
3. Garantir que a soma das áreas agricultável e de vegetação não ultrapasse a área total da fazenda.
4. Permitir o registro de várias culturas plantadas por fazenda do produtor.
5. Um produtor pode estar associado a 0, 1 ou mais propriedades rurais.
6. Uma propriedade rural pode ter 0, 1 ou mais culturas plantadas por safra.
7. Exibir um dashboard com:
   - Total de fazendas cadastradas (quantidade).
   - Total de hectares registrados (área total).
   - Gráficos de pizza:
     - Por estado.
     - Por cultura plantada.
     - Por uso do solo (área agricultável e vegetação).

---
