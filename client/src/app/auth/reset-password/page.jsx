"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authApi } from "../api/authApi";
import { authInputSchema } from "@/schemas/auth.schema";
import Card from "@/components/ui/Card";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(authInputSchema.resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    try {
      await authApi.resetPassword({ token, password: data.password });
      toast.success("Password reset successful.");
      router.push("/auth/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <Card className="w-full max-w-[400px] bg-background p-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex items-center flex-col justify-center w-full"
        >
          <h1 className="text-2xl font-bold text-center">
            Reset Your Password
          </h1>
          <p className="text-sm text-gray-500 text-center mb-4">
            Enter your new password below
          </p>

          <Input
            type="password"
            placeholder="New Password"
            {...register("password")}
            error={errors.password}
            helperText={errors.password?.message}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
