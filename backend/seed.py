"""
Script para popular o banco de dados com dados iniciais de teste
"""
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import User, Product, UserRole
from utils.auth import get_password_hash


def seed_database():
    """
    Popula o banco de dados com dados iniciais
    """
    print("🌱 Iniciando seed do banco de dados...")
    
    # Inicializa o banco
    init_db()
    
    db: Session = SessionLocal()
    
    try:
        # Verifica se já existem dados e remove tudo para recriar
        existing_users = db.query(User).all()
        if existing_users:
            print("🗑️  Removendo dados existentes...")
            db.query(User).delete()
            db.query(Product).delete()
            db.commit()
            print("✅ Dados antigos removidos")
        
        # Cria usuário admin
        admin = User(
            name="Admin",
            email="admin@geekhaven.com",
            password=get_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        db.add(admin)
        
        # Cria usuário teste
        test_user = User(
            name="Usuário Teste",
            email="user@test.com",
            password=get_password_hash("123456"),
            role=UserRole.USER
        )
        db.add(test_user)
        
        # Produtos iniciais
        products = [
            Product(
                name="Cappuccino Especial",
                description="Café premium com leite vaporizado e arte latte personalizada",
                price=12.90,
                image="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
                category="Bebidas Quentes",
                stock=50
            ),
            Product(
                name="Energy Drink Mix",
                description="Combo de energy drinks importados para maratonas gaming",
                price=18.50,
                image="https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&h=300&fit=crop",
                category="Bebidas Energéticas",
                stock=30
            ),
            Product(
                name="Brownie Gamer",
                description="Brownie artesanal com chocolate belga e castanhas",
                price=15.00,
                image="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
                category="Doces",
                stock=25
            ),
            Product(
                name="Pizza Margherita Personal",
                description="Pizza individual com molho caseiro, mussarela e manjericão",
                price=28.90,
                image="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
                category="Comidas",
                stock=20
            ),
            Product(
                name="Suco Natural Detox",
                description="Mix de frutas tropicais batido na hora",
                price=10.50,
                image="https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
                category="Bebidas Naturais",
                stock=40
            ),
            Product(
                name="Hamburguer Geek",
                description="Blend 180g, queijo cheddar, bacon e molho especial",
                price=32.00,
                image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
                category="Comidas",
                stock=15
            ),
            Product(
                name="Açaí Energy Bowl",
                description="Açaí 500ml com granola, banana e mel",
                price=22.90,
                image="https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
                category="Sobremesas",
                stock=35
            ),
            Product(
                name="Hot Dog Supremo",
                description="Salsicha premium, purê, batata palha, milho e queijo",
                price=18.50,
                image="https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=400&h=300&fit=crop",
                category="Comidas",
                stock=25
            )
        ]
        
        for product in products:
            db.add(product)
        
        db.commit()
        
        print("✅ Seed concluído com sucesso!")
        print("\n📊 Dados criados:")
        print(f"   👤 Usuários: 2")
        print(f"   📦 Produtos: {len(products)}")
        print("\n🔑 Credenciais de acesso:")
        print("   Admin: admin@geekhaven.com / admin123")
        print("   Usuário: user@test.com / 123456")
        
    except Exception as e:
        print(f"❌ Erro ao popular banco de dados: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
