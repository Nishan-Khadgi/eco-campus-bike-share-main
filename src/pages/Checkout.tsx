import { useState } from 'react';
import { ArrowLeft, CreditCard, School, Loader2, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LocationSelector from '@/components/LocationSelector';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createRental } from '@/lib/services/rentalService';
import { createPaymentIntent, confirmPayment } from '@/lib/services/paymentService';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

const TAX_RATE = 0.08;

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [paymentTab, setPaymentTab] = useState('card');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [diningPin, setDiningPin] = useState('');
  const [rentalHours, setRentalHours] = useState('1');
  
  const finalTotal = totalPrice * (1 + TAX_RATE);
  const totalWithDuration = finalTotal * Number(rentalHours);

  const handleCheckout = async () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.error('Please select pickup and dropoff locations');
      return;
    }

    if (!rentalHours || Number(rentalHours) < 1) {
      toast.error('Please enter a valid rental duration');
      return;
    }

    if (paymentTab === 'card' && (!cardNumber || !expiryDate || !cvc || !cardName)) {
      toast.error('Please fill in all card details');
      return;
    }

    if (paymentTab === 'dining' && (!studentId || !diningPin)) {
      toast.error('Please fill in all dining details');
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to complete the rental');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Current user:', currentUser);
      
      // Create payment record
      const paymentData = {
        amount: Math.round(totalWithDuration * 100), // Convert to cents
        currency: 'usd',
        paymentMethod: paymentTab as 'card' | 'dining',
        metadata: {
          userId: currentUser.uid,
          bikeIds: cartItems.map(item => item.id.toString()),
          pickupLocation,
          dropoffLocation,
          rentalHours: Number(rentalHours)
        }
      };

      console.log('Creating payment with data:', paymentData);
      const paymentIntent = await createPaymentIntent(paymentData);
      console.log('Payment intent created:', paymentIntent);
      
      // Create rentals for each bike
      for (const item of cartItems) {
        const rentalData = {
          bikeName: item.name,
          pickupLocation,
          dropoffLocation,
          totalPrice: Number((item.price * (1 + TAX_RATE) * Number(rentalHours)).toFixed(2)),
          userId: currentUser.uid,
          rentalHours: Number(rentalHours),
          paymentMethod: paymentTab as 'card' | 'dining',
          paymentId: paymentIntent.id,
          paymentReference: paymentTab === 'card' ? 
            `**** **** **** ${cardNumber.slice(-4)}` : 
            `Student ID: ${studentId}`,
          status: 'active' as const
        };

        console.log('Creating rental with data:', rentalData);
        const result = await createRental(rentalData);
        console.log('Rental creation result:', result);
        
        if (!result.success) {
          throw new Error(`Failed to create rental for bike: ${item.name}`);
        }
      }

      toast.success('Bike rental confirmed!');
      clearCart();
      navigate('/rentals');
    } catch (error) {
      console.error('Error in checkout process:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete rental. Please try again.');
    } finally {
      setLoading(false);
    }
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
                <h2 className="text-lg font-medium mb-4">Rental Duration</h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor="duration" className="block text-sm font-medium mb-1">
                      Number of Hours
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        step="1"
                        value={rentalHours}
                        onChange={(e) => setRentalHours(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
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
                      <Input 
                        id="cardNumber" 
                        placeholder="1234 5678 9012 3456" 
                        className="w-full"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={16}
                        pattern="[0-9]*"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expDate" className="block text-sm font-medium mb-1">Expiration Date</label>
                        <Input 
                          id="expDate" 
                          placeholder="MM/YY" 
                          className="w-full"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium mb-1">CVC</label>
                        <Input 
                          id="cvc" 
                          placeholder="123" 
                          className="w-full"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          maxLength={4}
                          pattern="[0-9]*"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium mb-1">Name on Card</label>
                      <Input 
                        id="cardName" 
                        placeholder="John Doe" 
                        className="w-full"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dining" className="space-y-4">
                    <div>
                      <label htmlFor="studentId" className="block text-sm font-medium mb-1">Student ID</label>
                      <Input 
                        id="studentId" 
                        placeholder="Enter your student ID" 
                        className="w-full"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="pin" className="block text-sm font-medium mb-1">Dining PIN</label>
                      <Input 
                        id="pin" 
                        type="password" 
                        placeholder="Enter your dining PIN" 
                        className="w-full"
                        value={diningPin}
                        onChange={(e) => setDiningPin(e.target.value)}
                      />
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
                    <span className="text-muted-foreground">Duration</span>
                    <span>{rentalHours} hour{Number(rentalHours) !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(totalPrice * Number(rentalHours)).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(totalPrice * TAX_RATE * Number(rentalHours)).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between font-medium pt-2 border-t border-border">
                    <span>Total</span>
                    <span>${totalWithDuration.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-ecampus-green hover:bg-ecampus-green/90 text-white"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Rental'
                  )}
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
