import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

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

export const createRental = async (rentalData: CreateRentalData) => {
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
};

export const getUserRentals = async (userId: string) => {
  try {
    const rentalsRef = collection(db, 'rentals');
    const q = query(
      rentalsRef,
      where('userId', '==', userId),
      orderBy('startTime', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const rentals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreRental[];

    return { success: true, rentals };
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return { success: false, error };
  }
}; 