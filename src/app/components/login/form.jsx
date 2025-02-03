"use client";
import { redirect } from "next/navigation";
import { ToastContainer } from "react-toastify";
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
} from "../../components/ui/form";
import useLogin from "../../hooks/useLogin";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./homeNavbar";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});
const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login, loading, data } = useLogin();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = (values) => {
    const { email, password } = values;
    login(email, password);
  };

  useEffect(() => {
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      redirect("/Dashboard");
    }
  }, [data]);

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="flex items-center justify-center m-28">
        <div className="p-[3.5rem] custom bg-white rounded-[1rem] w-[50rem]">
          <p className="font-[800] text-[2rem] text-[#07200B] text-center mb-[1.5rem]">
            Admin Login
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[1.5rem] text-black">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        type="text"
                        placeholder="Enter Email"
                        className="border font-[600] placeholder:text-[#B6B9B8] text-black bg-white placeholder:font-[400] h-[3.7rem] placholder:text-[1.3rem]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-[1.5rem] relative">
                    <FormLabel className="text-[1.2rem] text-black">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Enter Password"
                          className="border font-[600] placeholder:text-[#B6B9B8] text-black bg-white placeholder:font-[400] h-[3.7rem] text-[1.3rem] pr-[3rem] placholder:text-[1.3rem]"
                        />
                        <span
                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="w-[2rem] text-black" />
                          ) : (
                            <Eye className="w-[2rem] text-black" />
                          )}
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                required
                disabled={loading || !form.formState.isValid}
                className="w-full mt-[2.8rem] py-[2rem] rounded-[.5rem] bg-[#002B1E] font-[800] text-[#C8FFC4] text-[1.5rem]"
              >
                Log In
                {loading && (
                  <Loader2 className="ml-[.5rem] animate-spin w-[1.5rem]" />
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
