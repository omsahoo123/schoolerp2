
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
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

type EditFeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fee: Fee | null;
  // onSave is no longer needed as we'll handle the update here
};

export default function EditFeeDialog({ open, onOpenChange, fee }: EditFeeDialogProps) {
  const [amount, setAmount] = useState<number | string>("");
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (fee) {
      setAmount(fee.amount);
    }
  }, [fee]);

  const handleSave = async () => {
    if (fee && amount !== "" && firestore) {
      const newAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (!isNaN(newAmount)) {
        // Find the original document ID. Assuming fees have a unique `id` property.
        // This is a bit tricky since useCollection in data-context doesn't easily expose the doc id
        // with the fee data. A better approach would be to ensure the 'id' is part of the Fee type.
        // For now, let's assume `studentId` might be unique for the `fees` collection for this demo purpose,
        // or that we can find the fee document to get its ID.
        // This requires a refactor if not the case. Let's assume we need to query to find the doc.
        // A direct ID on the object is better. Let's assume the Fee object from useData now includes an `id` field.
        if ('id' in fee && fee.id) {
          const feeDocRef = doc(firestore, "fees", fee.id);
          await updateDoc(feeDocRef, { amount: newAmount });
          toast({
            title: "Fee Updated",
            description: `The fee for ${fee.studentName} has been updated to ₹${newAmount}.`
          });
          onOpenChange(false);
        } else {
            toast({
                title: "Error",
                description: "Could not find the fee record to update. Document ID is missing.",
                variant: "destructive"
            })
        }
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
