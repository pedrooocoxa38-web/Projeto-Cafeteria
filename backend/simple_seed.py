"""
Seed simples para resolver problemas de bcrypt
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from database import Base

# Criar engine e sessão
DATABASE_URL = "sqlite:///cafeteria.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def create_simple_users():
    """Cria usuários com senhas simples usando hash manual"""
    
    # Remove banco existente
    try:
        os.remove("cafeteria.db")
        print("🗑️ Banco antigo removido")
    except:
        pass
    
    # Cria tabelas
    Base.metadata.create_all(bind=engine)
    print("📊 Tabelas criadas")
    
    db = SessionLocal()
    
    try:
        # Limpar dados existentes
        db.execute(text("DELETE FROM cart"))
        db.execute(text("DELETE FROM order_items"))
        db.execute(text("DELETE FROM orders"))
        db.execute(text("DELETE FROM reservations"))
        db.execute(text("DELETE FROM products"))
        db.execute(text("DELETE FROM users"))
        db.commit()
        print("🗑️ Dados antigos removidos")
        
        # Inserir usuário admin com SQL direto (senha = admin123)
        # Hash gerado manualmente para admin123
        admin_hash = "$2b$12$LQv3c1yqBa9VXayyMQzlduL.NCF.NrFJ5EjlzNa8l2V5lJyh1wQFa"
        
        db.execute(text("""
            INSERT INTO users (name, email, password, role) 
            VALUES ('Admin', 'admin@geekhaven.com', :password, 'ADMIN')
        """), {"password": admin_hash})
        
        # Hash gerado manualmente para 123456
        user_hash = "$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"
        
        db.execute(text("""
            INSERT INTO users (name, email, password, role) 
            VALUES ('Usuario Teste', 'user@test.com', :password, 'USER')
        """), {"password": user_hash})
        
        # Inserir produtos
        produtos = [
            ("Café Expresso", "Café expresso tradicional", 4.50, "bebidas", "https://via.placeholder.com/400x300?text=Café+Expresso", 50),
            ("Cappuccino", "Café com leite vaporizado", 6.00, "bebidas", "https://via.placeholder.com/400x300?text=Cappuccino", 30),
            ("Sanduíche Natural", "Sanduíche com peito de peru", 8.00, "lanches", "https://via.placeholder.com/400x300?text=Sanduíche", 20),
            ("Bolo de Chocolate", "Fatia de bolo caseiro", 7.50, "doces", "https://via.placeholder.com/400x300?text=Bolo", 15)
        ]
        
        for nome, desc, preco, cat, img, stock in produtos:
            db.execute(text("""
                INSERT INTO products (name, description, price, category, image, stock) 
                VALUES (:name, :desc, :price, :cat, :img, :stock)
            """), {"name": nome, "desc": desc, "price": preco, "cat": cat, "img": img, "stock": stock})
        
        db.commit()
        print("✅ Usuários e produtos criados com sucesso!")
        print("🔑 Credenciais:")
        print("   Admin: admin@geekhaven.com / admin123")
        print("   User:  user@test.com / 123456")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_simple_users()