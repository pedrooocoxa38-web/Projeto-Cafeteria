# 🎮 GeekHaven Brew# Welcome to your Lovable project



**A melhor cafeteria gamer da cidade!** ☕🎯## Project info



Uma aplicação web completa para gerenciar uma cafeteria temática gamer, com sistema de e-commerce, reservas de espaços e organização de torneios.**URL**: https://lovable.dev/projects/7e6d6e80-a794-48e8-bc23-f68c85c86856



---## How can I edit this code?



## 🚀 **Funcionalidades**There are several ways of editing your application.



### 🛍️ **E-commerce****Use Lovable**

- Catálogo com 54+ produtos em 10 categorias

- Carrinho de compras inteligenteSimply visit the [Lovable Project](https://lovable.dev/projects/7e6d6e80-a794-48e8-bc23-f68c85c86856) and start prompting.

- Checkout e gestão de pedidos

- Painel administrativo completoChanges made via Lovable will be committed automatically to this repo.



### 📅 **Sistema de Reservas****Use your preferred IDE**

- **4 Espaços disponíveis:**

  - Sala Gamer Premium (R$ 80/hora)If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

  - Arena Consoles (R$ 60/hora)

  - Mesa RPG & Board Games (R$ 40/hora)The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

  - Sala Streamer (R$ 120/hora) - com formulário específico

Follow these steps:

### 🏆 **Torneios**

- Organização de eventos customizados```sh

- 8 jogos suportados + categoria "Outro"# Step 1: Clone the repository using the project's Git URL.

- Integração automática com WhatsAppgit clone <YOUR_GIT_URL>

- Formulários inteligentes com preview

# Step 2: Navigate to the project directory.

---cd <YOUR_PROJECT_NAME>



## 🛠️ **Tecnologias**# Step 3: Install the necessary dependencies.

npm i

### **Frontend**

- **React 18** + TypeScript# Step 4: Start the development server with auto-reloading and an instant preview.

- **Vite** para build e dev servernpm run dev

- **Tailwind CSS** + **shadcn-ui** para design```

- **Framer Motion** para animações

- **React Router** para navegação**Edit a file directly in GitHub**

- **Date-fns** para manipulação de datas

- Navigate to the desired file(s).

### **Backend**- Click the "Edit" button (pencil icon) at the top right of the file view.

- **FastAPI** (Python)- Make your changes and commit the changes.

- **SQLAlchemy** ORM + SQLite

- **JWT** Authentication + Bcrypt**Use GitHub Codespaces**

- **Pydantic** para validação

- **CORS** configurado- Navigate to the main page of your repository.

- Click on the "Code" button (green button) near the top right.

---- Select the "Codespaces" tab.

- Click on "New codespace" to launch a new Codespace environment.

## 🚀 **Como Executar**- Edit files directly within the Codespace and commit and push your changes once you're done.



### **1. Frontend**## What technologies are used for this project?

```bash

# Instalar dependências### Frontend

npm install- Vite

- TypeScript

# Modo desenvolvimento (porta 8080)- React

npm run dev- shadcn-ui

- Tailwind CSS

# Build de produção

npm run build### Backend (NEW! ✨)

```- Python

- FastAPI

### **2. Backend**- SQLAlchemy ORM

```bash- SQLite

# Navegar para backend- JWT Authentication

cd backend- Bcrypt



# Método rápido (Windows)## 🚀 Backend Setup

.\start.ps1

Este projeto agora inclui um backend completo em Python/FastAPI!

# Método manual

python -m venv venv### Passo a passo:

.\venv\Scripts\Activate.ps1

pip install -r requirements.txt1. **Instalar Python** (se ainda não tiver)

python seed.py   - Download: https://www.python.org/downloads/

uvicorn app:app --reload   - Durante instalação, marque "Add Python to PATH"

```

2. **Navegar até a pasta do backend**

### **3. Acessar**   ```powershell

- **Frontend:** http://localhost:8080   cd backend

- **Backend API:** http://localhost:8000   ```

- **Documentação:** http://localhost:8000/docs

3. **Executar o script de inicialização**

---   ```powershell

   .\start.ps1

## 🔐 **Credenciais de Teste**   ```

   

- **Admin:** admin@geekhaven.com / admin123   Ou manualmente:

- **Usuário:** user@test.com / 123456   ```powershell

   # Criar ambiente virtual

---   python -m venv venv

   .\venv\Scripts\Activate.ps1

## 📁 **Estrutura do Projeto**   

   # Instalar dependências

```   pip install -r requirements.txt

geekhaven-brew-main/   

├── src/                    # Frontend React   # Popular banco de dados

│   ├── components/         # Componentes reutilizáveis   python seed.py

│   ├── pages/             # Páginas principais   

│   ├── hooks/             # Custom hooks   # Iniciar servidor

│   └── lib/               # Utilitários e APIs   uvicorn app:app --reload

├── backend/               # API FastAPI   ```

│   ├── routes/            # Endpoints organizados

│   ├── models/            # Modelos do banco4. **Backend rodando em**: http://localhost:8000

│   ├── schemas/           # Validação Pydantic5. **Documentação automática**: http://localhost:8000/docs

│   └── utils/             # Autenticação JWT

└── public/                # Assets estáticos### Credenciais de teste:

```- **Admin**: admin@geekhaven.com / admin123

- **Usuário**: user@test.com / 123456

---

📖 Veja [backend/README.md](backend/README.md) para documentação completa!

## 🎯 **Principais Recursos**

## How can I deploy this project?

### **🎨 Interface Moderna**

- Design responsivo e tema darkSimply open [Lovable](https://lovable.dev/projects/7e6d6e80-a794-48e8-bc23-f68c85c86856) and click on Share -> Publish.

- Carrossel automático de categorias

- Animações suaves com Framer Motion## Can I connect a custom domain to my Lovable project?

- Componentes acessíveis (Radix UI)

Yes, you can!

### **🔒 Segurança**

- Autenticação JWT robustaTo connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

- Validação completa de dados

- Proteção de rotas administrativasRead more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

- Hash bcrypt para senhas

### **📊 Gestão Completa**
- Dashboard administrativo
- Relatórios de vendas e reservas
- Controle de estoque automático
- Status tracking de pedidos

---

## 🌟 **Diferenciais**

- **Carrossel inteligente** com auto-play pausável
- **Formulário de Sala Streamer** com 12 opções configuráveis
- **Sistema de torneios** com preview e WhatsApp
- **54 produtos** pré-cadastrados
- **4 espaços** únicos para reserva
- **Interface 100% responsiva**

---

## 📈 **Status do Projeto**

✅ **Completo e Funcional**
- E-commerce: 100%
- Reservas: 100%
- Torneios: 100%
- Admin Panel: 100%
- Autenticação: 100%

---

## 📞 **Suporte**

Para dúvidas ou sugestões, entre em contato através dos canais da GeekHaven Brew!

**Desenvolvido com ❤️ para a comunidade gamer** 🎮