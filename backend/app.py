"""
Aplicação principal FastAPI
GeekHaven Brew - Backend API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from database import init_db
from routes import auth, products, cart, reservations, orders

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Inicializa aplicação FastAPI
app = FastAPI(
    title="GeekHaven Brew API",
    description="API Backend para cafeteria geek com e-commerce e reservas",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração de CORS para permitir requisições do frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server alternativo
        "http://localhost:8080",  # Vite dev server (porta atual)
        "http://localhost:8081",  # Vite dev server alternativo
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "https://geekhaven-brew-1-cafeteria-front.a9negi.easypanel.host",  # Frontend produção
        "https://geekhaven.seudominio.com",  # Frontend produção backup
        "https://*.seudominio.com",  # Qualquer subdominio seu
        "*"  # Permite qualquer origem (apenas para testes)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos os headers
)


# Evento de inicialização
@app.on_event("startup")
def on_startup():
    """
    Executado quando o servidor inicia
    """
    logger.info("🚀 Iniciando GeekHaven Brew API...")
    init_db()
    logger.info("✅ Banco de dados inicializado!")
    logger.info("📚 Documentação disponível em: http://localhost:8000/docs")


# Rotas
@app.get("/")
def root():
    """
    Rota raiz - Informações da API
    """
    return {
        "message": "GeekHaven Brew API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/auth",
            "products": "/api/products",
            "cart": "/api/cart",
            "reservations": "/api/reservations",
            "orders": "/api/orders"
        }
    }


@app.get("/api/test")
def test_connection():
    """
    Rota de teste para verificar se o backend está funcionando
    """
    return {
        "message": "Backend OK",
        "status": "connected",
        "timestamp": "2025-11-03"
    }


# Registra todas as rotas
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(reservations.router)
app.include_router(orders.router)


# Handler de erros global
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Captura erros não tratados
    """
    logger.error(f"❌ Erro não tratado: {exc}")
    return {
        "message": "Erro interno do servidor",
        "detail": str(exc)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
