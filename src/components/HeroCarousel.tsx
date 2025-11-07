import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
  cta: string;
  link: string;
}

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides: CarouselItem[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop",
      title: "Café Premium & Snacks Gourmet",
      description: "Experimente nossos cafés especiais e snacks artesanais enquanto joga seus games favoritos",
      cta: "Ver Cardápio",
      link: "/products"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=1080&fit=crop",
      title: "Espaços para Eventos & Torneios",
      description: "Reserve nosso espaço completo com PCs gamers, consoles e tudo que você precisa",
      cta: "Fazer Reserva",
      link: "/reservations"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1590649880765-91b1956b8276?w=1920&h=1080&fit=crop",
      title: "Produtos Geek & Colecionáveis",
      description: "Action figures, boardgames, trading cards e muito mais para você colecionar",
      cta: "Ver Produtos",
      link: "/products"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-lg">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  {slide.description}
                </p>
                <Button 
                  size="lg" 
                  className="gap-2 shadow-glow animate-glow"
                  onClick={() => navigate(slide.link)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm p-2 rounded-full transition-smooth"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm p-2 rounded-full transition-smooth"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentSlide 
                ? "w-8 bg-primary" 
                : "w-4 bg-muted-foreground/50 hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
