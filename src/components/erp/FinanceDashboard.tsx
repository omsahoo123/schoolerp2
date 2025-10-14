"use client";

import { useToast } from "@/hooks/use-toast";
import { DollarSign, Edit, Receipt, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FeeStatusChart from "./FeeStatusChart";
import KpiCard from "./KpiCard";
import { useData } from "@/lib/data-context";
import HostelChart from "./HostelChart";
import { useState } from "react";
import { Fee, HostelFee } from "@/lib/types";
import EditFeeDialog from "./EditFeeDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function FinanceDashboard() {
  const { fees, setFees, hostelFees, setHostelFees } = useData();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);

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

  const handleEditClick = (fee: Fee) => {
    setSelectedFee(fee);
    setIsEditDialogOpen(true);
  };
  
  const handleFeeUpdate = (studentId: string, newAmount: number) => {
    setFees(prevFees =>
        prevFees.map(fee =>
            fee.studentId === studentId ? { ...fee, amount: newAmount } : fee
        )
    );
    toast({
        title: "Fee Updated",
        description: "The student's fee amount has been successfully updated."
    })
  };

  return (
    <>
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
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Fee Management</CardTitle>
                    <CardDescription>Overview of tuition and hostel fees for all students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="tuition">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="tuition">Tuition Fees</TabsTrigger>
                            <TabsTrigger value="hostel">Hostel Fees</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tuition">
                            <ScrollArea className="h-[450px] mt-4">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
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
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleEditClick(fee)}
                                          disabled={fee.status === 'Paid'}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleGenerateReceipt(fee.studentName)}
                                          disabled={fee.status !== 'Paid'}
                                        >
                                          <Receipt className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="hostel">
                             <ScrollArea className="h-[450px] mt-4">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Room No.</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {hostelFees.map((fee) => (
                                    <TableRow key={fee.studentId}>
                                    <TableCell className="font-medium">{fee.studentName}</TableCell>
                                    <TableCell>{fee.roomNumber}</TableCell>
                                    <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={fee.status === 'Paid' ? 'success' : fee.status === 'Due' ? 'warning' : 'destructive'}>
                                        {fee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          // onClick={() => handleEditClick(fee)} // TODO: Implement edit for hostel fee
                                          disabled={fee.status === 'Paid'}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleGenerateReceipt(fee.studentName)}
                                          disabled={fee.status !== 'Paid'}
                                        >
                                          <Receipt className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <FeeStatusChart />
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HostelChart />
        </div>
    </div>
    {selectedFee && (
        <EditFeeDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            fee={selectedFee}
            onSave={handleFeeUpdate}
        />
    )}
    </>
  );
}
