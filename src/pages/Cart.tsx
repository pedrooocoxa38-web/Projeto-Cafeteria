import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cartAPI, Cart as CartType } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load cart data
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const loadCart = async () => {
      try {
        const cartData = await cartAPI.get(user.id);
        setCart(cartData);
      } catch (error) {
        console.error('Error loading cart:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o carrinho",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user, toast]);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }

    if (!user) return;

    setUpdating(true);
    try {
      await cartAPI.updateItem(itemId, newQuantity);
      
      // Reload cart data
      const updatedCart = await cartAPI.get(user.id);
      setCart(updatedCart);
      
      toast({
        title: "Quantidade atualizada",
        description: "O item foi atualizado no carrinho",
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!user) return;

    setUpdating(true);
    try {
      await cartAPI.removeItem(itemId);
      
      // Reload cart data
      const updatedCart = await cartAPI.get(user.id);
      setCart(updatedCart);
      
      toast({
        title: "Item removido",
        description: "O item foi removido do carrinho",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o item",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const checkout = async () => {
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar",
        variant: "destructive",
      });
      return;
    }

    // Redirect to payment page instead of checkout directly
    navigate('/payment', { state: { cart, total } });
  };

  // Redirect if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <Card className="p-12 text-center space-y-6 max-w-md mx-auto">
              <h1 className="text-3xl font-bold">Login necessário</h1>
              <p className="text-muted-foreground">
                Faça login para acessar seu carrinho
              </p>
              <Link to="/auth">
                <Button size="lg" className="shadow-glow">
                  Fazer Login
                </Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const subtotal = cart?.total || 0;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Meu Carrinho</h1>

          {loading ? (
            <Card className="p-12 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
              </div>
            </Card>
          ) : cartItems.length === 0 ? (
            <Card className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
                <p className="text-muted-foreground">Adicione produtos para continuar</p>
              </div>
              <Link to="/products">
                <Button size="lg" className="shadow-glow">
                  Ver Produtos
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={item.product.image || "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop"} 
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={updating}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              disabled={updating}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              disabled={updating}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <span className="text-xl font-bold text-primary">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 space-y-6 sticky top-24">
                  <h2 className="text-2xl font-bold">Resumo do Pedido</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full shadow-glow" 
                    size="lg"
                    onClick={checkout}
                    disabled={cartItems.length === 0}
                  >
                    Finalizar Pedido
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Pagamento seguro e criptografado
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
