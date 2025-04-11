"use client";

import { Input } from "@/app/components/ui/input";
import Image from "next/image";

interface AuthInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  iconSrc: string;
  label: string;
}

export default function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  required = true,
  iconSrc,
  label
}: AuthInputProps) {
  return (
    <div>
      <label className="text-xs text-gray-400 uppercase mb-2 block">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Image src={iconSrc} alt={`${label} icon`} width={20} height={20} className="text-gray-400" />
        </div>
        <Input
          type={type}
          placeholder={placeholder}
          className="h-14 pl-12 pr-4 rounded-2xl bg-white shadow-sm border-0 ring-1 ring-gray-100 w-full text-gray-700"
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
} 