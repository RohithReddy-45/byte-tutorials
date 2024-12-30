"use client";

import LoadingButton from "@/components/LoadingButton";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { technologies } from "@/constants/constants";
import { VideoSchema, type YoutubeValues } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { adminFormAction } from "./action";

export default function AdminForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<YoutubeValues>({
    resolver: zodResolver(VideoSchema),
    defaultValues: {
      link: "",
      title: "",
      tags: [],
    },
  });

  const handleSubmit = (data: YoutubeValues) => {
    startTransition(async () => {
      try {
        const result = await adminFormAction(data);
        console.log(result);
        if (result.error) {
          throw new Error(result.error);
        }
        form.reset();
        setError(undefined);
        redirect("/courses");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error(error);
        } else {
          console.error(error);
          setError("Unknown error occurred");
        }
      }
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col flex-co gap-3 w-full p-2"
      >
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="YouTube URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Video title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (!field.value.includes(value)) {
                    field.onChange([...field.value, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {technologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center flex-wrap gap-1"
                  >
                    {tag}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() => {
                        field.onChange(field.value.filter((t) => t !== tag));
                      }}
                    />
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
