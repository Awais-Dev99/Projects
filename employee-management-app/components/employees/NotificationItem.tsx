// components/employee/NotificationItem.tsx
import { Info, Clock } from "lucide-react";

interface NotificationProps {
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationItem({ message, timestamp, isRead }: NotificationProps) {
  return (
    <div className={`relative p-5 rounded-2xl border transition-all ${
      isRead 
      ? 'bg-white border-slate-100 opacity-75' 
      : 'bg-white border-blue-100 shadow-md shadow-blue-50'
    }`}>
      {!isRead && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
          NEW
        </span>
      )}
      
      <div className="flex gap-4">
        <div className={`p-2 rounded-lg h-fit ${isRead ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
          <Info size={20} />
        </div>
        
        <div className="space-y-3 flex-1">
          <p className={`text-sm leading-relaxed ${isRead ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
            {message}
          </p>
          
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock size={12} />
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}