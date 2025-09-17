"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authApi } from "../api/authApi";
import { authInputSchema } from "@/schemas/auth.schema";
import Card from "@/components/ui/Card";

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(authInputSchema.registerSchema),
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        use_fedcm_for_button: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-register-button"),
        {
          theme: "outline",
          size: "large",
          text: "signup_with",
          width: window.innerWidth < 640 ? "290px" : "350px",
        }
      );
    };
    document.body.appendChild(script);
  }, []);

  const handleCredentialResponse = async (response) => {
    const idToken = response.credential;
    try {
      await authApi.googleLogin({ idToken });
      toast.success("Registered with Google");
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data?.message || "Google registration failed");
    }
  };

  const onSubmit = async (formData) => {
    try {
      await authApi.register(formData);
      toast.success("Registration successful");
      router.push(`/auth/verify-email?email=${formData.email}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-[400px] bg-background">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex items-center flex-col justify-center"
        >
          <h1 className="text-2xl font-bold ">Register</h1>

          <div className="max-md:w-[290px] w-full">
            <Input
              placeholder="Full Name"
              {...register("name")}
              error={errors.name}
              helperText={errors.name?.message}
            />
          </div>

          <div className="max-md:w-[290px] w-full">
            <Input
              placeholder="Email"
              {...register("email")}
              error={errors.email}
              helperText={errors.email?.message}
            />
          </div>

          <div className="max-md:w-[290px] w-full">
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              error={errors.password}
              helperText={errors.password?.message}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="max-md:w-[290px] w-full"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          <div id="google-register-button" className="h-[50px]"></div>

          <div className="text-sm text-center space-x-2 pt-2">
            <span>Already have an account?</span>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
