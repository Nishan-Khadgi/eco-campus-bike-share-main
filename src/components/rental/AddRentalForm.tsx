import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createRental } from '@/lib/services/rentalService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AddRentalForm = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bikeName: '',
    pickupLocation: '',
    dropoffLocation: '',
    totalPrice: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a rental',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await createRental({
        ...formData,
        totalPrice: parseFloat(formData.totalPrice),
        userId: currentUser.uid
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Rental created successfully'
        });
        // Reset form
        setFormData({
          bikeName: '',
          pickupLocation: '',
          dropoffLocation: '',
          totalPrice: ''
        });
      } else {
        throw new Error('Failed to create rental');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create rental',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="bikeName">Bike Name</Label>
        <Input
          id="bikeName"
          name="bikeName"
          value={formData.bikeName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="pickupLocation">Pickup Location</Label>
        <Input
          id="pickupLocation"
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="dropoffLocation">Dropoff Location</Label>
        <Input
          id="dropoffLocation"
          name="dropoffLocation"
          value={formData.dropoffLocation}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="totalPrice">Total Price ($)</Label>
        <Input
          id="totalPrice"
          name="totalPrice"
          type="number"
          min="0"
          step="0.01"
          value={formData.totalPrice}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Rental'}
      </Button>
    </form>
  );
};

export default AddRentalForm; 