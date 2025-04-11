"use client";

import { ArrowRight } from "lucide-react";

interface AuthButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

export default function AuthButton({
  text,
  onClick,
  type = "submit",
  fullWidth = false
}: AuthButtonProps) {
  return (
    <button 
      type={type} 
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : 'w-full max-w-[160px] ml-auto'} h-12 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full font-medium flex items-center justify-center group relative overflow-hidden shadow-md`}
    >
      <div className="flex items-center justify-between w-full px-8">
        <span>{text}</span>
        <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
} 