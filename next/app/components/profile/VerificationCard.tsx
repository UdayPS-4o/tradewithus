'use client';

import Image from 'next/image';
import { InfoCard } from './index';

interface VerificationCardProps {
  verifications: Record<string, boolean>;
  className?: string;
}

export default function VerificationCard({
  verifications,
  className = ""
}: VerificationCardProps) {
  return (
    <InfoCard
      title="Verified by GTX"
      verifications={verifications}
      showStamp={true}
      actionText="View Registration Details"
      className={className}
      bgColor="bg-green-100"
    />
  );
} 