"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CreditCard, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Fee, HostelFee } from "@/lib/types";

type FeePaymentProps = {
    fee: Fee | HostelFee;
    feeType: 'tuition' | 'hostel';
    title: string;
};

export default function FeePayment({ fee, feeType, title }: FeePaymentProps) {
    const router = useRouter();
    const { toast } = useToast();
    
    const handlePayment = () => {
        if (fee) {
            router.push(`/pay?studentId=${fee.studentId}&amount=${fee.amount}&feeType=${feeType}`);
        }
    };
    
    const handleGenerateReceipt = () => {
        toast({
            title: "Receipt Generated",
            description: `Fee receipt for ${fee?.studentName} has been downloaded.`,
        });
    }

    if (!fee) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><CreditCard /> {title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No fee information available at this time.</p>
                </CardContent>
            </Card>
        )
    }

    const isPaymentDue = fee.status === 'Due' || fee.status === 'Overdue';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><CreditCard /> {title}</CardTitle>
                <CardDescription>View your current fee status and make payments.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-background">
                    <div className="mb-4 sm:mb-0">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold font-headline">₹{fee.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                            Due Date: {format(new Date(fee.dueDate), "MMM dd, yyyy")}
                        </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                        <Badge variant={fee.status === 'Paid' ? 'success' : fee.status === 'Due' ? 'warning' : 'destructive'}>
                            Status: {fee.status}
                        </Badge>
                        {isPaymentDue ? (
                            <Button onClick={handlePayment}>
                                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                            </Button>
                        ) : (
                            <Button variant="secondary" onClick={handleGenerateReceipt}>
                                <Receipt className="mr-2 h-4 w-4" /> Download Receipt
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
