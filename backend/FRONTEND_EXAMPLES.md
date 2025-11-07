# Exemplos de Como Consumir a API no Frontend React

## 1. Setup Inicial - Criar um arquivo de API

Crie um arquivo `src/lib/api.ts`:

```typescript
const API_URL = 'http://localhost:8000';

// Helper para fazer requisições autenticadas
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // Auth
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return response.json();
  },

  async getProfile() {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Products
  async getProducts() {
    const response = await fetch(`${API_URL}/api/products`);
    return response.json();
  },

  async getProduct(id: number) {
    const response = await fetch(`${API_URL}/api/products/${id}`);
    return response.json();
  },

  // Cart
  async addToCart(productId: number, quantity: number = 1) {
    const response = await fetch(`${API_URL}/api/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId, quantity })
    });
    return response.json();
  },

  async getCart(userId: number) {
    const response = await fetch(`${API_URL}/api/cart/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  async checkout() {
    const response = await fetch(`${API_URL}/api/cart/checkout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Reservations
  async createReservation(date: string, time: string, peopleCount: number) {
    const response = await fetch(`${API_URL}/api/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date, time, people_count: peopleCount })
    });
    return response.json();
  },

  async getUserReservations(userId: number) {
    const response = await fetch(`${API_URL}/api/reservations/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Orders
  async getUserOrders(userId: number) {
    const response = await fetch(`${API_URL}/api/orders/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};
```

## 2. Modificar o Index.tsx para usar produtos da API

```typescript
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const Index = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar produtos da API ao carregar a página
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      const result = await api.addToCart(productId, 1);
      toast({
        title: "Adicionado ao carrinho!",
        description: `${productName} foi adicionado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar ao carrinho",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    // ... resto do código
    <div className="flex gap-6 overflow-x-auto pb-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={() => handleAddToCart(product.id, product.name)}
        />
      ))}
    </div>
  );
};
```

## 3. Página de Login

```typescript
import { useState } from 'react';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await api.login(email, password);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit">Entrar</button>
    </form>
  );
};
```

## 4. Criar Reserva

```typescript
import { useState } from 'react';
import { api } from '@/lib/api';

const ReservationForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(2);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.createReservation(date, time, people);
      toast({
        title: "Reserva criada!",
        description: `Reserva para ${people} pessoas confirmada`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a reserva",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="date" 
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input 
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <input 
        type="number"
        value={people}
        onChange={(e) => setPeople(Number(e.target.value))}
        min={1}
        max={20}
      />
      <button type="submit">Reservar</button>
    </form>
  );
};
```

## 5. Testar Conexão

```typescript
// Teste simples para verificar se o backend está online
useEffect(() => {
  fetch('http://localhost:8000/api/test')
    .then(res => res.json())
    .then(data => console.log('Backend:', data.message))
    .catch(err => console.error('Backend offline:', err));
}, []);
```

---

## Dicas:

1. **Tratamento de erros**: Sempre use try/catch
2. **Loading states**: Mostre spinners enquanto carrega
3. **Token JWT**: É salvo no localStorage após login
4. **Logout**: Remova o token com `localStorage.removeItem('token')`
5. **React Query**: Considere usar para cache de dados
