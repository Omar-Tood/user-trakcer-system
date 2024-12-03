import React, { useState } from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { Payment } from '../../types/payment';
import { PaymentModal } from './PaymentModal';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

interface PaymentListProps {
  payments: Payment[];
  onProcessPayment: (paymentId: string) => Promise<void>;
}

export function PaymentList({ payments, onProcessPayment }: PaymentListProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No payments to display
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  p-2 rounded-full
                  ${payment.status === 'paid'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                    : payment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                  }
                `}>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    ${payment.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {payment.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(payment.createdAt, { addSuffix: true })}
                  </div>
                  <div className={`
                    text-sm font-medium mt-1 px-2 py-0.5 rounded-full inline-block
                    ${payment.status === 'paid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }
                  `}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </div>
                </div>
                {payment.status === 'pending' && (
                  <Button
                    onClick={() => setSelectedPayment(payment)}
                    size="sm"
                    className="ml-4"
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPayment && (
        <PaymentModal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          payment={selectedPayment}
          onProcessPayment={onProcessPayment}
        />
      )}
    </>
  );
}