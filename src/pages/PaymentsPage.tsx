import React from 'react';
import { usePaymentStore } from '../store/usePaymentStore';
import { useAuthStore } from '../store/useAuthStore';
import { PaymentList } from '../components/payments/PaymentList';
import { PaymentSummary } from '../components/payments/PaymentSummary';

export function PaymentsPage() {
  const { user } = useAuthStore();
  const { getUserPayments, processPayment } = usePaymentStore();
  
  if (!user) return null;
  
  const payments = getUserPayments(user.id);

  const handleProcessPayment = async (paymentId: string) => {
    await processPayment(paymentId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Late Return Payments
      </h1>

      <PaymentSummary payments={payments} />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment History
        </h2>
        <PaymentList
          payments={payments}
          onProcessPayment={handleProcessPayment}
        />
      </div>
    </div>
  );
}