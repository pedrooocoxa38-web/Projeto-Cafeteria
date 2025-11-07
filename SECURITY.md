# SEGURANÇA - README

## ⚠️ ANTES DE FAZER DEPLOY OU TORNAR PÚBLICO

### 1. Configurar Variáveis de Ambiente
- Copie `backend/.env.example` para `backend/.env`
- Gere uma SECRET_KEY forte (32+ caracteres aleatórios)
- Configure senhas seguras para contas de admin

### 2. Banco de Dados
- O arquivo `cafeteria.db` está no .gitignore e não será commitado
- Em produção, use PostgreSQL ou MySQL
- Nunca commite arquivos .db no Git

### 3. Credenciais de Teste
- As senhas padrão do seed são apenas para desenvolvimento
- Em produção, use senhas fortes e únicas

### 4. Arquivos Ignorados pelo Git
```
# Banco de dados
*.db
*.sqlite
*.sqlite3
backend/cafeteria.db

# Variáveis de ambiente
.env
.env.local
.env.production
```

### 5. Checklist Pré-Deploy
- [ ] SECRET_KEY alterada
- [ ] Senhas de admin alteradas
- [ ] Arquivo .env configurado
- [ ] Banco de produção configurado
- [ ] Logs de erro desabilitados em produção