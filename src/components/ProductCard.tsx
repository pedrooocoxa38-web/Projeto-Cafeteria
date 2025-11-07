import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  image: string;
  name: string;
  description: string;
  price: number;
  onAddToCart?: () => void;
}

const ProductCard = ({ image, name, description, price, onAddToCart }: ProductCardProps) => {
  return (
    <div className="card-netflix group cursor-pointer min-w-[280px] md:min-w-[320px]">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 gradient-card opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-primary">
            R$ {price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            onClick={onAddToCart}
            className="gap-2 shadow-glow"
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
