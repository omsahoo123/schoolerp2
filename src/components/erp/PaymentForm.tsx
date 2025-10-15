
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";
import { useData } from "@/lib/data-context";
import Link from "next/link";

const paymentFormSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits."),
  cardName: z.string().min(2, "Name on card is required."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format."),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits."),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { setFees, setHostelFees } = useData();

  const studentId = searchParams.get("studentId");
  const amount = searchParams.get("amount");
  const feeType = searchParams.get("feeType");

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    }
  });

  function onSubmit(data: PaymentFormValues) {
    if (!studentId || !feeType) {
        toast({ title: "Error", description: "Payment information incomplete.", variant: "destructive"});
        return;
    }

    if(feeType === 'tuition') {
        setFees(prevFees =>
            prevFees.map(fee =>
                fee.studentId === studentId ? { ...fee, status: "Paid" } : fee
            )
        );
    } else if (feeType === 'hostel') {
        setHostelFees(prevFees =>
            prevFees.map(fee =>
                fee.studentId === studentId ? { ...fee, status: "Paid" } : fee
            )
        );
    }


    toast({
        title: "Payment Successful!",
        description: `₹${amount} has been paid successfully.`,
    });
    router.push("/");
  }

  if (!studentId || !amount || !feeType) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
             <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Missing payment information. Please go back to the dashboard and try again.</p>
                    <Link href="/" className="mt-4 inline-block">
                        <Button>Go to Dashboard</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-4 left-4">
             <Link href="/">
                <Button variant="outline">&larr; Back to Dashboard</Button>
            </Link>
        </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <CreditCard className="h-8 w-8" />
                </div>
            </div>
          <CardTitle className="text-3xl font-bold font-headline">Secure Payment</CardTitle>
          <CardDescription>Enter card details to pay fee of <span className="font-bold text-primary">₹{Number(amount).toLocaleString()}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                        <Input placeholder="**** **** **** ****" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name on Card</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Rohan Sharma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="***" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Pay ₹{Number(amount).toLocaleString()}
              </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                This is a simulated payment gateway. No real transaction will be made.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
