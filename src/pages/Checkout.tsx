
import { useState } from 'react';
import { ArrowLeft, CreditCard, School } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LocationSelector from '@/components/LocationSelector';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [paymentTab, setPaymentTab] = useState('card');
  
  const handleCheckout = () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.error('Please select pickup and dropoff locations');
      return;
    }
    
    // In a real app, we would process the payment and create a reservation
    toast.success('Bike rental confirmed!');
    clearCart();
    navigate('/');
  };
  
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-ecampus-lightgray pb-24">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32">
        <div className="flex items-center mb-8">
          <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-all-300 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to cart
          </Link>
          <h1 className="text-3xl font-bold mx-auto pr-12">Checkout</h1>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-lg p-6 shadow-subtle">
                <h2 className="text-lg font-medium mb-4">Pickup & Dropoff</h2>
                
                <div className="space-y-4">
                  <LocationSelector
                    type="pickup"
                    value={pickupLocation}
                    onChange={setPickupLocation}
                  />
                  <LocationSelector
                    type="dropoff"
                    value={dropoffLocation}
                    onChange={setDropoffLocation}
                  />
                </div>
              </div>
              
              <div className="bg-white border border-border rounded-lg p-6 shadow-subtle">
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                
                <Tabs defaultValue="card" value={paymentTab} onValueChange={setPaymentTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="card" className="data-[state=active]:bg-ecampus-green data-[state=active]:text-white">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="dining" className="data-[state=active]:bg-ecampus-green data-[state=active]:text-white">
                      <School className="h-4 w-4 mr-2" />
                      Dining Dollars
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card" className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="w-full" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expDate" className="block text-sm font-medium mb-1">Expiration Date</label>
                        <Input id="expDate" placeholder="MM/YY" className="w-full" />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium mb-1">CVC</label>
                        <Input id="cvc" placeholder="123" className="w-full" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium mb-1">Name on Card</label>
                      <Input id="cardName" placeholder="John Doe" className="w-full" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dining" className="space-y-4">
                    <div>
                      <label htmlFor="studentId" className="block text-sm font-medium mb-1">Student ID</label>
                      <Input id="studentId" placeholder="Enter your student ID" className="w-full" />
                    </div>
                    
                    <div>
                      <label htmlFor="pin" className="block text-sm font-medium mb-1">Dining PIN</label>
                      <Input id="pin" type="password" placeholder="Enter your dining PIN" className="w-full" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground">Your dining dollars balance will be charged for this rental.</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div>
              <div className="bg-white border border-border rounded-lg p-6 shadow-subtle sticky top-32">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price}/hour</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between font-medium pt-2 border-t border-border">
                    <span>Total</span>
                    <span>${(totalPrice * 1.08).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-ecampus-green hover:bg-ecampus-green/90 text-white"
                  onClick={handleCheckout}
                >
                  Complete Rental
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By completing this rental, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
