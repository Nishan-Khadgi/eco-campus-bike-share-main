import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

// For development, we'll simulate payments
const DEV_MODE = true;

interface PaymentIntent {
  clientSecret: string;
  id: string;
}

export interface CreatePaymentData {
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'dining';
  metadata: {
    userId: string;
    bikeIds: string[];
    pickupLocation: string;
    dropoffLocation: string;
    rentalHours: number;
  };
}

export const createPaymentIntent = async (data: CreatePaymentData): Promise<PaymentIntent> => {
  try {
    // Generate a mock payment ID
    const mockPaymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the payment record in Firebase
    const paymentsRef = collection(db, 'payments');
    await addDoc(paymentsRef, {
      id: mockPaymentId,
      amount: data.amount,
      currency: data.currency,
      metadata: data.metadata,
      status: 'succeeded',
      created: new Date(),
      paymentMethod: data.paymentMethod
    });

    return {
      id: mockPaymentId,
      clientSecret: mockPaymentId
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const confirmPayment = async (paymentId: string): Promise<boolean> => {
  // In this simplified version, all payments are automatically confirmed
  return true;
}; 