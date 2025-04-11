"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/components/auth/AuthContext";
import AuthLayout from "@/app/components/auth/AuthLayout";
import AuthInput from "@/app/components/auth/AuthInput";
import AuthButton from "@/app/components/auth/AuthButton";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { signup, error: authError } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validation
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    await signup(name, email, password);
  };

  // Combine password error with auth error
  const error = passwordError || authError;

  return (
    <AuthLayout 
      title="Create Account"
      footer={{
        text: "Already have an account?",
        linkText: "Sign in",
        linkHref: "/auth/login"
      }}
    >
          <Link href="/auth/login" className="inline-flex items-center mb-8 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg">
          {error}
                  </div>
                )}
      
      <form onSubmit={handleSignup} className="space-y-6">
        <AuthInput
                  type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          iconSrc="/assets/auth/user-icon.svg"
          label="NAME"
        />

        <AuthInput
                  type="email"
          placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
          iconSrc="/assets/auth/email-icon.svg"
          label="EMAIL"
        />
        
        <AuthInput
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          iconSrc="/assets/auth/password-icon.svg"
          label="PASSWORD"
        />
        
        <AuthInput
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          iconSrc="/assets/auth/password-icon.svg"
          label="CONFIRM PASSWORD"
        />
        
        <div className="pt-6">
          <AuthButton text="SIGN UP" />
        </div>
      </form>
    </AuthLayout>
  );
} 