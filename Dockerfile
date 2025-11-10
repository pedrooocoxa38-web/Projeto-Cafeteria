# Use Node.js 18 oficial
FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia código da aplicação
COPY . .

# Build da aplicação
RUN npm run build

# Instala servidor estático
RUN npm install -g serve

# Expõe a porta
EXPOSE 3000

# Comando para servir a aplicação
CMD ["serve", "-s", "dist", "-l", "3000"]