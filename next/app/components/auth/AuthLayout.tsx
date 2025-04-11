"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer: {
    text: string;
    linkText: string;
    linkHref: string;
  };
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  footer
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col relative">
      {/* Top-right corner blob with gradient effect */}
      <div className="absolute top-0 right-0 w-[35%] aspect-square pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-teal-50 via-emerald-100 to-green-200 rounded-bl-[50%]"></div>
      </div>
      
      <div className="flex-grow flex flex-col justify-center w-full">
        <div className="w-full max-w-md mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </div>

      {/* Footer section pushed to the bottom */}
      <div className="w-full text-center py-8">
        <span className="text-gray-500">{footer.text} </span>
        <Link href={footer.linkHref} className="text-emerald-500 hover:text-emerald-600 font-medium">
          {footer.linkText}
        </Link>
      </div>
    </div>
  );
} 