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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, UserPlus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Header from "@/components/erp/Header";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/lib/data-context";
import { AdmissionApplication } from "@/lib/types";
import { useRouter } from "next/navigation";

const admissionFormSchema = z.object({
  studentFirstName: z.string().min(2, "First name must be at least 2 characters."),
  studentLastName: z.string().min(2, "Last name must be at least 2 characters."),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }).refine((date) => {
    const today = new Date();
    const twoYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
    return date <= twoYearsAgo;
  }, "Student must be at least 2 years old."),
  gender: z.string({ required_error: "Please select a gender." }),
  applyingForGrade: z.string({ required_error: "Please select a grade." }),
  previousSchool: z.string().optional(),
  parentFirstName: z.string().min(2, "Parent's first name is required."),
  parentLastName: z.string().min(2, "Parent's last name is required."),
  parentEmail: z.string().email("Please enter a valid email address."),
  parentPhone: z.string().min(10, "Please enter a valid phone number."),
  address: z.string().min(10, "Address is required"),
});

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

export default function AdmissionsPage() {
  const { toast } = useToast();
  const heroImage = PlaceHolderImages.find(p => p.id === 'admission-hero');
  const { setAdmissionApplications } = useData();
  const router = useRouter();

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      studentFirstName: "",
      studentLastName: "",
      previousSchool: "",
      parentFirstName: "",
      parentLastName: "",
      parentEmail: "",
      parentPhone: "",
      address: "",
      gender: "",
      applyingForGrade: "",
    },
  });

  function onSubmit(data: AdmissionFormValues) {
    const newApplication: AdmissionApplication = {
        id: `APP${Date.now()}`,
        studentName: `${data.studentFirstName} ${data.studentLastName}`,
        parentName: `${data.parentFirstName} ${data.parentLastName}`,
        parentEmail: data.parentEmail,
        applyingForGrade: data.applyingForGrade,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        gender: data.gender,
    };

    setAdmissionApplications(prev => [newApplication, ...prev]);

    toast({
      title: "Application Submitted!",
      description: `Thank you, ${data.parentFirstName}. Your application for ${data.studentFirstName} has been received and is pending review.`,
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
                Admissions 2025-2026
              </h1>
              <p className="mt-2 text-lg md:text-xl text-primary-foreground/90">
                Join our community of learners and leaders.
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
                    <UserPlus className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold font-headline">Online Admission Form</h2>
                    <p className="text-muted-foreground">
                        Please fill out the form below to start the admission process.
                    </p>
                </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline border-b pb-2">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="studentFirstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input placeholder="Aarav" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="studentLastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input placeholder="Sharma" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" captionLayout="dropdown-buttons" selected={field.value} onSelect={field.onChange} fromYear={1950} toYear={new Date().getFullYear() - 2} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="applyingForGrade" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Applying for Grade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                                <SelectItem key={grade} value={String(grade)}>Grade {grade}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="previousSchool" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous School (if any)</FormLabel>
                          <FormControl><Input placeholder="Sunshine International" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                   </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline border-b pb-2">Parent / Guardian Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="parentFirstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input placeholder="Rohan" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="parentLastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input placeholder="Sharma" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="parentEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="rohan.sharma@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="parentPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input type="tel" placeholder="+91 98765 43210" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residential Address</FormLabel>
                        <FormControl><Textarea placeholder="123, Main Street, New Delhi - 110001" {...field} /></FormControl>
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
