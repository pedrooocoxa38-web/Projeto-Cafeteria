"""
Script para resetar completamente o banco de dados
"""
import os
from database import init_db
from seed import seed_database

def reset_database():
    # Remove o arquivo do banco se existir
    db_file = "cafeteria.db"
    if os.path.exists(db_file):
        os.remove(db_file)
        print(f"🗑️  Arquivo {db_file} removido")
    
    # Inicializa novo banco
    init_db()
    print("🆕 Novo banco de dados criado")
    
    # Popula com dados iniciais
    seed_database()
    print("✅ Reset do banco concluído!")

if __name__ == "__main__":
    reset_database()