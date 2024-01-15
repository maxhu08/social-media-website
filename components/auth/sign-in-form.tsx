"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FC } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  email: z.string(),
  password: z.string()
});

export const SignInForm: FC = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn("credentials", { email: values.email, password: values.password, redirect: false });

    if (res?.status === 200) {
      router.push("/");
      router.refresh();
    } else if (res?.status === 401) {
      form.setError("password", { message: "incorrect username or password" });
    }
  }

  const isLoading = form.formState.isLoading;

  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 p-4 rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-flow-row gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="enter email" {...field} />
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
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input placeholder="enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button type="submit" disabled={isLoading}>
              login
            </Button>
          </div>
          <span className="text-center">
            not a user?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:text-blue-700 transition">
              sign up
            </Link>
          </span>
        </form>
      </Form>
    </div>
  );
};
