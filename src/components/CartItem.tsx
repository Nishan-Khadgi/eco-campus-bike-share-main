
import { Trash2, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type BikeModel } from '@/components/BikeCard';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: BikeModel;
}

const CartItem = ({ item }: CartItemProps) => {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-border rounded-lg shadow-subtle animate-fade-in-up">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 bg-ecampus-lightgray rounded-lg flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-lg" />
          ) : (
            <Bike className="h-10 w-10 text-ecampus-green" />
          )}
        </div>
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-muted-foreground">${item.price}/hour</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => removeFromCart(item.id)}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all-300"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CartItem;
