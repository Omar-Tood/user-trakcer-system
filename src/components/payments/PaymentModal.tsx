import React from 'react';
import { CreditCard, X } from 'lucide-react';
import { Payment } from '../../types/payment';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  onProcessPayment: (paymentId: string) => Promise<void>;
}

export function PaymentModal({ isOpen, onClose, payment, onProcessPayment }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await onProcessPayment(payment.id);
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Process Payment
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="dark:border-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Payment Details
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              ${payment.amount.toFixed(2)}
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {payment.description}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Created {formatDistanceToNow(payment.createdAt, { addSuffix: true })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Payment Method
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 dark:border-gray-600"
              >
                <img src="/visa.svg" alt="Visa" className="h-6" />
                Visa
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 dark:border-gray-600"
              >
                <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                Mastercard
              </Button>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}