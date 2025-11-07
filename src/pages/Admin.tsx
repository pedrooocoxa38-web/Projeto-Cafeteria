import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  MapPin, 
  ShoppingBag, 
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  CalendarDays,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  productsAPI, 
  reservationsAPI, 
  ordersAPI, 
  Product, 
  Reservation, 
  Order 
} from "@/lib/api";
import { Link } from "react-router-dom";

const Admin = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product form state
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_available: true,
  });

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <Card className="p-12 text-center space-y-6 max-w-md mx-auto">
              <h1 className="text-3xl font-bold">Acesso negado</h1>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar o painel administrativo
              </p>
              <Link to="/">
                <Button size="lg" className="shadow-glow">
                  Voltar ao início
                </Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, reservationsData, ordersData] = await Promise.all([
        productsAPI.getAll(),
        reservationsAPI.getAll(),
        ordersAPI.getAll(),
      ]);
      
      setProducts(productsData);
      setReservations(reservationsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productData.name || !productData.price || !productData.category) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const productPayload = {
        ...productData,
        price: parseFloat(productData.price),
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productPayload);
        toast({
          title: "Produto atualizado!",
          description: "As alterações foram salvas com sucesso",
        });
      } else {
        await productsAPI.create(productPayload);
        toast({
          title: "Produto criado!",
          description: "O produto foi adicionado com sucesso",
        });
      }

      // Reset form and reload data
      setProductData({ name: '', description: '', price: '', category: '', image_url: '', is_available: true });
      setEditingProduct(null);
      setProductDialogOpen(false);
      await loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await productsAPI.delete(id);
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso",
      });
      await loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url || '',
      is_available: product.is_available,
    });
    setProductDialogOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      toast({
        title: "Status atualizado",
        description: "O status do pedido foi alterado",
      });
      await loadData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReservationStatus = async (reservationId: number, status: string) => {
    try {
      await reservationsAPI.updateStatus(reservationId, status);
      toast({
        title: "Status atualizado",
        description: "O status da reserva foi alterado",
      });
      await loadData();
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  const stats = [
    { 
      label: "Total Vendas", 
      value: `R$ ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`, 
      icon: DollarSign, 
      trend: `${orders.length} pedidos` 
    },
    { 
      label: "Pedidos", 
      value: orders.length.toString(), 
      icon: ShoppingBag, 
      trend: `${orders.filter(o => o.status === 'pending').length} pendentes` 
    },
    { 
      label: "Produtos", 
      value: products.length.toString(), 
      icon: Package, 
      trend: `${products.filter(p => p.is_available).length} disponíveis` 
    },
    { 
      label: "Reservas", 
      value: reservations.length.toString(), 
      icon: Users, 
      trend: `${reservations.filter(r => r.status === 'confirmed').length} confirmadas` 
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie produtos, reservas e pedidos</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-green-500 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="reservations">Reservas</TabsTrigger>
              <TabsTrigger value="customers">Clientes</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Pedidos</h2>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum pedido encontrado
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold">Pedido #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} itens • {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg">R$ {order.total.toFixed(2)}</span>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="preparing">Preparando</SelectItem>
                              <SelectItem value="ready">Pronto</SelectItem>
                              <SelectItem value="delivered">Entregue</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
                  <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar Produto
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome *</Label>
                          <Input
                            id="name"
                            value={productData.name}
                            onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={productData.description}
                            onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Preço *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={productData.price}
                              onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Categoria *</Label>
                            <Select
                              value={productData.category}
                              onValueChange={(value) => setProductData(prev => ({ ...prev, category: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Bebidas">Bebidas</SelectItem>
                                <SelectItem value="Comidas">Comidas</SelectItem>
                                <SelectItem value="Geek">Geek</SelectItem>
                                <SelectItem value="Board Games">Board Games</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="image_url">URL da Imagem</Label>
                          <Input
                            id="image_url"
                            value={productData.image_url}
                            onChange={(e) => setProductData(prev => ({ ...prev, image_url: e.target.value }))}
                          />
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setProductDialogOpen(false);
                              setEditingProduct(null);
                              setProductData({ name: '', description: '', price: '', category: '', image_url: '', is_available: true });
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit" className="flex-1">
                            {editingProduct ? 'Salvar' : 'Criar'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-32 bg-muted/30 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum produto cadastrado
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="p-4">
                        <div className="flex gap-3">
                          <img 
                            src={product.image_url || "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop"} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="reservations">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Reservas</h2>
                </div>
                
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : reservations.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma reserva encontrada
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div 
                        key={reservation.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold">Reserva #{reservation.id}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              <span>{new Date(reservation.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{reservation.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{reservation.people} pessoas</span>
                            </div>
                          </div>
                          {reservation.notes && (
                            <p className="text-sm text-muted-foreground">{reservation.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Select
                            value={reservation.status}
                            onValueChange={(value) => handleUpdateReservationStatus(reservation.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="confirmed">Confirmada</SelectItem>
                              <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="customers">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Estatísticas</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Produtos por Categoria</h3>
                    {loading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-6 bg-muted/30 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(
                          products.reduce((acc, product) => {
                            acc[product.category] = (acc[product.category] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([category, count]) => (
                          <div key={category} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                            <span>{category}</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Status dos Pedidos</h3>
                    {loading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-6 bg-muted/30 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(
                          orders.reduce((acc, order) => {
                            acc[order.status] = (acc[order.status] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([status, count]) => (
                          <div key={status} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                            <span className="capitalize">{status}</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
