import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Calendar, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { getUserRentals, updateRental, deleteRental } from '@/lib/services/rentalService';
import AddRentalForm from '@/components/rental/AddRentalForm';
import { toast } from 'sonner';

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
  const [editingRental, setEditingRental] = useState<Rental | null>(null);
  const [deletingRental, setDeletingRental] = useState<Rental | null>(null);
  const [editFormData, setEditFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    rentalHours: ''
  });

  const isRentalActive = (rental: Rental) => {
    return rental.status === 'active' && (!rental.endTime || new Date() <= rental.endTime);
  };

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
          startTime: rental.startTime,
          endTime: rental.endTime,
          status: rental.status,
          totalPrice: rental.totalPrice,
          rentalHours: rental.rentalHours || 0
        } satisfies Rental));

        // Filter rentals based on both status and end time
        setActiveRentals(rentals.filter(isRentalActive));
        setPastRentals(rentals.filter(rental => !isRentalActive(rental)));
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
      toast.error('Failed to fetch rentals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [currentUser]);

  const handleUpdateRental = async (rentalId: string) => {
    if (!editingRental) return;

    try {
      const result = await updateRental(rentalId, {
        pickupLocation: editFormData.pickupLocation,
        dropoffLocation: editFormData.dropoffLocation,
        rentalHours: Number(editFormData.rentalHours)
      });

      if (result.success) {
        toast.success('Rental updated successfully');
        setEditingRental(null);
        fetchRentals();
      } else {
        throw new Error('Failed to update rental');
      }
    } catch (error) {
      toast.error('Failed to update rental');
    }
  };

  const handleDeleteRental = async (rentalId: string) => {
    if (!rentalId || !currentUser) {
      toast.error('You must be logged in to delete a rental');
      return;
    }

    try {
      const result = await deleteRental(rentalId);
      
      if (result.success) {
        toast.success('Rental deleted successfully');
        setDeletingRental(null);
        fetchRentals();
      } else {
        const errorMessage = result.error?.message || 'Failed to delete rental';
        const errorCode = result.error?.code || 'unknown';
        
        if (errorCode === 'permission-denied' || errorMessage.includes('permission')) {
          toast.error('You do not have permission to delete this rental');
        } else if (errorCode === 'not-found' || errorMessage.includes('not found')) {
          toast.error('Rental not found');
          setDeletingRental(null);
          fetchRentals();
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred while deleting the rental');
    }
  };

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
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm ${
            isRentalActive(rental)
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isRentalActive(rental) ? 'Active' : 'Completed'}
          </span>
          {isRentalActive(rental) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setEditingRental(rental);
                    setEditFormData({
                      pickupLocation: rental.pickupLocation,
                      dropoffLocation: rental.dropoffLocation,
                      rentalHours: rental.rentalHours.toString()
                    });
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setDeletingRental(rental)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
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

          {/* Edit Rental Dialog */}
          <Dialog open={!!editingRental} onOpenChange={(open) => !open && setEditingRental(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Rental</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Input
                    id="pickupLocation"
                    value={editFormData.pickupLocation}
                    onChange={(e) => setEditFormData(prev => ({
                      ...prev,
                      pickupLocation: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dropoffLocation">Dropoff Location</Label>
                  <Input
                    id="dropoffLocation"
                    value={editFormData.dropoffLocation}
                    onChange={(e) => setEditFormData(prev => ({
                      ...prev,
                      dropoffLocation: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="rentalHours">Rental Hours</Label>
                  <Input
                    id="rentalHours"
                    type="number"
                    min="1"
                    value={editFormData.rentalHours}
                    onChange={(e) => setEditFormData(prev => ({
                      ...prev,
                      rentalHours: e.target.value
                    }))}
                  />
                </div>
                <Button
                  className="w-full bg-ecampus-green hover:bg-ecampus-green/90"
                  onClick={() => editingRental && handleUpdateRental(editingRental.id)}
                >
                  Update Rental
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!deletingRental} onOpenChange={(open) => !open && setDeletingRental(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Rental</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this rental? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeletingRental(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deletingRental && handleDeleteRental(deletingRental.id)}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default RentalHistory; 