"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import axios from "axios";

const formSchema = z
  .object({
    productLink: z
      .string()
      .min(5)
      .refine((v) => /^https?:\/\//i.test(v), {
        message: "Product link must start with http or https",
      }),
    productName: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "Provide a product description or paste reviews (min 10 chars).",
    }),
  })
  .refine((v) => !!v.description?.trim(), {
    message: "Product description or reviews are required",
    path: ["description"],
  });

interface AnalysisResult {
  pros: string[];
  cons: string[];
  fakeReviewProbability: number;
  verdict: string;
  alternative?: {
    productName: string;
    reason: string;
  };
}

export default function ReviewForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productLink: "",
      productName: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    setLoading(true);
    try {
      const apiUrl = "/analyze-product";
      console.log("API URL:", apiUrl);
      const payload = {
        productLink: values.productLink,
        productName: values.productName,
        description: values.description,
      };
      console.log("Payload:", payload);

      // Use axios instead of fetch
      const response = await axios.post(apiUrl, payload);
      const data = response.data;

      // Backend returns either { error: '...' } or the analysis object
      if (data?.error) {
        setError(data.error);
      } else {
        // Save analysis result to sessionStorage and navigate to result page
        try {
          sessionStorage.setItem("analysisResult", JSON.stringify(data));
          router.push("/analyze/result");
        } catch (e) {
          console.error("Storage error:", e);
          setError("Failed to store analysis result");
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="productLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/product/123"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Wireless Headphones" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description / Reviews</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste product description or reviews here..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Analyzing..." : "Analyze Reviews"}
        </Button>
      </form>
    </Form>
  );
}
