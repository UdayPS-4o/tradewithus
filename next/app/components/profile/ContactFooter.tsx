'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ContactFooterProps {
  id: string;
  type: 'company' | 'product';
  onContact: () => void;
  onQuote?: () => void;
}

export default function ContactFooter({ 
  id, 
  type, 
  onContact, 
  onQuote 
}: ContactFooterProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    // Check localStorage for favorite status on component mount
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      // Handle the plural form correctly
      const key = type === 'company' ? 'companies' : 'products';
      setIsFavorite(favorites[key].includes(id));
    }
  }, [id, type]);

  const toggleFavorite = () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    
    // Update localStorage
    const savedFavorites = localStorage.getItem('favorites');
    let favorites: { companies: string[], products: string[] } = { companies: [], products: [] };
    
    if (savedFavorites) {
      favorites = JSON.parse(savedFavorites);
    }
    
    // Handle the plural form correctly
    const key = type === 'company' ? 'companies' : 'products';
    
    if (newStatus) {
      favorites[key] = Array.from(new Set([...favorites[key], id]));
    } else {
      favorites[key] = favorites[key].filter((itemId: string) => itemId !== id);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 py-4 bg-white w-full z-10 max-w-[600px] mx-auto" style={{ boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)' }}>
      <div className="flex justify-between items-center px-4">
        <button 
          className="flex gap-1 justify-center items-center px-3 py-2 w-9 h-9 bg-green-100 rounded-xl" 
          aria-label="Add to favorites"
          onClick={toggleFavorite}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill={isFavorite ? "#16A34A" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.99973 14.0361C-5.33333 6.66669 3.99999 -1.33331 7.99973 3.72539C12 -1.33331 21.3333 6.66669 7.99973 14.0361Z"
              stroke={isFavorite ? "#16A34A" : "#16A34A"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={onContact}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm"
          >
            Contact
          </button>
          
          {onQuote && (
            <button 
              onClick={onQuote}
              className="px-4 py-2 bg-green-600 text-white rounded-[10px] font-bold text-sm"
            >
              Request Quote
            </button>
          )}
        </div>
      </div>
    </footer>
  );
} 