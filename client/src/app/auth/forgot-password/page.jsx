"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authApi } from "../api/authApi";
import { AuthErrorCodes } from "@/config/errorCodes/authErrorCodes";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await authApi.sendOtp({
        to: email,
        template: "auth/otp",
        notificationType: "email",
      });

      toast.success("OTP sent to your email.");
      router.push(`/auth/forgot-password/verify-email?email=${email}`);
    } catch (err) {
      const errorCode = err.response?.data?.errorCode;
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendOtp(false);
        }}
        className="space-y-4 shadow-xl rounded-xl px-8 py-10 border border-zinc-200 flex items-center flex-col justify-center max-w-[400px] w-full"
      >
        <h1 className="text-2xl font-bold text-zinc-800 text-center">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          Enter your registered email to receive a verification code.
        </p>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
}
