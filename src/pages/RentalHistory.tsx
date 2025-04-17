import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { getUserRentals } from '@/lib/services/rentalService';
import AddRentalForm from '@/components/rental/AddRentalForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Rental {
  id: string;
  bikeName: string;
  pickupLocation: string;
  dropoffLocation: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  rentalHours: number;
}

const RentalHistory = () => {
  const { currentUser } = useAuth();
  const [activeRentals, setActiveRentals] = useState<Rental[]>([]);
  const [pastRentals, setPastRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    if (!currentUser) return;

    try {
      const result = await getUserRentals(currentUser.uid);
      if (result.success && result.rentals) {
        const rentals = result.rentals.map(rental => ({
          id: rental.id,
          bikeName: rental.bikeName,
          pickupLocation: rental.pickupLocation,
          dropoffLocation: rental.dropoffLocation,
          startTime: rental.startTime.toDate(),
          endTime: rental.endTime?.toDate(),
          status: rental.status,
          totalPrice: rental.totalPrice,
          rentalHours: rental.rentalHours || 0
        } satisfies Rental));

        setActiveRentals(rentals.filter(rental => rental.status === 'active'));
        setPastRentals(rentals.filter(rental => rental.status === 'completed'));
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [currentUser]);

  const RentalCard = ({ rental }: { rental: Rental }) => (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{rental.bikeName}</h3>
          <p className="text-sm text-muted-foreground">
            {rental.startTime.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          rental.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {rental.status === 'active' ? 'Active' : 'Completed'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>From: {rental.pickupLocation}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>To: {rental.dropoffLocation}</span>
        </div>
        {rental.endTime && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Ended: {rental.endTime.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Duration: {rental.rentalHours} hour{rental.rentalHours !== 1 ? 's' : ''}</span>
        </div>
        <span className="font-semibold">${rental.totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ecampus-lightgray">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-all-300 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Link>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-ecampus-green hover:bg-ecampus-green/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rental
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Rental</DialogTitle>
                </DialogHeader>
                <AddRentalForm />
              </DialogContent>
            </Dialog>
          </div>

          <h1 className="text-3xl font-bold mb-8">My Rentals</h1>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="active" className="data-[state=active]:bg-ecampus-green data-[state=active]:text-white">
                Current Rentals
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-ecampus-green data-[state=active]:text-white">
                Past Rentals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ecampus-green"></div>
                </div>
              ) : activeRentals.length > 0 ? (
                activeRentals.map(rental => (
                  <RentalCard key={rental.id} rental={rental} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No active rentals
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ecampus-green"></div>
                </div>
              ) : pastRentals.length > 0 ? (
                pastRentals.map(rental => (
                  <RentalCard key={rental.id} rental={rental} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No past rentals
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RentalHistory; 