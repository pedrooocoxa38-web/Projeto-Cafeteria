"""
Configuração do banco de dados com SQLAlchemy
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuração do banco - Easypanel usa PostgreSQL, local usa SQLite
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    # Easypanel PostgreSQL
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    connect_args = {}
else:
    # Local SQLite
    SQLALCHEMY_DATABASE_URL = "sqlite:///./cafeteria.db"
    connect_args = {"check_same_thread": False}

# Criar engine do SQLAlchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)

# Criar SessionLocal para interagir com o banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos ORM
Base = declarative_base()

# Dependency para obter sessão do banco
def get_db():
    """
    Cria uma sessão de banco de dados e garante que será fechada após o uso
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Inicializa o banco de dados criando todas as tabelas
    """
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados inicializado com sucesso!")
