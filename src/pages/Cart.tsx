
import { useState } from 'react';
import { ArrowLeft, ShoppingCart, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import Navbar from '@/components/layout/Navbar';

const Cart = () => {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(true);
  
  return (
    <div className="min-h-screen bg-ecampus-lightgray pb-24">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32">
        <div 
          className={`transition-all duration-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex items-center mb-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-all-300 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to bikes
            </Link>
            <h1 className="text-3xl font-bold mx-auto pr-12">Your Cart</h1>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {cartItems.length > 0 ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
                
                <div className="bg-white border border-border rounded-lg p-6 shadow-subtle">
                  <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${(totalPrice * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${(totalPrice * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-ecampus-green hover:bg-ecampus-green/90 text-white"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-ecampus-gray/50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add some bikes to get started</p>
                <Button 
                  className="bg-ecampus-green hover:bg-ecampus-green/90 text-white"
                  onClick={() => navigate('/')}
                >
                  Browse E-Bikes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
