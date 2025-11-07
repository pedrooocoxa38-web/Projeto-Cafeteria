# GeekHaven Brew - Backend API

Backend completo em FastAPI para a cafeteria geek com sistema de e-commerce e reservas.

## 🚀 Tecnologias

- **Python 3.8+**
- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **JWT** - Autenticação via tokens
- **Bcrypt** - Criptografia de senhas
- **Uvicorn** - Servidor ASGI

## 📦 Estrutura do Projeto

```
backend/
├── app.py                  # Aplicação principal FastAPI
├── database.py             # Configuração do SQLAlchemy e SQLite
├── seed.py                 # Script para popular o banco com dados iniciais
├── requirements.txt        # Dependências Python
├── models/
│   └── __init__.py        # Modelos do banco (User, Product, Order, etc.)
├── routes/
│   ├── auth.py            # Rotas de autenticação
│   ├── products.py        # Rotas de produtos
│   ├── cart.py            # Rotas do carrinho
│   ├── reservations.py    # Rotas de reservas
│   └── orders.py          # Rotas de pedidos
├── schemas/
│   └── __init__.py        # Schemas Pydantic para validação
└── utils/
    └── auth.py            # Funções de autenticação JWT
```

## 🛠️ Instalação

### 1. Instalar Python (se ainda não tiver)
- Baixe em: https://www.python.org/downloads/
- Durante instalação, marque "Add Python to PATH"

### 2. Navegar até a pasta do backend
```powershell
cd c:\Users\pedrao\Documents\PIT2\Codigo\geekhaven-brew-main\backend
```

### 3. Criar ambiente virtual (recomendado)
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 4. Instalar dependências
```powershell
pip install -r requirements.txt
```

### 5. Popular banco de dados com dados iniciais
```powershell
python seed.py
```

### 6. Iniciar o servidor
```powershell
uvicorn app:app --reload
```

O servidor estará rodando em: **http://localhost:8000**

## 📚 Documentação Automática

Após iniciar o servidor, acesse:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Credenciais de Teste

Após rodar o `seed.py`:

**Administrador:**
- Email: `admin@geekhaven.com`
- Senha: `admin123`

**Usuário comum:**
- Email: `user@test.com`
- Senha: `123456`

## 🌐 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Ver perfil (requer token)
- `PUT /api/auth/profile` - Atualizar perfil (requer token)
- `POST /api/auth/logout` - Logout

### Produtos
- `GET /api/products` - Listar todos produtos
- `GET /api/products/{id}` - Buscar produto específico
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/{id}` - Editar produto (admin)
- `DELETE /api/products/{id}` - Deletar produto (admin)

### Carrinho
- `GET /api/cart/{user_id}` - Ver carrinho
- `POST /api/cart/add` - Adicionar ao carrinho
- `PUT /api/cart/update/{item_id}` - Atualizar quantidade
- `DELETE /api/cart/remove/{item_id}` - Remover item
- `POST /api/cart/checkout` - Finalizar compra

### Reservas
- `GET /api/reservations` - Listar todas (admin)
- `GET /api/reservations/user/{user_id}` - Reservas do usuário
- `POST /api/reservations` - Criar reserva
- `PUT /api/reservations/{id}` - Editar reserva
- `DELETE /api/reservations/{id}` - Cancelar reserva

### Pedidos
- `GET /api/orders` - Listar todos (admin)
- `GET /api/orders/user/{user_id}` - Pedidos do usuário
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/{id}/status` - Atualizar status (admin)

### Teste
- `GET /api/test` - Testar conexão com backend

## 🔗 Conectando com o Frontend

O CORS já está configurado para aceitar requisições de:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (React)

### Exemplo de requisição no frontend:

```javascript
// Login
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@test.com',
    password: '123456'
  })
});

const data = await response.json();
const token = data.access_token;

// Usar token em requisições autenticadas
const profileResponse = await fetch('http://localhost:8000/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🗃️ Banco de Dados

O banco SQLite (`cafeteria.db`) será criado automaticamente na primeira execução.

### Tabelas:
- **users** - Usuários do sistema
- **products** - Produtos da cafeteria
- **cart** - Carrinho de compras
- **reservations** - Reservas de mesas
- **orders** - Pedidos realizados
- **order_items** - Itens dos pedidos

## 🐛 Solução de Problemas

### Erro: "uvicorn não é reconhecido"
```powershell
pip install uvicorn
```

### Erro: "Module not found"
```powershell
pip install -r requirements.txt
```

### Erro de permissão no PowerShell
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 📝 Notas

- Em produção, altere a `SECRET_KEY` em `utils/auth.py`
- O banco SQLite é ideal para desenvolvimento/estudo
- Para produção, considere PostgreSQL ou MySQL

---

✅ **Backend 100% funcional e pronto para uso!**
