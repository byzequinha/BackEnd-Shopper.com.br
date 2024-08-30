# Backend Shopper.com.br

## Descrição

Este projeto é o backend para a aplicação Shopper.com.br, desenvolvido com Node.js e TypeScript. Utiliza MongoDB como banco de dados e está configurado para rodar em contêineres Docker.

## Tecnologias

- **Node.js**: Ambiente de execução JavaScript.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **MongoDB**: Banco de dados NoSQL.
- **Docker**: Plataforma para desenvolvimento, envio e execução de aplicativos em contêineres.
- **Gemini API**: API externa para leitura de dados de imagens.

## Configuração

### Requisitos

- Docker e Docker Compose instalados na sua máquina.

### Estrutura do Projeto

- `src/`: Contém o código-fonte do backend.
- `docker-compose.yml`: Arquivo de configuração do Docker Compose.
- `Dockerfile`: Arquivo de configuração para criar a imagem Docker do backend.
- `package.json`: Arquivo de dependências e scripts do Node.js.
- `tsconfig.json`: Configuração do TypeScript.

### Configuração do Ambiente

1. **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2. **Configure as variáveis de ambiente no arquivo `.env`:**

    ```env
    GEMINI_API_KEY=your_gemini_api_key
    ```

3. **Construa e inicie os contêineres:**

    ```bash
    docker-compose up --build
    ```

    Este comando construirá as imagens Docker e iniciará os contêineres definidos no `docker-compose.yml`.

### Endpoints da API

**Todos os endpoints estão disponíveis na porta `5000`.**

#### 1. POST `/upload`

- **Descrição:** Recebe uma imagem em base64, consulta a Gemini API e retorna a medida lida pela API.
- **Parâmetros:** 
  - `image` (string, base64) - Imagem a ser processada.

#### 2. PATCH `/confirm`

- **Descrição:** Confirma e/ou corrige o valor lido pela LLM.
- **Parâmetros:**
  - `guid` (string) - Identificador único da leitura.
  - `value` (number) - Valor corrigido ou confirmado.

#### 3. GET `/measures`

- **Descrição:** Retorna as medidas lidas.
- **Parâmetros:** Nenhum

### Testes

Para rodar os testes, execute o comando:

```bash
npm test


Autor: José Francisco Moreira Neto
E-mail: byzequnh@gmail.com
https://www.linkedin.com/in/zequinha/
https://github.com/byzequinha

          ------------ TODOS OS DIREITOS RESERVADOS -----------