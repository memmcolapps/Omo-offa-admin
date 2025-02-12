"use client";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import useLogin from "../../hooks/useLogin";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./homeNavbar";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login, loading, data, error } = useLogin();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
      router.push("/Dashboard");
    }
  }, [data, router]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred during login");
    }
  }, [error]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)]  items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Admin Login
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                        disabled={loading}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 pr-12"
                          disabled={loading}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                          onClick={togglePasswordVisibility}
                          aria-label={
                            isPasswordVisible
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading || !form.formState.isValid}
                className="w-full h-12 bg-green-900 hover:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-green-100 font-semibold text-base transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
};

export default Login;
