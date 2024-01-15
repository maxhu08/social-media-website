"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FC } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import axios from "axios";
import { UserRegisterValidator } from "~/lib/validators/user";
import { useRouter } from "next/navigation";

export const SignUpForm: FC = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof UserRegisterValidator>>({
    resolver: zodResolver(UserRegisterValidator),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: z.infer<typeof UserRegisterValidator>) {
    try {
      const res = await axios.post("/api/users/register", values);

      if (res.status === 200) {
        router.push("/sign-in");
      }
    } catch (err: any) {
      if (err.response.status === 409) {
        if (err.response.data === "username taken") {
          form.setError("name", {
            message: "username is taken"
          });
        }

        if (err.response.data === "email in use") {
          form.setError("email", {
            message: "email is in use"
          });
        }
      }
    }
  }

  const isLoading = form.formState.isLoading;

  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 p-4 rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-flow-row gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>username</FormLabel>
                <FormControl>
                  <Input placeholder="enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: any }) => (
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
            render={({ field }: { field: any }) => (
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
              register
            </Button>
          </div>
          <span className="text-center">
            already a user?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:text-blue-700 transition">
              sign in
            </Link>
          </span>
        </form>
      </Form>
    </div>
  );
};
