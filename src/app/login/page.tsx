"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { School } from "lucide-react";
import { useData } from "@/lib/data-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const loginFormSchema = z.object({
  username: z.string().min(1, "User ID is required."),
  password: z.string().min(1, "Password is required."),
  role: z.string({ required_error: "Please select a role." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { users } = useData();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  function onSubmit(data: LoginFormValues) {
    const user = users.find(
      (u) => u.userId === data.username && u.password === data.password && u.role === data.role
    );

    if (user) {
        toast({
            title: "Login Successful",
            description: `Welcome, ${user.role}!`,
        });

        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("userRole", user.role);
        
        if (user.role === 'Student' && user.studentId) {
            sessionStorage.setItem("studentId", user.studentId);
        } else {
            sessionStorage.removeItem("studentId");
        }

        router.push("/");
    } else {
         toast({
            title: "Login Failed",
            description: "Invalid credentials or role.",
            variant: "destructive",
        });
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <School className="h-8 w-8" />
                </div>
            </div>
          <CardTitle className="text-3xl font-bold font-headline">School ERP</CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                        <Input placeholder="Your user ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="Your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
