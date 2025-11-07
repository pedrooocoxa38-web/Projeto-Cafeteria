import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Pizza, Droplets, Beef, IceCream, Cookie, Salad, Wine, Gamepad2, Trophy, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { productsAPI, cartAPI, Product } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  name: string;
  displayName: string;
  icon: React.ReactNode;
  color: string;
}

const Products = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const allCategories: Category[] = [
    { name: "Cafes", displayName: "Cafés", icon: <Coffee className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-amber-900" },
    { name: "Pizzas", displayName: "Pizzas", icon: <Pizza className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-red-950" },
    { name: "Sucos", displayName: "Sucos", icon: <Droplets className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-emerald-950" },
    { name: "Hamburgueres", displayName: "Hambúrgueres", icon: <Beef className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-orange-950" },
    { name: "Sobremesas", displayName: "Sobremesas", icon: <IceCream className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-pink-950" },
    { name: "Snacks", displayName: "Snacks", icon: <Cookie className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-yellow-950" },
    { name: "Saladas", displayName: "Saladas", icon: <Salad className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-green-950" },
    { name: "Bebidas", displayName: "Bebidas", icon: <Wine className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-blue-950" },
    { name: "Bonecos e Colecionaveis", displayName: "Colecionáveis", icon: <Gamepad2 className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-purple-950" },
    { name: "Jogos de Tabuleiro e Cartas", displayName: "Jogos", icon: <Trophy className="h-6 w-6" />, color: "from-zinc-800 via-zinc-700 to-indigo-950" },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productsAPI.getAll();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({ title: "Erro", description: "Não foi possível carregar os produtos", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [toast]);

  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayIntervalRef.current = setInterval(() => {
        setAutoPlayIndex((prev) => {
          const categoriesWithProducts = allCategories.filter(cat => 
            products.filter(p => p.category === cat.name).length > 0
          );
          return (prev + 1) % categoriesWithProducts.length;
        });
      }, 4000);
    };

    if (!loading && products.length > 0 && !isUserInteracted && !selectedCategory) {
      startAutoPlay();
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [loading, products, isUserInteracted, selectedCategory]);

  useEffect(() => {
    if (carouselRef.current && !selectedCategory) {
      const activeElement = carouselRef.current.children[autoPlayIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [autoPlayIndex, selectedCategory]);

  const handleAddToCart = async (productId: number, productName: string) => {
    if (!isAuthenticated) {
      toast({ title: "Login necessário", description: "Faça login para adicionar produtos ao carrinho", variant: "destructive" });
      return;
    }

    try {
      await cartAPI.addItem(productId, 1);
      toast({ title: "Adicionado ao carrinho!", description: `${productName} foi adicionado com sucesso.` });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({ title: "Erro", description: "Não foi possível adicionar ao carrinho", variant: "destructive" });
    }
  };

  const getProductsByCategory = (categoryName: string) => {
    return products.filter(p => p.category === categoryName);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsUserInteracted(true);
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    setIsUserInteracted(true);
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const categoriesWithProducts = allCategories.filter(cat => 
    getProductsByCategory(cat.name).length > 0
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Produtos Exclusivos</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold"
            >
              Explore Nossas Categorias
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Selecione uma categoria para descobrir produtos incríveis
            </motion.p>
          </div>

          {loading ? (
            <div className="space-y-8">
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="min-w-[200px] h-[180px] bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Category Carousel */}
              <div className="relative mb-12">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg bg-background/80 backdrop-blur"
                  onClick={() => scrollCarousel('left')}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg bg-background/80 backdrop-blur"
                  onClick={() => scrollCarousel('right')}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <div 
                  ref={carouselRef}
                  className="flex gap-4 overflow-x-auto pb-4 px-12 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {categoriesWithProducts.map((category, index) => {
                    const productsCount = getProductsByCategory(category.name).length;
                    const isActive = selectedCategory === category.name;
                    const isAutoPlaying = index === autoPlayIndex && !selectedCategory;

                    return (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="snap-center"
                      >
                        <Card
                          className={`min-w-[220px] h-[180px] cursor-pointer transition-all duration-300 overflow-hidden group
                            ${isActive || isAutoPlaying ? 'ring-4 ring-primary shadow-2xl scale-105' : 'hover:shadow-xl hover:scale-102'}`}
                          onClick={() => handleCategoryClick(category.name)}
                        >
                          <div className={`h-full bg-gradient-to-br ${category.color} p-6 flex flex-col items-center justify-center text-white relative`}>
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                            
                            <motion.div 
                              className="relative z-10 mb-3"
                              animate={{ 
                                scale: isActive || isAutoPlaying ? [1, 1.2, 1] : 1,
                                rotate: isActive || isAutoPlaying ? [0, 360] : 0
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: isActive || isAutoPlaying ? Infinity : 0,
                                ease: "easeInOut"
                              }}
                            >
                              {category.icon}
                            </motion.div>
                            
                            <h3 className="relative z-10 text-xl font-bold text-center mb-2">
                              {category.displayName}
                            </h3>
                            
                            <Badge 
                              variant="secondary" 
                              className="relative z-10 bg-white/20 text-white border-white/30 hover:bg-white/30"
                            >
                              {productsCount} {productsCount === 1 ? 'produto' : 'produtos'}
                            </Badge>

                            {(isActive || isAutoPlaying) && (
                              <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Products Display */}
              <AnimatePresence mode="wait">
                {selectedCategory && (
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${allCategories.find(c => c.name === selectedCategory)?.color} flex items-center justify-center text-white`}>
                          {allCategories.find(c => c.name === selectedCategory)?.icon}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">
                            {allCategories.find(c => c.name === selectedCategory)?.displayName}
                          </h2>
                          <p className="text-muted-foreground">
                            {getProductsByCategory(selectedCategory).length} produtos disponíveis
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCategory(null)}
                      >
                        Ver Todas as Categorias
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {getProductsByCategory(selectedCategory).map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ProductCard
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            image={product.image || "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop"}
                            onAddToCart={() => handleAddToCart(product.id, product.name)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Initial State */}
              {!selectedCategory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 space-y-6"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-16 w-16 mx-auto text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">Selecione uma categoria acima</h3>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Clique em qualquer categoria para explorar nossos produtos incríveis!
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
