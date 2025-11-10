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

# Expõe a porta
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]