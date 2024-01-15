"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { EditPostValidator } from "~/lib/validators/post";
import TextareaAutosize from "react-textarea-autosize";

interface EditPostFormProps {
  defaultValues: {
    title: string;
    content: string;
  };
  postId: string;
}

export const EditPostForm: FC<EditPostFormProps> = ({ defaultValues, postId }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof EditPostValidator>>({
    resolver: zodResolver(EditPostValidator),
    defaultValues: {
      id: postId,
      title: defaultValues.title,
      content: defaultValues.content
    }
  });

  async function onSubmit(values: z.infer<typeof EditPostValidator>) {
    await axios.patch("/api/posts/edit", values);

    router.push(`/posts/${postId}`);
  }

  const isLoading = form.formState.isLoading;

  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 p-4 sm:rounded-md">
      <p className="text-center font-semibold">Edit post</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-flow-row gap-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>title</FormLabel>
                <FormControl>
                  <TextareaAutosize
                    placeholder="enter title"
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>content</FormLabel>
                <FormControl>
                  {/* <Input placeholder="enter content (optional)" {...field} /> */}
                  <TextareaAutosize
                    placeholder="enter content (optional)"
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button type="submit" disabled={isLoading}>
              submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
