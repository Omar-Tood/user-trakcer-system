import React from 'react';
import { Payment } from '../../types/payment';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';

interface PaymentSummaryProps {
  payments: Payment[];
}

export function PaymentSummary({ payments }: PaymentSummaryProps) {
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const stats = [
    {
      label: 'Total Fees',
      value: totalAmount.toFixed(2),
      icon: DollarSign,
      color: 'bg-blue-500 dark:bg-blue-600',
    },
    {
      label: 'Pending',
      value: pendingAmount.toFixed(2),
      icon: Clock,
      color: 'bg-yellow-500 dark:bg-yellow-600',
    },
    {
      label: 'Paid',
      value: paidAmount.toFixed(2),
      icon: CheckCircle,
      color: 'bg-green-500 dark:bg-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                ${stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}