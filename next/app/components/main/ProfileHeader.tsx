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
    <header className="flex flex-col w-full bg-white px-4 py-3">
      <nav className="flex justify-between items-center w-full h-8">
        <div className="flex-none w-10">
          <Link href={backHref} className="flex items-center" aria-label="Go back">
            <Image src="/assets/back-arrow.svg" alt="Back" width={20} height={20} />
          </Link>
        </div>
  
        <div className="flex-1 flex flex-col items-center min-w-0 mx-2">
          <h1 className="text-base font-bold leading-6 text-black whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
            {title}
          </h1>
          {subtitle && (
             <span className="text-xs text-stone-500 mt-0.5">{subtitle}</span>
          )}
        </div>
  
        <div className="flex-none flex items-center justify-end gap-3 w-10">
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
  );
} 