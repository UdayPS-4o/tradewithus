'use client';

import Image from 'next/image';

interface InfoCard {
  icon: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

interface QuickInfoCardsProps {
  cards: InfoCard[];
  className?: string;
}

export default function QuickInfoCards({
  cards,
  className = ""
}: QuickInfoCardsProps) {
  return (
    <div className={`grid grid-cols-${Math.min(cards.length, 4)} w-full border-b ${className}`}>
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`flex flex-col items-center justify-center py-3 px-2 ${card.onClick ? 'cursor-pointer' : ''}`}
          onClick={card.onClick}
        >
          <div className={`rounded-full ${card.iconBg} w-12 h-12 flex items-center justify-center mb-1`}>
            <Image src={card.icon} alt={card.title} width={20} height={20} />
          </div>
          <p className="text-center text-xs">
            {card.title}
            {card.subtitle && <><br />{card.subtitle}</>}
          </p>
        </div>
      ))}
    </div>
  );
} 