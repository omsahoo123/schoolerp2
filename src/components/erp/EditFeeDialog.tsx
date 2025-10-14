"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fee } from "@/lib/types";

type EditFeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fee: Fee | null;
  onSave: (studentId: string, newAmount: number) => void;
};

export default function EditFeeDialog({ open, onOpenChange, fee, onSave }: EditFeeDialogProps) {
  const [amount, setAmount] = useState<number | string>("");

  useEffect(() => {
    if (fee) {
      setAmount(fee.amount);
    }
  }, [fee]);

  const handleSave = () => {
    if (fee && amount !== "") {
      const newAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (!isNaN(newAmount)) {
        onSave(fee.studentId, newAmount);
        onOpenChange(false);
      }
    }
  };

  if (!fee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Edit Fee Amount</DialogTitle>
          <DialogDescription>
            Update the fee amount for {fee.studentName}. The current status is {fee.status}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fee-amount">New Fee Amount</Label>
            <Input
              id="fee-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter new amount"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
