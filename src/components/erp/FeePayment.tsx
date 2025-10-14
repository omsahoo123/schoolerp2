"use client";

import { useData } from "@/lib/data-context";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CreditCard, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type FeePaymentProps = {
    studentId: string;
};

export default function FeePayment({ studentId }: FeePaymentProps) {
    const { fees } = useData();
    const router = useRouter();
    const { toast } = useToast();
    const studentFee = fees.find(fee => fee.studentId === studentId);

    const handlePayment = () => {
        if (studentFee) {
            router.push(`/pay?studentId=${studentFee.studentId}&amount=${studentFee.amount}`);
        }
    };
    
    const handleGenerateReceipt = () => {
        toast({
            title: "Receipt Generated",
            description: `Fee receipt for ${studentFee?.studentName} has been downloaded.`,
        });
    }

    if (!studentFee) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><CreditCard /> Fee Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No fee information available at this time.</p>
                </CardContent>
            </Card>
        )
    }

    const isPaymentDue = studentFee.status === 'Due' || studentFee.status === 'Overdue';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><CreditCard /> Fee Status</CardTitle>
                <CardDescription>View your current fee status and make payments.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-background">
                    <div className="mb-4 sm:mb-0">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold font-headline">₹{studentFee.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                            Due Date: {format(new Date(studentFee.dueDate), "MMM dd, yyyy")}
                        </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                        <Badge variant={studentFee.status === 'Paid' ? 'success' : studentFee.status === 'Due' ? 'warning' : 'destructive'}>
                            Status: {studentFee.status}
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
