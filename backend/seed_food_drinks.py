"""
Script para popular o banco de dados com produtos de Comida e Bebida
"""
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import User, Product, UserRole
from utils.auth import get_password_hash


def seed_food_drinks():
    """
    Popula o banco de dados com produtos de Comida e Bebida
    """
    print("Iniciando seed de produtos de Comida e Bebida...")
    
    # Inicializa o banco
    init_db()
    
    db: Session = SessionLocal()
    
    try:
        # Verifica se ja existem usuarios
        existing_users = db.query(User).count()
        if existing_users == 0:
            print("Criando usuarios...")
            # Cria usuario admin
            admin = User(
                name="Admin",
                email="admin@geekhaven.com",
                password=get_password_hash("admin123"),
                role=UserRole.ADMIN
            )
            db.add(admin)
            
            # Cria usuario teste
            test_user = User(
                name="Usuario Teste",
                email="user@test.com",
                password=get_password_hash("123456"),
                role=UserRole.USER
            )
            db.add(test_user)
            db.commit()
            print("Usuarios criados com sucesso!")
        
        # Remove produtos existentes para evitar duplicatas
        print("Removendo produtos existentes...")
        db.query(Product).delete()
        db.commit()
        
        # Lista de produtos organizados por categoria
        products = [
            # CAFES
            Product(
                name="Expresso Geralt",
                description="Cafe forte e encorpado, perfeito para quem enfrenta monstros antes do nascer do sol.",
                price=8.00,
                image="https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop",
                category="Cafes",
                stock=100
            ),
            Product(
                name="Latte Tardis",
                description="Cafe com leite e espuma de baunilha, doce e imprevisivel como uma viagem no tempo.",
                price=14.00,
                image="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
                category="Cafes",
                stock=100
            ),
            Product(
                name="Cappuccino Pantera Negra",
                description="Cappuccino com chocolate meio amargo e canela, nobre e intenso.",
                price=14.00,
                image="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
                category="Cafes",
                stock=100
            ),
            Product(
                name="Mocha do Multiverso",
                description="Mistura de cafe, chocolate e chantilly - cada gole abre uma nova dimensao.",
                price=16.00,
                image="https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=300&fit=crop",
                category="Cafes",
                stock=100
            ),
            Product(
                name="Cafe Master Chief",
                description="Cafe medio com toque de canela, energia para qualquer missao.",
                price=10.00,
                image="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
                category="Cafes",
                stock=100
            ),
            
            # PIZZAS
            Product(
                name="Pizza Fire Flower",
                description="Calabresa com pimenta e queijo, da um verdadeiro power-up de sabor.",
                price=35.00,
                image="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
                category="Pizzas",
                stock=50
            ),
            Product(
                name="Pizza Wakanda",
                description="Frango com catupiry e toque de curry - ousada e cheia de identidade.",
                price=50.00,
                image="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
                category="Pizzas",
                stock=50
            ),
            Product(
                name="Pizza Hyrule",
                description="Mussarela, tomate e manjericao - equilibrio perfeito entre tradicao e aventura.",
                price=40.00,
                image="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
                category="Pizzas",
                stock=50
            ),
            Product(
                name="Pizza Starfield",
                description="Quatro queijos espaciais - um sabor fora deste mundo.",
                price=48.00,
                image="https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=400&h=300&fit=crop",
                category="Pizzas",
                stock=50
            ),
            Product(
                name="Pizza Gotham",
                description="Pepperoni e molho especial escuro - sabor sombrio e viciante.",
                price=38.00,
                image="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
                category="Pizzas",
                stock=50
            ),
            
            # SUCOS
            Product(
                name="Potion Verde",
                description="Suco de abacaxi com hortela - restaura energia instantaneamente.",
                price=10.00,
                image="https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop",
                category="Sucos",
                stock=80
            ),
            Product(
                name="Suco Cibernetico",
                description="Mistura de melancia e gengibre - refrescante com toque futurista.",
                price=16.00,
                image="https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=300&fit=crop",
                category="Sucos",
                stock=80
            ),
            Product(
                name="Potion Rosa",
                description="Morango e limao - perfeito para recarregar o HP.",
                price=12.00,
                image="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop",
                category="Sucos",
                stock=80
            ),
            Product(
                name="Elixir Tropical",
                description="Manga, maracuja e laranja - sabor vibrante de verao geek.",
                price=14.00,
                image="https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
                category="Sucos",
                stock=80
            ),
            Product(
                name="Suco Kamehameha",
                description="Laranja com toque de gengibre - energia pura em um copo.",
                price=15.00,
                image="https://images.unsplash.com/photo-1600271889671-c685a53d2d4d?w=400&h=300&fit=crop",
                category="Sucos",
                stock=80
            ),
            
            # HAMBURGUERES
            Product(
                name="Burger Ragnaros",
                description="Carne grelhada, cheddar e molho flamejante.",
                price=22.00,
                image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
                category="Hamburgueres",
                stock=60
            ),
            Product(
                name="Boss Final",
                description="200g de carne, bacon e molho secreto - desafio lendario.",
                price=35.00,
                image="https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
                category="Hamburgueres",
                stock=60
            ),
            Product(
                name="Combo Pikachu",
                description="Hamburguer de frango empanado com molho eletrico.",
                price=28.00,
                image="https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
                category="Hamburgueres",
                stock=60
            ),
            Product(
                name="Burger Jedi",
                description="Pao australiano, carne suculenta e molho equilibrado no lado da forca.",
                price=30.00,
                image="https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop",
                category="Hamburgueres",
                stock=60
            ),
            Product(
                name="Burger Kratos",
                description="Hamburguer duplo com molho de pimenta - o sabor da guerra.",
                price=33.00,
                image="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
                category="Hamburgueres",
                stock=60
            ),
            
            # SOBREMESAS
            Product(
                name="Cookie Multiverso",
                description="Cookie gigante com gotas de chocolate - cada mordida abre uma nova dimensao.",
                price=12.00,
                image="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
                category="Sobremesas",
                stock=70
            ),
            Product(
                name="Brownie Infinity Gauntlet",
                description="Brownie com sorvete e calda quente - poder doce absoluto.",
                price=18.00,
                image="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
                category="Sobremesas",
                stock=70
            ),
            Product(
                name="Torta da Princesa Peach",
                description="Cheesecake de morango delicado e nostalgico.",
                price=15.00,
                image="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
                category="Sobremesas",
                stock=70
            ),
            Product(
                name="Pudim Pokeball",
                description="Pudim de baunilha com calda de frutas vermelhas - doce e colecionavel.",
                price=13.00,
                image="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
                category="Sobremesas",
                stock=70
            ),
            Product(
                name="Milkshake Groot",
                description="Milkshake de chocolate e amendoim - Eu sou doce.",
                price=16.00,
                image="https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
                category="Sobremesas",
                stock=70
            ),
            
            # SNACKS
            Product(
                name="Batata Frita Player 1",
                description="Batatas crocantes com cheddar e bacon - o inicio perfeito da rodada.",
                price=9.00,
                image="https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop",
                category="Snacks",
                stock=90
            ),
            Product(
                name="Nachos do Multiverso",
                description="Nachos com queijo e guacamole - sabor interdimensional.",
                price=15.00,
                image="https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop",
                category="Snacks",
                stock=90
            ),
            Product(
                name="Pipoca Arcade",
                description="Pipoca amanteigada - classica e nostalgica.",
                price=10.00,
                image="https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&h=300&fit=crop",
                category="Snacks",
                stock=90
            ),
            Product(
                name="Aneis do Destino",
                description="Onion rings crocantes - um sabor para governar todos.",
                price=12.00,
                image="https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop",
                category="Snacks",
                stock=90
            ),
            Product(
                name="Combo XP+",
                description="Mix de amendoim, batata e snacks - aumenta seu nivel de energia.",
                price=14.00,
                image="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop",
                category="Snacks",
                stock=90
            ),
            
            # SALADAS
            Product(
                name="Salada Jedi Mind Trick",
                description="Frango, alface e molho caesar - equilibrio e leveza.",
                price=18.00,
                image="https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
                category="Saladas",
                stock=40
            ),
            Product(
                name="Salada Wakfu",
                description="Grao-de-bico, abacate e tahine - nutritiva e magica.",
                price=28.00,
                image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
                category="Saladas",
                stock=40
            ),
            Product(
                name="Salada Pixel Fresh",
                description="Mix de folhas e frutas - refrescante como um novo save.",
                price=20.00,
                image="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
                category="Saladas",
                stock=40
            ),
            Product(
                name="Salada Lara Croft",
                description="Frango grelhado, quinoa e molho de limao - forca e agilidade.",
                price=24.00,
                image="https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop",
                category="Saladas",
                stock=40
            ),
            Product(
                name="Salada Guardian",
                description="Mix de proteinas e castanhas - sabor de protecao divina.",
                price=22.00,
                image="https://images.unsplash.com/photo-1467453678174-768ec283a940?w=400&h=300&fit=crop",
                category="Saladas",
                stock=40
            ),
            
            # REFRIGERANTES E ENERGY DRINKS
            Product(
                name="Coca-Cola Player Classic",
                description="O tradicional refrigerante do gamer raiz.",
                price=7.00,
                image="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop",
                category="Bebidas",
                stock=120
            ),
            Product(
                name="Soda Stark Industries",
                description="Refrigerante citrico com gas intenso - inovacao liquida.",
                price=7.00,
                image="https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=300&fit=crop",
                category="Bebidas",
                stock=120
            ),
            Product(
                name="Mana Potion",
                description="Energetico azul - restaura mana instantaneamente.",
                price=12.00,
                image="https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&h=300&fit=crop",
                category="Bebidas",
                stock=100
            ),
            Product(
                name="Cyber Brew 2077",
                description="Energetico com sabor citrico neon - estilo cyberpunk.",
                price=12.00,
                image="https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&h=300&fit=crop",
                category="Bebidas",
                stock=100
            ),
            
            # BONECOS E COLECIONAVEIS
            Product(
                name="Funko Pop! Kratos - God of War",
                description="Boneco colecionavel do lendario Deus da Guerra. Edicao limitada com detalhes em alta qualidade.",
                price=149.90,
                image="https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=300&fit=crop",
                category="Bonecos e Colecionaveis",
                stock=15
            ),
            Product(
                name="Funko Pop! Goku Super Saiyajin Blue - Dragon Ball Super",
                description="Goku em sua forma mais poderosa. Item essencial para fas de Dragon Ball.",
                price=179.90,
                image="https://images.unsplash.com/photo-1613836442253-f4c79d12e574?w=400&h=300&fit=crop",
                category="Bonecos e Colecionaveis",
                stock=12
            ),
            Product(
                name="Action Figure Spider-Man Miles Morales - Marvel",
                description="Figure articulado de alta qualidade do Homem-Aranha do multiverso, com acessorios.",
                price=299.90,
                image="https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400&h=300&fit=crop",
                category="Bonecos e Colecionaveis",
                stock=8
            ),
            Product(
                name="Estatueta The Witcher - Geralt em Batalha",
                description="Estatueta premium de resina do bruxo Geralt de Rivia em pose de combate epica.",
                price=249.90,
                image="https://images.unsplash.com/photo-1612033448550-9d6f9c17f07d?w=400&h=300&fit=crop",
                category="Bonecos e Colecionaveis",
                stock=10
            ),
            Product(
                name="Funko Pop! Pikachu Feliz - Pokemon",
                description="O Pokemon mais amado do mundo em versao Funko Pop adoravel. Novo na caixa.",
                price=139.90,
                image="https://images.unsplash.com/photo-1613836442253-f4c79d12e574?w=400&h=300&fit=crop",
                category="Bonecos e Colecionaveis",
                stock=20
            ),
            Product(
                name="Action Figure Master Chief - Halo Infinite",
                description="O lendario Spartan-117 em action figure detalhado com armadura Mjolnir Mark VI.",
                price=269.90,
                image="https://images.unsplash.com/photo-1611791483458-8715f3e4b0b8?w=400&h=300&fit=crop",
                category="Bonecos e Colecionaveis",
                stock=7
            ),
            Product(
                name="Estatueta Eleven - Stranger Things",
                description="Estatueta colecionavel da Eleven com detalhes incriveis da serie Stranger Things.",
                price=199.90,
                image="https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=300&fit=crop",
                category="Bonecos e Colecionaveis",
                stock=11
            ),
            
            # JOGOS DE TABULEIRO E CARTAS
            Product(
                name="Catan - O Jogo",
                description="O classico jogo de estrategia e negociacao. Construa colonias e domine a ilha de Catan.",
                price=149.90,
                image="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=300&fit=crop",
                category="Jogos de Tabuleiro e Cartas",
                stock=12
            ),
            Product(
                name="Ticket to Ride - Europa",
                description="Viaje pela Europa construindo ferrovias neste jogo premiado e viciante.",
                price=219.90,
                image="https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop",
                category="Jogos de Tabuleiro e Cartas",
                stock=10
            ),
            Product(
                name="Dungeons & Dragons Starter Set - Dragao da Montanha de Gelo",
                description="Kit inicial completo para comecar sua aventura no mundo de D&D. Inclui dados e fichas.",
                price=179.90,
                image="https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop",
                category="Jogos de Tabuleiro e Cartas",
                stock=8
            ),
            Product(
                name="Zombicide - 2a Edicao",
                description="Sobreviva ao apocalipse zumbi neste jogo cooperativo cheio de acao e estrategia.",
                price=359.90,
                image="https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop",
                category="Jogos de Tabuleiro e Cartas",
                stock=5
            ),
            Product(
                name="Exploding Kittens - Edicao Geek",
                description="Jogo de cartas explosivo e hilario criado pelos autores de The Oatmeal.",
                price=149.90,
                image="https://images.unsplash.com/photo-1611891487976-1ab1a9e81d00?w=400&h=300&fit=crop",
                category="Jogos de Tabuleiro e Cartas",
                stock=18
            ),
            Product(
                name="Uno - Edicao Super Mario",
                description="O classico UNO com tematica Super Mario. Diversao garantida para toda familia.",
                price=89.90,
                image="https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=400&h=300&fit=crop",
                category="Jogos de Tabuleiro e Cartas",
                stock=25
            ),
            Product(
                name="Magic: The Gathering - Deck Starter 2025",
                description="Deck inicial pronto para jogar do card game mais famoso do mundo. Edicao 2025.",
                price=149.90,
                image="https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=400&h=300&fit=crop",
                category="Jogos de Tabuleiro e Cartas",
                stock=15
            ),
            Product(
                name="Pokemon TCG - Booster Elite Pikachu Edition",
                description="Box elite com boosters exclusivos e carta promocional holografica do Pikachu.",
                price=169.90,
                image="https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop",
                category="Jogos de Tabuleiro e Cartas",
                stock=10
            ),
        ]
        
        # Adiciona todos os produtos
        for product in products:
            db.add(product)
        
        db.commit()
        
        print(f"Seed concluido com sucesso!")
        print(f"\nDados criados:")
        print(f"   Produtos: {len(products)}")
        print(f"\nCategorias de Comida e Bebida:")
        print(f"   - Cafes (5 produtos)")
        print(f"   - Pizzas (5 produtos)")
        print(f"   - Sucos (5 produtos)")
        print(f"   - Hamburgueres (5 produtos)")
        print(f"   - Sobremesas (5 produtos)")
        print(f"   - Snacks (5 produtos)")
        print(f"   - Saladas (5 produtos)")
        print(f"   - Bebidas (4 produtos - Refrigerantes e Energy Drinks)")
        print(f"\nCategorias Geek & Colecionaveis:")
        print(f"   - Bonecos e Colecionaveis (7 produtos)")
        print(f"   - Jogos de Tabuleiro e Cartas (8 produtos)")
        print(f"\nCredenciais de acesso:")
        print(f"   Admin: admin@geekhaven.com / admin123")
        print(f"   Usuario: user@test.com / 123456")
        
    except Exception as e:
        print(f"Erro ao popular banco de dados: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_food_drinks()
