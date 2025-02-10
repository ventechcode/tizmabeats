"use client";

import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const signInSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters long",
    })
    .max(50),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .max(100),
});

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading(true);
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    console.log("callbackUrl", callbackUrl);
    const { username, password } = values;

    try {
      const result = await signIn("credentials", {
        email: username,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError(result?.error!);
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      setLoading(false);
    } catch (err) {
      console.error("Failed to sign in:", err);
    }
  }

  return (
    <div className="bg-surface0 p-6 rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="py-2 font-semibold text-2xl">Sign In</h1>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    className="text-text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    {...field}
                    className="text-text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-red">{error}</p>}
          <Button type="submit" className="w-full md:w-1/4">
            {!loading ? (
              "Login"
            ) : (
              <div className="loading loading-spinner"></div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
