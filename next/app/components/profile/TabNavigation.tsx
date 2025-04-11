'use client';

import { useState } from 'react';

interface TabNavigationProps {
  tabs: string[];
  activeTab: string | number;
  onTabChange: (tab: string | number) => void;
  className?: string;
}

export default function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = ""
}: TabNavigationProps) {
  return (
    <nav className={`w-full border-b ${className}`}>
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex w-max">
          {tabs.map((tab, index) => {
            const tabId = typeof activeTab === 'number' ? index : tab.toLowerCase();
            const isActive = activeTab === tabId;
            
            return (
              <button
                key={index}
                className={`relative flex whitespace-nowrap ${
                  isActive ? 'font-bold' : ''
                }`}
                onClick={() => onTabChange(tabId)}
              >
                <div className="flex justify-center items-center px-4 py-2">
                  {isActive && (
                    <div className="absolute bottom-0 h-1 bg-green-600 rounded-full w-[80%]"></div>
                  )}
                  <span className={`text-sm ${
                    isActive ? 'font-bold text-zinc-900' : 'text-zinc-900'
                  }`}>
                    {tab}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <style jsx global>{`
        /* Hide scrollbar but keep functionality */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari, Opera */
        }
      `}</style>
    </nav>
  );
} 