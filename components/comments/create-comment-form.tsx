"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useContext } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { CreateCommentValidator } from "~/lib/validators/comment";
import { Context } from "~/context";

interface CreateCommentFormProps {
  postId: string;
}

export const CreateCommentForm: FC<CreateCommentFormProps> = ({ postId }) => {
  const context = useContext(Context);

  const form = useForm<z.infer<typeof CreateCommentValidator>>({
    resolver: zodResolver(CreateCommentValidator),
    defaultValues: {
      postId,
      content: ""
    }
  });

  async function onSubmit(values: z.infer<typeof CreateCommentValidator>) {
    const res = await axios.post("/api/comments/create", values);

    form.reset();

    const commentId = res.data;

    context.setValue({
      ...context.value,
      createdComment: {
        commentId
      }
    });
  }

  const isLoading = form.formState.isLoading;

  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 p-4 sm:rounded-md">
      <p className="text-center font-semibold">Create comment</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-flow-row gap-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>content</FormLabel>
                <FormControl>
                  <TextareaAutosize
                    placeholder="enter content"
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
              comment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
