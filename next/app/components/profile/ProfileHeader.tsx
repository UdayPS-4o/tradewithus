'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ProfileHeaderProps {
  title: string;
  backHref: string;
  subtitle?: string;
  showShare?: boolean;
  showWhatsapp?: boolean;
}

export default function ProfileHeader({
  title,
  backHref,
  subtitle,
  showShare = true,
  showWhatsapp = false
}: ProfileHeaderProps) {
  return (
    <>
      <header className="flex justify-center items-center px-5 py-3 bg-white w-full">
        <nav className="flex justify-between items-center w-full">
          <Link href={backHref} className="flex gap-4 items-center" aria-label="Go back">
            <Image src="/assets/back-arrow.svg" alt="Back" width={24} height={24} />
          </Link>
    
          <h1 className="text-base font-bold leading-6 text-center text-black absolute left-1/2 transform -translate-x-1/2">{title}</h1>
    
          <div className="flex items-center gap-3">
            {showShare && (
              <button aria-label="Share">
                <Image src="/assets/share-icon.svg" alt="Share" width={20} height={20} />
              </button>
            )}
            {showWhatsapp && (
              <Link href={`https://wa.me/918819923334`} aria-label="WhatsApp">
                <Image src="/assets/WhatsappLogo.svg" alt="WhatsApp" width={20} height={20} />
              </Link>
            )}
          </div>
        </nav>
      </header>
      
      {subtitle && (
        <div className="flex justify-center w-full text-xs text-gray-500 pb-2">
          <span className="text-center text-xs text-stone-500">{subtitle}</span>
        </div>
      )}
    </>
  );
} 