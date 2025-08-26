"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const dataEntrySchema = z.object({
  value1: z.string().min(1, "Value 1 is required"),
  value2: z.string().min(1, "Value 2 is required"),
  value3: z.string().min(1, "Value 3 is required"),
});

type DataEntryFormData = z.infer<typeof dataEntrySchema>;

export default function DataEntryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const form = useForm<DataEntryFormData>({
    resolver: zodResolver(dataEntrySchema),
    defaultValues: {
      value1: "0",
      value2: "0",
      value3: "0",
    },
  });

  const onSubmit = async (data: DataEntryFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/data-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value1: parseFloat(data.value1),
          value2: parseFloat(data.value2),
          value3: parseFloat(data.value3),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save data entry");
      }

      setSubmitMessage("Data entry saved successfully!");
      form.reset();
    } catch (error) {
      console.error("Error saving data entry:", error);
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Failed to save data entry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Entry</h1>
        <p className="text-muted-foreground">
          Add new data points to your tracking system
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Data Entry</CardTitle>
          <CardDescription>
            Enter the three values you want to track
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="value1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value 1</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter value 1"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the first tracking value
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value 2</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter value 2"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the second tracking value
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value 3</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter value 3"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the third tracking value
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitMessage && (
                <Alert>
                  <AlertDescription>{submitMessage}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Data Entry"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
