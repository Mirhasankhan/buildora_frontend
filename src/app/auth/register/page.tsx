"use client";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useRegisterRequestMutation } from "@/redux/features/auth/authApi";

interface ExtendedJwtPayload {
  role?: string;
  email?: string;
  token?: string;
}

interface FormValues {
  email: string;
  name: string;
  password: string;
}

const getTokenData = (): { role: string; email: string; token: string } => {
  try {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || "";
    if (!token) return { role: "", email: "", token: "" };

    const decoded = jwtDecode<ExtendedJwtPayload>(token);
    return {
      role: decoded.role || "",
      email: decoded.email || "",
      token,
    };
  } catch (err) {
    console.error("Invalid token", err);
    return { role: "", email: "", token: "" };
  }
};

const RegisterAccount = () => {
  const [registerUser, { isLoading }] = useRegisterRequestMutation();
  const [tokenData] = useState(getTokenData());
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: tokenData.email },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const payload = {
      userName: data.name,
      password: data.password,
      token: tokenData.token,
    };

    try {
      await registerUser(payload).unwrap();
      toast.success("User registered Successfully");
      router.push("/auth/login");
      reset();
    } catch (error: any) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center mx-2 justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-md">
        <h2 className="md:text-2xl text-center mb-6">
          Register your account as a{" "}
          <span className="font-medium">{tokenData.role}</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              readOnly
              className={`input-design ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-600 font-medium">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="enter your name"
              className={`input-design ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-600 font-medium">Password</label>
            <input
              type="password"
              placeholder="enter password"
              {...register("password", { required: "Password is required" })}
              className={`input-design ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!tokenData.email || isLoading}
            className="w-full py-2 bg-[#FF6B00] disabled:bg-gray-300 cursor-pointer text-white rounded  transition-colors"
          >
            {isLoading ? "Registering.." : "Register"}
          </button>
        </form>
        <h1 className="text-center pt-2">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#FF6B00]">
            Login
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default RegisterAccount;
