
import React from 'react';
import { AlertCircle, Check, Clock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'default';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
  let Icon = Clock;

  if (type) {
     if (type === 'warning') { colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200'; Icon = AlertCircle; }
     else if (type === 'success') { colorClass = 'bg-green-100 text-green-700 border-green-200'; Icon = CheckCircle2; }
  } else {
     if (status === 'Pending') { colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200'; Icon = Clock; }
     else if (status === 'Complete') { colorClass = 'bg-green-100 text-green-700 border-green-200'; Icon = Check; }
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};