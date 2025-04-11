'use client';

import Image from 'next/image';
import Link from 'next/link';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  items?: { label: string; value: any }[];
  verifications?: Record<string, boolean>;
  showStamp?: boolean;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  bgColor?: string;
}

export default function InfoCard({
  title,
  subtitle,
  items,
  verifications,
  showStamp = false,
  actionText,
  actionHref,
  onAction,
  className = "",
  bgColor = "bg-green-100"
}: InfoCardProps) {
  return (
    <div className={`flex flex-col gap-4 p-4 w-full ${bgColor} rounded-xl relative ${className}`}>
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-2 items-start">
          <div className="flex gap-1 items-center">
            <h3 className="text-sm font-bold text-black uppercase">
              {title}
            </h3>
            {title.toLowerCase().includes('verified') && (
              <Image src="/assets/verified-checkmark.svg" alt="Verified" width={16} height={16} />
            )}
            <button aria-label="More information" className="ml-1">
              <Image src="/assets/info-icon.svg" alt="Info" width={14} height={14} />
            </button>
          </div>
          
          {subtitle && (
            <p className="text-xs text-gray-700">{subtitle}</p>
          )}
          
          {verifications && (
            <ul className="flex flex-col gap-2 justify-center items-start">
              {Object.entries(verifications).map(([key, value]) => (
                value && (
                  <li key={key} className="flex gap-1 items-center">
                    <Image src="/assets/checkmark-circle.svg" alt="Checked" width={14} height={14} className="opacity-50" />
                    <span className="text-xs text-black">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </li>
                )
              ))}
            </ul>
          )}
          
          {items && (
            <dl className="w-full grid" style={{ gridTemplateColumns: 'auto 1fr', rowGap: '0.75rem', columnGap: '1rem' }}>
              {items.map(({label, value}, index) => (
                <div key={index} className="contents">
                  <dt className="text-xs text-gray-600">{label}:</dt>
                  <dd className="text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        
        {/* Green stamp */}
        {showStamp && (
          <div className="absolute bottom-0 right-0">
            <Image src="/assets/green-stamp.svg" alt="Trusted & Reliable Seller" width={90} height={90} className="rotate-[-15deg]" />
          </div>
        )}
      </div>
      
      {actionText && (
        actionHref ? (
          <Link href={actionHref} className="flex gap-1 items-center text-green-600">
            <span className="text-sm font-semibold">{actionText}</span>
            <Image src="/assets/arrow-right.svg" alt="Arrow right" width={14} height={14} />
          </Link>
        ) : (
          <button 
            onClick={onAction} 
            className="flex gap-1 items-center text-green-600"
          >
            <span className="text-sm font-semibold">{actionText}</span>
            <Image src="/assets/arrow-right.svg" alt="Arrow right" width={14} height={14} />
          </button>
        )
      )}
    </div>
  );
} 