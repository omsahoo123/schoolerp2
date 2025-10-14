"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase } from "lucide-react";
import Header from "@/components/erp/Header";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const jobApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  subject: z.string({ required_error: "Please select a subject." }),
  experience: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(0, "Experience cannot be negative.")
  ),
  resume: z.string().min(50, "Please provide your resume details."),
});

type JobApplicationValues = z.infer<typeof jobApplicationSchema>;

export default function CareersPage() {
  const { toast } = useToast();
  const heroImage = PlaceHolderImages.find(p => p.id === 'careers-hero');
  const router = useRouter();

  const form = useForm<JobApplicationValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      experience: 0,
      resume: "",
    },
  });

  function onSubmit(data: JobApplicationValues) {
    toast({
      title: "Application Submitted!",
      description: `Thank you for your interest, ${data.fullName}. We have received your application.`,
    });
    form.reset();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="relative h-64 md:h-80 w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-black/30 flex items-end justify-center pb-8 px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white font-headline">
                Join Our Team
              </h1>
              <p className="mt-2 text-lg md:text-xl text-primary-foreground/90">
                Shape the future of education with us.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <Link href="/login" className="mb-8 inline-block">
                <Button variant="outline">&larr; Back to Login</Button>
            </Link>
          <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Briefcase className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold font-headline">Job Application Form</h2>
                    <p className="text-muted-foreground">
                        We're looking for passionate educators to join our team.
                    </p>
                </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Priya Singh" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="priya.singh@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input type="tel" placeholder="+91 98765 43210" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline border-b pb-2">Professional Information</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject of Expertise</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="mathematics">Mathematics</SelectItem>
                                        <SelectItem value="physics">Physics</SelectItem>
                                        <SelectItem value="chemistry">Chemistry</SelectItem>
                                        <SelectItem value="biology">Biology</SelectItem>
                                        <SelectItem value="english">English</SelectItem>
                                        <SelectItem value="history">History</SelectItem>
                                        <SelectItem value="geography">Geography</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="experience" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl><Input type="number" placeholder="5" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                   </div>
                   <FormField control={form.control} name="resume" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resume / CV</FormLabel>
                            <FormControl><Textarea placeholder="Paste your resume or provide a link to your online profile (e.g., LinkedIn)." className="min-h-[150px]" {...field} /></FormControl>
                            <FormDescription>
                                We currently do not support file uploads. Please paste your details above.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                
                <div className="flex justify-end">
                    <Button type="submit" size="lg">Submit Application</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
