FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de pacotes e instala todas as dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Compila o TypeScript para JavaScript
RUN npx tsc

# Remove o node_modules e o arquivo .env para evitar problemas de duplicação
RUN rm -rf node_modules .env

# Instala novamente apenas as dependências de produção
RUN npm install --only=production

# Expõe a porta usada pela aplicação
EXPOSE 5000

# Define o comando de inicialização usando o arquivo JS compilado
CMD ["node", "dist/index.js"]
