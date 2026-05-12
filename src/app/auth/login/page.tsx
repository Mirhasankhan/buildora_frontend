"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/features/auth/authApi";

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await loginUser(payload).unwrap();

      toast.success("Loggedin Successfully");
      dispatch(
        setUser({
          name: response?.result?.name,
          email: response?.result?.email,
          role: response?.result?.role,
          token: response?.result?.accessToken,
        }),
      );
      Cookies.set("token", response?.result?.accessToken);
      router.push("/");
      reset();
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col mx-2 items-center justify-center bg-gray-100 gap-6">
      {/* Demo Credentials Section */}
      <div className="w-full max-w-md bg-blue-50 border-l-4 border-blue-500 p-4 rounded-[6px] shadow-sm">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Demo Accounts
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="font-medium text-blue-800">Admin Account:</p>
            <p className="text-gray-700">
              Email: <span className="font-mono">mirhasan000034@gmail.com</span>
            </p>
            <p className="text-gray-700">
              Password: <span className="font-mono">123456</span>
            </p>
          </div>
          <div className="pt-2 border-t border-blue-200">
            <p className="font-medium text-blue-800">Manager Account:</p>
            <p className="text-gray-700">
              Email: <span className="font-mono">mirhasasn.bd1@gmail.com</span>
            </p>
            <p className="text-gray-700">
              Password: <span className="font-mono">123456</span>
            </p>
          </div>
          <div className="pt-2 border-t border-blue-200">
            <p className="font-medium text-blue-800">Worker Account:</p>
            <p className="text-gray-700">
              Email: <span className="font-mono">teyoxix325@newtrea.com</span>
            </p>
            <p className="text-gray-700">
              Password: <span className="font-mono">123456</span>
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-[6px] shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            className={`input-design ${
              errors.email && "border-red-500 focus:ring-red-400"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6 relative">
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
            className={`input-design ${
              errors.password && "border-red-500 focus:ring-red-400"
            } pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF6B00] disabled:bg-gray-300 cursor-pointer  text-white py-2 rounded-[6px] font-semibold transition-colors"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
