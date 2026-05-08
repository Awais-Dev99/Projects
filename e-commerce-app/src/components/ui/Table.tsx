import React from 'react';
import { cn } from './../../lib/utils';

export const Table = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
    <table className={cn("w-full text-sm text-left", className)}>
      {children}
    </table>
  </div>
);

export const THead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b">
    {children}
  </thead>
);

export const TBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-gray-50 bg-white">
    {children}
  </tbody>
);

export const TR = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <tr className={cn("hover:bg-blue-50/30 transition-colors", className)}>
    {children}
  </tr>
);

export const TH = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={cn("px-6 py-4 font-bold", className)}>
    {children}
  </th>
);

export const TD = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn("px-6 py-4 whitespace-nowrap text-gray-600", className)}>
    {children}
  </td>
);