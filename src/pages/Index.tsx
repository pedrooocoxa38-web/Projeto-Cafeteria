import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coffee, Gamepad2, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsAPI, cartAPI, Product } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🔍 Tentando carregar produtos...');
        console.log('🌐 API URL:', import.meta.env.VITE_API_URL);
        const allProducts = await productsAPI.getAll();
        console.log('✅ Produtos carregados:', allProducts);
        // Show only first 4 products as featured
        setProducts(allProducts.slice(0, 4));
      } catch (error) {
        console.error('❌ Error loading products:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  const handleAddToCart = async (productId: number, productName: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho",
        variant: "destructive",
      });
      return;
    }

    try {
      await cartAPI.addItem(productId, 1);
      toast({
        title: "Adicionado ao carrinho!",
        description: `${productName} foi adicionado com sucesso.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar ao carrinho",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8">
          <HeroCarousel />
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Coffee, title: "Café Premium", desc: "Bebidas de alta qualidade" },
              { icon: Gamepad2, title: "Setup Gamer", desc: "PCs e consoles top de linha" },
              { icon: Users, title: "Eventos", desc: "Espaço para torneios" },
              { icon: Clock, title: "Aberto 24/7", desc: "Sempre disponível para você" }
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center space-y-3 hover-lift">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Produtos em Destaque</h2>
            <p className="text-muted-foreground">Os favoritos da galera gamer</p>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {loading ? (
              <div className="flex gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="min-w-[300px] h-[400px] bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.image || "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop"}
                  onAddToCart={() => handleAddToCart(product.id, product.name)}
                />
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              variant="secondary" 
              className="shadow-glow"
              onClick={() => navigate('/products')}
            >
              Ver Todos os Produtos
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10" />
            <div className="relative p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">
                Pronto para a Experiência?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Venha conhecer a melhor cafeteria geek da cidade. Café premium, jogos e diversão garantida!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="shadow-glow"
                  onClick={() => navigate('/products')}
                >
                  Fazer Pedido
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/reservations')}
                >
                  Reservar Espaço
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
