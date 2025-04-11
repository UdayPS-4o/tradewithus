import Image from 'next/image';

interface CertificationCardProps {
  certification: {
    name: string;
    icon: string;
    validFrom: string;
    validTo: string;
  }
}

export default function CertificationCard({ certification }: CertificationCardProps) {
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