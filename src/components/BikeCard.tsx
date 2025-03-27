
import { useState } from 'react';
import { Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export interface BikeModel {
  id: number;
  name: string;
  range: number;
  price: number;
  image?: string;
}

interface BikeCardProps {
  bike: BikeModel;
}

const BikeCard = ({ bike }: BikeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(bike);
    toast.success(`Added ${bike.name} to cart!`);
  };

  return (
    <div 
      className={cn(
        "glass-card p-6 transition-all-500 overflow-hidden",
        isHovered ? "transform scale-[1.02] shadow-lg" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center">
        <div className="w-full aspect-square flex items-center justify-center mb-4 relative overflow-hidden rounded-xl bg-ecampus-lightgray">
          {bike.image ? (
            <img 
              src={bike.image} 
              alt={bike.name} 
              className={cn(
                "object-cover w-full h-full transition-all-500",
                isHovered ? "scale-110" : "scale-100"
              )}
            />
          ) : (
            <Bike className={cn(
              "h-24 w-24 text-ecampus-green transition-all duration-700 ease-in-out",
              isHovered ? "rotate-12 scale-110" : ""
            )} />
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{bike.name}</h3>
        
        <div className="w-full space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Range</span>
            <span className="font-medium">{bike.range} miles</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-medium">${bike.price}/hour</span>
          </div>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className={cn(
            "w-full bg-ecampus-green hover:bg-ecampus-green/90 text-white transition-all-300",
            isHovered ? "transform translate-y-0" : "transform translate-y-0"
          )}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default BikeCard;
