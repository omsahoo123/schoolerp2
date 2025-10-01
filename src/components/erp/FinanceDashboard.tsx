"use client";

import { useToast } from "@/hooks/use-toast";
import { DollarSign, Receipt, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FeeStatusChart from "./FeeStatusChart";
import KpiCard from "./KpiCard";
import { useData } from "@/lib/data-context";

export default function FinanceDashboard() {
  const { fees } = useData();
  const { toast } = useToast();

  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
  const dueFees = totalFees - paidFees;
  const collectionRate = totalFees > 0 ? (paidFees / totalFees) * 100 : 0;

  const handleGenerateReceipt = (studentName: string) => {
    toast({
      title: "Receipt Generated",
      description: `Fee receipt for ${studentName} has been generated and sent.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Collection Rate"
          icon={<TrendingUp className="h-6 w-6" />}
          value={`${collectionRate.toFixed(1)}%`}
          description={`₹${paidFees.toLocaleString()} / ₹${totalFees.toLocaleString()}`}
        />
        <KpiCard
          title="Total Collected"
          icon={<DollarSign className="h-6 w-6" />}
          value={`₹${paidFees.toLocaleString()}`}
          description="This academic year"
        />
        <KpiCard
          title="Total Due"
          icon={<DollarSign className="h-6 w-6 text-destructive" />}
          value={`₹${dueFees.toLocaleString()}`}
          description="Across all students"
        />
        <KpiCard
          title="Overdue Payments"
          icon={<Users className="h-6 w-6 text-destructive" />}
          value={fees.filter(f => f.status === 'Overdue').length.toString()}
          description="Students with overdue fees"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Student Fee Details</CardTitle>
            <CardDescription>Overview of fee status for all students.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[450px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee.studentId}>
                      <TableCell className="font-medium">{fee.studentName}</TableCell>
                      <TableCell>{fee.class}</TableCell>
                      <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={fee.status === 'Paid' ? 'success' : fee.status === 'Due' ? 'warning' : 'destructive'}>
                          {fee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateReceipt(fee.studentName)}
                          disabled={fee.status !== 'Paid'}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        <FeeStatusChart />
      </div>
    </div>
  );
}
