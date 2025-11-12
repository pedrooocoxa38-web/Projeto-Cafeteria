# Use Python 3.11 oficial
FROM python:3.11-slim

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de requirements
COPY requirements.txt .

# Instala dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia código da aplicação
COPY . .

# Torna o script executable
RUN chmod +x startup.sh

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar a aplicação
CMD ["bash", "startup.sh"]