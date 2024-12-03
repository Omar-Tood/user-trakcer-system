import { create } from 'zustand';
import { Payment } from '../types/payment';
import { generateId } from '../utils/id';
import { toast } from 'sonner';
import { LATE_FEE_PER_HOUR } from '../types/payment';

interface PaymentStore {
  payments: Payment[];
  createPayment: (userId: string, lateDuration: string, hours: number) => Payment;
  processPayment: (paymentId: string) => Promise<boolean>;
  getUserPayments: (userId: string) => Payment[];
  getPendingPayments: () => Payment[];
}

const STORAGE_KEY = 'usertrack_payments';

function getStoredPayments(): Payment[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const payments = JSON.parse(stored);
    return payments.map((payment: Payment) => ({
      ...payment,
      createdAt: new Date(payment.createdAt),
      paidAt: payment.paidAt ? new Date(payment.paidAt) : undefined,
    }));
  } catch {
    return [];
  }
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: getStoredPayments(),

  createPayment: (userId: string, lateDuration: string, hours: number) => {
    const amount = hours * LATE_FEE_PER_HOUR;
    const payment: Payment = {
      id: generateId(),
      userId,
      amount,
      status: 'pending',
      createdAt: new Date(),
      lateDuration,
      description: `Late return fee for ${lateDuration}`,
    };

    set(state => {
      const newPayments = [...state.payments, payment];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPayments));
      return { payments: newPayments };
    });

    toast.warning(
      `Late return fee: $${amount}`,
      {
        description: `A fee has been generated for returning ${lateDuration} late.`,
        duration: 5000,
      }
    );

    return payment;
  },

  processPayment: async (paymentId: string) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    set(state => {
      const newPayments = state.payments.map(payment =>
        payment.id === paymentId
          ? { ...payment, status: 'paid', paidAt: new Date() }
          : payment
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPayments));
      return { payments: newPayments };
    });

    toast.success('Payment processed successfully');
    return true;
  },

  getUserPayments: (userId: string) => {
    return get().payments.filter(payment => payment.userId === userId);
  },

  getPendingPayments: () => {
    return get().payments.filter(payment => payment.status === 'pending');
  },
}));