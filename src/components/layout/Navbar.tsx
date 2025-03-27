
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all-300 w-full",
        scrolled ? "py-2 glass-bg shadow-sm" : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center transition-all-300 hover:opacity-80"
        >
          <img 
            src="/lovable-uploads/d989f7a3-1b27-4ce2-a62a-96b178e373a4.png" 
            alt="Campus Bike" 
            className="h-16 w-auto" 
          />
        </Link>
        
        <h1 className={cn(
          "text-2xl font-medium transition-all-300 absolute left-1/2 transform -translate-x-1/2",
          scrolled ? "opacity-0" : "opacity-100"
        )}>
          Campus E-Bike Rental
        </h1>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/cart" 
            className="relative p-2 rounded-full bg-ecampus-green text-white hover:bg-ecampus-green/90 transition-all-300 hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
                {cartItems.length}
              </span>
            )}
          </Link>
          
          <Link 
            to="/login" 
            className="flex items-center space-x-1 px-4 py-2 rounded-full bg-ecampus-gray hover:bg-ecampus-gray/80 transition-all-300 hover:scale-105"
          >
            <span>Log in</span>
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;