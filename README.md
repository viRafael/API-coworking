# API Coworking

Este projeto é uma API RESTful desenvolvida com NestJS, projetada para gerenciar um sistema de coworking. Ele serve como um template robusto e escalável para futuras aplicações, incorporando autenticação de usuário, gerenciamento de reservas, controle de salas e administração.

## Funcionalidades

-   **Autenticação e Autorização:**
    -   Registro e Login de usuários.
    -   Redefinição de senha.
    -   Autenticação JWT (JSON Web Token) com lista negra de tokens (blacklist) para logout/revogação.
    -   Guards de rota baseados em roles (ADMIN, USER).
-   **Gerenciamento de Usuários:**
    -   Criação, leitura, atualização e exclusão de usuários.
    -   Associação de roles a usuários.
-   **Gerenciamento de Salas (Rooms):**
    -   Criação, leitura, atualização e exclusão de salas de coworking.
    -   Atualização do status da sala.
-   **Gerenciamento de Reservas:**
    -   Criação, leitura, atualização e exclusão de reservas de salas.
-   **Administração:**
    -   Endpoints específicos para gerenciamento administrativo (usuários, salas).

## Tecnologias Utilizadas

-   **Backend:**
    -   [NestJS](https://nestjs.com/) (Framework Node.js progressivo)
    -   [TypeScript](https://www.typescriptlang.org/)
-   **Banco de Dados:**
    -   [PostgreSQL](https://www.postgresql.org/) (Configurável via Prisma)
    -   [Prisma ORM](https://www.prisma.io/) (ORM de próxima geração)
-   **Autenticação:**
    -   [Passport.js](http://www.passportjs.org/)
    -   [JWT (JSON Web Token)](https://jwt.io/)
    -   [Bcrypt](https://www.npmjs.com/package/bcrypt) (Para hashing de senhas)
-   **Validação:**
    -   [Class-validator](https://github.com/typestack/class-validator)
    -   [Class-transformer](https://github.com/typestack/class-transformer)
-   **Outros:**
    -   ESLint & Prettier (Para padronização de código)
    -   Swagger (Para documentação interativa da API - embutido)

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

-   [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
-   [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/) (gerenciador de pacotes)
-   [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (opcional, para rodar o PostgreSQL facilmente)

## Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/API-coworking.git
    cd API-coworking
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração do Ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example` (você precisará criar este arquivo, que contém as variáveis de ambiente necessárias).

    Exemplo de `.env`:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/coworking_db?schema=public"
    JWT_SECRET="suaChaveSecretaMuitoForte"
    JWT_ACCESS_TOKEN_EXPIRATION_TIME="1h"
    JWT_REFRESH_TOKEN_EXPIRATION_TIME="7d"
    # Variáveis para o serviço de e-mail (se configurado)
    EMAIL_SERVICE_USER="seu-email@example.com"
    EMAIL_SERVICE_PASSWORD="sua-senha-de-email"
    EMAIL_SERVICE_HOST="smtp.example.com"
    EMAIL_SERVICE_PORT=587
    EMAIL_SERVICE_SECURE=false
    ```

    **Nota:** `JWT_SECRET` deve ser uma string longa e complexa para garantir a segurança dos tokens.

4.  **Configuração do Banco de Dados (PostgreSQL com Docker):**
    Para rodar o PostgreSQL usando Docker Compose, execute:
    ```bash
    docker-compose up -d postgres
    ```
    Isso iniciará um container PostgreSQL em `localhost:5432`. Verifique o `docker-compose.yml` para os detalhes das credenciais.

5.  **Migrations do Prisma:**
    Após configurar o `DATABASE_URL` no seu `.env` e ter o banco de dados rodando, aplique as migrações:
    ```bash
    npx prisma migrate dev --name init
    ```
    Isso aplicará as migrações existentes e gerará o cliente Prisma.

## Executando a Aplicação

-   **Modo de Desenvolvimento:**
    ```bash
    npm run start:dev
    # ou
    yarn start:dev
    ```
    A aplicação estará disponível em `http://localhost:3000` (ou na porta configurada).
    A documentação Swagger estará disponível em `http://localhost:3000/api`.

-   **Modo de Produção (Build e Start):**
    ```bash
    npm run build
    npm run start:prod
    # ou
    yarn build
    yarn start:prod
    ```

## Estrutura do Projeto

A estrutura do projeto segue o padrão modular do NestJS:

```
src/
├── admin/          # Módulo para funcionalidades administrativas
├── auth/           # Módulo de Autenticação (Login, Registro, JWT)
├── common/         # Módulos e utilitários comuns (Prisma, Mail, Decorators)
├── reservations/   # Módulo de Gerenciamento de Reservas
├── room/           # Módulo de Gerenciamento de Salas
├── user/           # Módulo de Gerenciamento de Usuários
├── utils/          # Utilitários diversos
├── app.module.ts   # Módulo raiz da aplicação
├── main.ts         # Ponto de entrada da aplicação
└── ...
```

---

Espero que este `README.md` sirva como um excelente guia para você e para qualquer pessoa que venha a utilizar este projeto como base!