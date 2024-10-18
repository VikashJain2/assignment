import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Schema, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeClosed, EyeClosedIcon, Loader2 } from "lucide-react";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
const UserForm = () => {
  const [state, setState] = useState("register");
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate()
  const registerSchema = z.object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 4 characters long" })
      .max(30, { message: "Name must be less than 30 characters" })
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password should be minimum 6 character long")
      .max(15, "Password must be less than 15 characters"),
    phone: z
      .string()
      .length(10, "Phone number must be 10 digits")
      .regex(/^\d+$/, "Phone number can only contain numbers"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  });

  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password should be minimum 6 character long")
      .max(15, "Password must be less than 15 characters"),
  });
  // useEffect(()=>{
  //   console.log(state);

  // },[state])
  const formSchema = state === "register" ? registerSchema : loginSchema;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues:
      state === "register"
        ? {
            name: "",
            email: "",
            password: "",
            phone: "",
            terms: false,
          }
        : {
            email: "",
            password: "",
          },
  });

  const onSubmit = async (values) => {
    let url = "http://localhost:4000/api/user";

    if (state === "register") {
      url += "/register";
    }
    if (state === "login") {
      url += "/login";
    }
    try {
      const response = await axios.post(url, values);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/success")
        form.reset();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        error.response.data.errors.foreach((err) => {
          form.setError({ message: err.message });
        });
      } else {
        toast.error("Something went wrong. Please try again");
      }
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="shadow-md p-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-80"
          >
            {state === "register" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl className="hover:shadow-md">
                      <Input placeholder="Name" {...field} />
                    </FormControl>

                    <FormMessage className="text-indigo-500" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl className="hover:shadow-md">
                    <Input
                      placeholder="abc@gmail.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-indigo-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl className="hover:shadow-md">
                    <Input
                      placeholder="Password"
                      type={`${showPassword ? "text" : "password"}`}
                      {...field}
                    />
                  </FormControl>
                  {showPassword ? (
                    <Eye
                      onClick={() => setShowPassword(false)}
                      className="absolute top-8 right-2 cursor-pointer"
                    />
                  ) : (
                    <EyeClosed
                      onClick={() => setShowPassword(true)}
                      className="absolute top-8 right-2 cursor-pointer"
                    />
                  )}

                  <FormMessage className="text-indigo-500" />
                </FormItem>
              )}
            />
            {state === "register" && (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl className="hover:shadow-md">
                      <Input placeholder="number" {...field} />
                    </FormControl>
                    <FormMessage className="text-indigo-500" />
                  </FormItem>
                )}
              />
            )}
            {state === "register" && (
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:shadow-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-red-400"
                        />
                      </FormControl>

                      <div className="space-y-1 leading-none">
                        <FormLabel>Accept terms and conditions</FormLabel>
                      </div>
                    </div>
                    <FormMessage className="text-indigo-500" />
                  </FormItem>
                )}
              />
            )}
            <div>
              {state === "register" && (
                <p className="font-semibold text-sm">
                  Already have an account?{" "}
                  <span
                    onClick={() => setState("login")}
                    className="text-rose-500 hover:underline hover:text-rose-800 cursor-pointer"
                  >
                    Log in
                  </span>
                </p>
              )}
              {state === "login" && (
                <p className="font-semibold text-sm">
                  Don't have an account?{" "}
                  <span
                    onClick={() => setState("register")}
                    className="text-rose-500 hover:underline hover:text-rose-800 cursor-pointer"
                  >
                    Create new account
                  </span>
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="bg-rose-500 text-white hover:bg-rose-600"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserForm;
