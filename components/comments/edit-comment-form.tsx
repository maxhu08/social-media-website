"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { EditCommentValidator } from "~/lib/validators/comment";

interface EditCommentFormProps {
  defaultValues: {
    content: string;
  };
  commentId: string;
  setState: Dispatch<SetStateAction<string>>;
  setCommentContent: Dispatch<SetStateAction<string>>;
}

export const EditCommentForm: FC<EditCommentFormProps> = ({
  defaultValues,
  commentId,
  setState,
  setCommentContent
}) => {
  const form = useForm<z.infer<typeof EditCommentValidator>>({
    resolver: zodResolver(EditCommentValidator),
    defaultValues: {
      id: commentId,
      content: defaultValues.content
    }
  });

  async function onSubmit(values: z.infer<typeof EditCommentValidator>) {
    await axios.patch("/api/comments/edit", values);

    setCommentContent(values.content);
    setState("viewing");
  }

  const isLoading = form.formState.isLoading;

  return (
    <div>
      <p className="text-center font-semibold">Edit comment</p>
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
