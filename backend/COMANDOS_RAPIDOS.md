# ⚡ Comandos Rápidos

## 🚀 Iniciar Backend

```powershell
cd backend
.\start.ps1
```

**OU:**

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app:app --reload
```

---

## 🌐 Iniciar Frontend

```powershell
npm run dev
```

---

## 🗃️ Resetar Banco de Dados

```powershell
cd backend
Remove-Item cafeteria.db
python seed.py
```

---

## 📦 Instalar/Atualizar Dependências

### Backend:
```powershell
cd backend
pip install -r requirements.txt
```

### Frontend:
```powershell
npm install
```

---

## 🧪 Testar Conexão

**Backend:**
- http://localhost:8000/api/test

**Frontend:**
- http://localhost:5173

**Docs:**
- http://localhost:8000/docs

---

## 🔑 Credenciais

**Admin:**
- admin@geekhaven.com / admin123

**User:**
- user@test.com / 123456

---

## 🛑 Parar Servidores

**Tecle:** `Ctrl + C` no terminal
