# Produtos de Comida e Bebida Adicionados

## Resumo das Alteracoes

Foi adicionado um catalogo completo de 45 produtos organizados em 9 categorias tematicas geek para a secao "Comida e Bebida" do site.

## Categorias Criadas

### 1. Cafes (5 produtos)
- Expresso Geralt (R$ 8,00)
- Latte Tardis (R$ 14,00)
- Cappuccino Pantera Negra (R$ 14,00)
- Mocha do Multiverso (R$ 16,00)
- Cafe Master Chief (R$ 10,00)

### 2. Pizzas (5 produtos)
- Pizza Fire Flower (R$ 35,00)
- Pizza Wakanda (R$ 50,00)
- Pizza Hyrule (R$ 40,00)
- Pizza Starfield (R$ 48,00)
- Pizza Gotham (R$ 38,00)

### 3. Sucos (5 produtos)
- Potion Verde (R$ 10,00)
- Suco Cibernetico (R$ 16,00)
- Potion Rosa (R$ 12,00)
- Elixir Tropical (R$ 14,00)
- Suco Kamehameha (R$ 15,00)

### 4. Hamburgueres (5 produtos)
- Burger Ragnaros (R$ 22,00)
- Boss Final (R$ 35,00)
- Combo Pikachu (R$ 28,00)
- Burger Jedi (R$ 30,00)
- Burger Kratos (R$ 33,00)

### 5. Sobremesas (5 produtos)
- Cookie Multiverso (R$ 12,00)
- Brownie Infinity Gauntlet (R$ 18,00)
- Torta da Princesa Peach (R$ 15,00)
- Pudim Pokeball (R$ 13,00)
- Milkshake Groot (R$ 16,00)

### 6. Snacks (5 produtos)
- Batata Frita Player 1 (R$ 9,00)
- Nachos do Multiverso (R$ 15,00)
- Pipoca Arcade (R$ 10,00)
- Aneis do Destino (R$ 12,00)
- Combo XP+ (R$ 14,00)

### 7. Saladas (5 produtos)
- Salada Jedi Mind Trick (R$ 18,00)
- Salada Wakfu (R$ 28,00)
- Salada Pixel Fresh (R$ 20,00)
- Salada Lara Croft (R$ 24,00)
- Salada Guardian (R$ 22,00)

### 8. Refrigerantes (5 produtos)
- Coca-Cola Player Classic (R$ 7,00)
- Soda Stark Industries (R$ 7,00)
- Guarana Mushroom Power (R$ 6,00)
- Sprite Portal (R$ 6,00)
- Fanta Multicolor (R$ 7,00)

### 9. Energy Drinks (5 produtos)
- Mana Potion (R$ 12,00)
- Cyber Brew 2077 (R$ 12,00)
- Red Vortex (R$ 14,00)
- Nitro Cola (R$ 13,00)
- XP Boost (R$ 15,00)

## Arquivos Modificados

### 1. backend/seed_food_drinks.py (NOVO)
Script para popular o banco de dados com todos os produtos de comida e bebida.

**Como executar:**
```powershell
cd backend
python seed_food_drinks.py
```

### 2. src/pages/Products.tsx (MODIFICADO)
Atualizacao da pagina de produtos para exibir os itens organizados por categorias especificas.

**Alteracoes:**
- Removida a separacao generica de "Bebidas & Comidas" vs "Produtos Geek"
- Adicionada lista de 9 categorias especificas com icones
- Funcao `getProductsByCategory()` para filtrar produtos por categoria
- Interface atualizada para exibir secoes dinamicas por categoria
- Cada categoria tem seu proprio icone visual

## Como Testar

1. **Popular o banco de dados:**
```powershell
cd backend
python seed_food_drinks.py
```

2. **Iniciar o backend:**
```powershell
cd backend
uvicorn app:app --reload
```

3. **Iniciar o frontend:**
```powershell
npm run dev
```

4. **Acessar a pagina de produtos:**
- Abra o navegador em http://localhost:8080/products
- Voce devera ver 9 secoes organizadas por categoria
- Cada secao contem 5 produtos relacionados

## Detalhes Tecnicos

- Total de produtos: 45
- Todos os produtos tem estoque configurado (40-120 unidades)
- Imagens do Unsplash para visualizacao
- Precos em Reais (R$)
- Descricoes tematicas inspiradas em cultura geek
- Sem emojis no codigo (apenas em icones de categoria)

## Credenciais de Teste

- **Admin:** admin@geekhaven.com / admin123
- **Usuario:** user@test.com / 123456
