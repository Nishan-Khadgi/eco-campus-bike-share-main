import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

interface CreateRentalData {
  bikeName: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalPrice: number;
  userId: string;
  rentalHours: number;
  paymentMethod: 'card' | 'dining';
  paymentId: string;
  paymentReference: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface FirestoreRental {
  id: string;
  bikeName: string;
  pickupLocation: string;
  dropoffLocation: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  status: 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  userId: string;
  rentalHours: number;
  paymentMethod: string;
  paymentId: string;
  paymentReference: string;
}

// Helper function to determine if a rental is expired
const isRentalExpired = (endTime: Date | undefined) => {
  if (!endTime) return false;
  return new Date() > endTime;
};

// RESTful API-like service methods
const rentalService = {
  // POST /rentals
  create: async (rentalData: CreateRentalData) => {
    try {
      const rentalsRef = collection(db, 'rentals');
      const newRental = {
        ...rentalData,
        startTime: Timestamp.now(),
        endTime: Timestamp.fromMillis(Date.now() + (rentalData.rentalHours * 60 * 60 * 1000)), // Convert hours to milliseconds
      };

      const docRef = await addDoc(rentalsRef, newRental);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating rental:', error);
      return { success: false, error };
    }
  },

  // GET /rentals?userId={userId}
  list: async (userId: string) => {
    try {
      const rentalsRef = collection(db, 'rentals');
      const q = query(
        rentalsRef,
        where('userId', '==', userId),
        orderBy('startTime', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const now = new Date();
      const rentals = await Promise.all(querySnapshot.docs.map(async doc => {
        const data = doc.data() as FirestoreRental;
        const endTime = data.endTime?.toDate();
        
        // If rental has ended but still marked as active, update it to completed
        if (data.status === 'active' && isRentalExpired(endTime)) {
          await updateDoc(doc.ref, { status: 'completed' });
          data.status = 'completed';
        }
        
        return {
          id: doc.id,
          ...data,
          startTime: data.startTime.toDate(),
          endTime: data.endTime?.toDate()
        };
      }));

      return { success: true, rentals };
    } catch (error) {
      console.error('Error fetching rentals:', error);
      return { success: false, error };
    }
  },

  // PUT /rentals/{id}
  update: async (rentalId: string, updateData: Partial<CreateRentalData>) => {
    try {
      const rentalRef = doc(db, 'rentals', rentalId);
      await updateDoc(rentalRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating rental:', error);
      return { success: false, error };
    }
  },

  // DELETE /rentals/{id}
  delete: async (rentalId: string) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      const rentalRef = doc(db, 'rentals', rentalId);
      const rentalDoc = await getDoc(rentalRef);
      
      if (!rentalDoc.exists()) {
        throw new Error('Rental not found');
      }

      await deleteDoc(rentalRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting rental:', error);
      if (error instanceof Error) {
        return { 
          success: false, 
          error: {
            message: error.message,
            code: error.name === 'FirebaseError' ? (error as any).code : 'unknown'
          }
        };
      }
      return { success: false, error: { message: 'An unknown error occurred', code: 'unknown' } };
    }
  }
};

export const { create: createRental, list: getUserRentals, update: updateRental, delete: deleteRental } = rentalService; 