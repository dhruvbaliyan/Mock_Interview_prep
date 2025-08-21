"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // if using next-auth
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      // If using next-auth
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Your existing email/password form */}

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-300" />
        <span className="text-gray-500 text-sm">or</span>
        <div className="h-px flex-1 bg-gray-300" />
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </button>
    </div>
  );
}
