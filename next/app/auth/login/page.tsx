"use client";

import { useState } from "react";
import { useAuth } from "@/app/components/auth/AuthContext";
import AuthLayout from "@/app/components/auth/AuthLayout";
import AuthInput from "@/app/components/auth/AuthInput";
import AuthButton from "@/app/components/auth/AuthButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <AuthLayout 
      title="Login"
      subtitle="Please sign in to continue."
      footer={{
        text: "Don't have an account?",
        linkText: "Sign up",
        linkHref: "/auth/signup"
      }}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-6">
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
        
        <div className="pt-6">
          <AuthButton text="LOGIN" />
        </div>
      </form>
    </AuthLayout>
  );
} 