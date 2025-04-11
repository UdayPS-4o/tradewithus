'use client';

import Image from 'next/image';

interface CertificationCardProps {
  certification: {
    name: string;
    icon: string;
    validFrom: string;
    validTo: string;
  }
}

// Using the same interface as expected by CertificationCard
interface Certification {
  name: string;
  icon: string;
  validFrom: string;
  validTo: string;
}

interface CertificationsSectionProps {
  certifications?: Certification[];
  title?: string;
  subtitle?: string;
  className?: string;
}

function CertificationCard({ certification }: CertificationCardProps) {
  const { name, icon, validFrom, validTo } = certification;
  
  return (
    <article className="flex gap-1 items-start px-2 py-4 bg-green-100 rounded-xl">
      <Image src={icon} alt={name} width={24} height={24} className="flex-shrink-0" />
      <div className="flex flex-col flex-1 gap-1 items-start">
        <h3 className="text-sm leading-5 text-neutral-950">{name}</h3>
        <time className="text-xs text-stone-500">{validFrom} - {validTo}</time>
      </div>
    </article>
  );
}


export default function CertificationsSection({
  certifications = [],
  title = "Certifications",
  subtitle = "Click on the certification to view details",
  className = ""
}: CertificationsSectionProps) {
  return (
    <section className={`flex flex-col gap-4 items-start w-full ${className}`}>
      <div className="flex flex-col gap-1 items-start w-full">
        <div className="flex gap-1.5 items-center w-full">
          <h2 className="text-2xl font-bold text-black">{title}</h2>
          <button aria-label="More information about certifications">
            <Image src="/assets/info-icon.svg" alt="Info" width={20} height={20} />
          </button>
        </div>
        {subtitle && (
          <p className="text-sm text-black opacity-50">
            {subtitle}
          </p>
        )}
      </div>
  
      <div className="cert-container w-full">
        {certifications && certifications.length > 0 ? (
          certifications.map((cert, index) => (
            <CertificationCard key={index} certification={cert} />
          ))
        ) : (
          <p className="text-sm text-gray-500 py-2">No certifications available</p>
        )}
      </div>
    </section>
  );
} 