import { useState } from "react";
import { Mail, MapPin, Phone } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string()
    .min(1, "Please enter your email address")
    .email("Please enter a valid email address (e.g., name@example.com)")
    .refine((email) => email.includes('@'), "Please include '@' in your email address")
    .refine((email) => email.split('@')[1]?.includes('.'), "Please enter the domain after '@' (e.g., example.com)"),
  subject: z.string().min(1, "Please enter a subject"),
  message: z.string().min(1, "Please enter your message"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactUs = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    setStatus("loading");
    try {
      // Here you would typically send the form data to your backend
      console.log("Form submitted:", values);
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      form.reset();
      setStatus("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 gap-8 mb-12">
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-[#39536f]">Get in Touch</h2>
                <p className="text-gray-700 mb-6">
                  Have a question, feedback, or need assistance? Fill out the form below and our team will get back to you as soon as possible.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-[#39536f]">Your Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your name"
                                className="w-full bg-gray-200 border-0 focus:outline-none focus:border-2 focus:border-[#d0e0ec]"
                                disabled={status === "loading"}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-[#39536f]">Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-gray-200 border-0 focus:outline-none focus:border-2 focus:border-[#d0e0ec]"
                                disabled={status === "loading"}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-[#39536f]">Subject</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter subject"
                              className="w-full bg-gray-200 border-0 focus:outline-none focus:border-2 focus:border-[#d0e0ec]"
                              disabled={status === "loading"}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-[#39536f]">Message</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              placeholder="Enter your message"
                              rows={6}
                              className="w-full bg-gray-200 border-0 focus:outline-none focus:border-2 focus:border-[#d0e0ec] rounded-md px-4 py-2"
                              disabled={status === "loading"}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full py-6 bg-[#39536f] hover:bg-[#2a405a]"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
