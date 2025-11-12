#!/usr/bin/env python3
"""
Script para popular o banco de dados com dados de exemplo
Versão simplificada que funciona com os modelos existentes
"""

import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import hashlib

# Adiciona o diretório backend ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import Base, engine, SessionLocal
from models import User, Product

def create_simple_hash(password: str) -> str:
    """Cria um hash simples SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def force_seed():
    """
    Força a recriação completa do banco de dados com dados de exemplo
    """
    
    print("🔥 FORÇANDO RECRIAÇÃO COMPLETA DO BANCO...")
    
    # Recria todas as tabelas
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Usa a conexão já configurada
    db = SessionLocal()
    
    try:
        print("👤 Criando usuários...")
        
        # Usuários com hash simples
        admin_user = User(
            name="Admin User",
            email="admin@geekhaven.com", 
            password=create_simple_hash("admin123"),
            role="admin"
        )
        
        test_user = User(
            name="Usuário Teste",
            email="user@test.com",
            password=create_simple_hash("123456"),
            role="user"
        )
        
        db.add(admin_user)
        db.add(test_user)
        
        print("☕ Criando produtos...")
        
        # Lista de produtos usando apenas os campos do modelo existente
        products = [
            # Cafés Especiais
            Product(
                name="Espresso dos Arcanos",
                description="Blend exclusivo com notas de chocolate amargo e especiarias místicas",
                price=8.50,
                category="Cafés Especiais",
                image="https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400",
                stock=100
            ),
            Product(
                name="Latte dos Elementos",
                description="Café com leite vaporizado e latte art temática",
                price=12.00,
                category="Cafés Especiais",
                image="https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400",
                stock=50
            ),
            Product(
                name="Cappuccino do Mago",
                description="Cappuccino tradicional com toque de canela e chocolate",
                price=10.50,
                category="Cafés Especiais",
                image="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
                stock=75
            ),
            
            # Bebidas Geladas
            Product(
                name="Frappé da Galáxia",
                description="Bebida gelada com café, leite e calda especial azul",
                price=15.00,
                category="Bebidas Geladas",
                image="https://images.unsplash.com/photo-1546173159-315724a31696?w=400",
                stock=30
            ),
            Product(
                name="Smoothie dos Dragões",
                description="Smoothie de frutas vermelhas com decoração temática",
                price=13.50,
                category="Bebidas Geladas",
                image="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400",
                stock=25
            ),
            
            # Doces & Sobremesas
            Product(
                name="Bolo dos Hobbits",
                description="Fatia de bolo de mel com nozes, receita da Terra Média",
                price=18.00,
                category="Doces & Sobremesas",
                image="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
                stock=15
            ),
            Product(
                name="Cheesecake do Portal",
                description="Cheesecake de frutas vermelhas com calda azul",
                price=16.50,
                category="Doces & Sobremesas",
                image="https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400",
                stock=20
            ),
            Product(
                name="Brownie do Guerreiro",
                description="Brownie de chocolate intenso com nozes e sorvete",
                price=14.00,
                category="Doces & Sobremesas",
                image="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
                stock=30
            ),
            
            # Salgados
            Product(
                name="Sanduíche do Paladino",
                description="Sanduíche de peito de frango grelhado com vegetais",
                price=22.00,
                category="Salgados",
                image="https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400",
                stock=40
            ),
            Product(
                name="Wrap do Ranger",
                description="Wrap integral com carne, queijo e molho especial",
                price=19.50,
                category="Salgados",
                image="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400",
                stock=35
            ),
            
            # Merchandising
            Product(
                name="Caneca do Clérigo",
                description="Caneca temática exclusiva da casa (330ml)",
                price=35.00,
                category="Merchandising",
                image="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                stock=25
            ),
            Product(
                name="Camiseta GeekHaven",
                description="Camiseta 100% algodão com logo exclusivo",
                price=45.00,
                category="Merchandising",
                image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                stock=20
            ),
            
            # Bebidas Quentes
            Product(
                name="Chá dos Elfos",
                description="Blend especial de chás com flores e especiarias",
                price=9.00,
                category="Bebidas Quentes",
                image="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
                stock=60
            ),
            Product(
                name="Chocolate Quente do Mago",
                description="Chocolate quente cremoso com marshmallows coloridos",
                price=11.50,
                category="Bebidas Quentes",
                image="https://images.unsplash.com/photo-1542990253-0b8c7fb3cf24?w=400",
                stock=45
            ),
            
            # Combos
            Product(
                name="Combo Aventureiro",
                description="Café + Sanduíche + Doce com desconto especial",
                price=35.00,
                category="Combos",
                image="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400",
                stock=15
            )
        ]
        
        for product in products:
            db.add(product)
        
        db.commit()
        
        print("✅ Banco de dados inicializado com sucesso!")
        print("👤 Usuários criados:")
        print("  - admin@geekhaven.com / admin123 (Admin)")
        print("  - user@test.com / 123456 (Usuário)")
        print(f"☕ {len(products)} produtos criados")
        
        # Verificação
        product_count = db.query(Product).count()
        user_count = db.query(User).count()
        print(f"🔍 Verificação: {product_count} produtos e {user_count} usuários no banco")
        
    except Exception as e:
        print(f"❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    force_seed()