"use client";

import React from 'react';
import { Package, Truck, Home, CheckCircle2, Circle } from 'lucide-react';
import { cn } from './../../lib/utils';

interface OrderTimelineProps {
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
}

export default function OrderTimeline({ status }: OrderTimelineProps) {
  const steps = [
    { id: 'Processing', label: 'Order Processed', icon: Package },
    { id: 'Shipped', label: 'In Transit', icon: Truck },
    { id: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: Home },
  ];

  // Logic to determine if a step is completed based on current status
  const currentStepIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="w-full py-8">
      <div className="relative flex justify-between">
        {/* Background Connector Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-700 -z-10" 
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Icon Circle */}
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4 bg-white",
                  isCompleted 
                    ? "border-blue-600 text-blue-600" 
                    : "border-gray-200 text-gray-300"
                )}
              >
                {isCompleted && index < currentStepIndex ? (
                  <CheckCircle2 size={20} className="fill-blue-600 text-white" />
                ) : (
                  <StepIcon size={20} className={isCurrent ? "animate-pulse" : ""} />
                )}
              </div>

              {/* Label */}
              <div className="mt-4 text-center">
                <p 
                  className={cn(
                    "text-[10px] sm:text-xs font-bold uppercase tracking-tighter",
                    isCompleted ? "text-blue-600" : "text-gray-400"
                  )}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    Current Status
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}