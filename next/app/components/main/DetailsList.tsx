'use client';

import React, { Fragment } from 'react';
import Image from 'next/image';

interface DetailsListProps {
  items: Record<string, any>;
  title?: string;
  downloadable?: boolean;
  downloadText?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  columnStyle?: 'wide' | 'narrow';
}

export default function DetailsList({
  items,
  title,
  downloadable = false,
  downloadText = "Download",
  actionText,
  onAction,
  className = "",
  columnStyle = 'wide'
}: DetailsListProps) {
  // Format the label, converting camelCase to spaced words with capitals
  const formatLabel = (key: string) => {
    if (key === 'hsCode') return 'HS Code';
    return key.replace(/([A-Z])/g, ' $1').trim();
  };
  
  // Get the column template based on style
  const getColumnTemplate = () => {
    return columnStyle === 'wide' 
      ? { gridTemplateColumns: '180px 1fr', rowGap: '1rem' }
      : { gridTemplateColumns: 'auto 1fr', rowGap: '0.75rem', columnGap: '1rem' }
  };

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-black">{title}</h2>
          
          {downloadable && (
            <button className="text-green-600 flex items-center gap-1 text-sm font-semibold">
              <span>{downloadText}</span>
              <Image src="/assets/FilePdf.svg" alt="Download PDF" width={16} height={16} />
            </button>
          )}
        </div>
      )}
      
      <dl className="w-full grid" style={getColumnTemplate()}>
        {Object.entries(items).map(([key, value]) => (
          <Fragment key={key}>
            <dt className="text-sm leading-5 text-stone-500">
              {formatLabel(key)}
            </dt>
            <dd className="text-base leading-5 text-neutral-950">{value}</dd>
          </Fragment>
        ))}
      </dl>
      
      {actionText && (
        <button 
          onClick={onAction}
          className="mt-2 text-sm text-green-600 font-semibold flex items-center gap-1"
        >
          <span>{actionText}</span>
          <Image src="/assets/arrow-right.svg" alt="Arrow" width={14} height={14} />
        </button>
      )}
    </div>
  );
} 