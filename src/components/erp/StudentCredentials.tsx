"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { students as mockStudents } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

type StudentCredentialsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function StudentCredentials({ open, onOpenChange }: StudentCredentialsProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [generatedId, setGeneratedId] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!selectedStudentId) {
      toast({ title: "Error", description: "Please select a student.", variant: "destructive" });
      return;
    }
    const student = mockStudents.find(s => s.id === selectedStudentId);
    if (!student) return;

    const studentId = `SCH-${student.name.split(' ')[0].toUpperCase()}${student.rollNumber}`;
    const password = Math.random().toString(36).slice(-8);

    setGeneratedId(studentId);
    setGeneratedPassword(password);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Credentials copied to clipboard." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Generate Student Credentials</DialogTitle>
          <DialogDescription>
            Select a student to generate a new user ID and temporary password.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="student-select">Select Student</Label>
            <Select onValueChange={setSelectedStudentId}>
              <SelectTrigger id="student-select">
                <SelectValue placeholder="Select a student..." />
              </SelectTrigger>
              <SelectContent>
                {mockStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - Class {student.class}{student.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} className="w-full" disabled={!selectedStudentId}>
            Generate Credentials
          </Button>
          {generatedId && generatedPassword && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Generated Credentials</h3>
              <div className="space-y-2">
                <Label htmlFor="generated-id">Student ID</Label>
                <div className="flex items-center gap-2">
                  <Input id="generated-id" value={generatedId} readOnly />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedId)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="generated-password">Password</Label>
                 <div className="flex items-center gap-2">
                  <Input id="generated-password" value={generatedPassword} readOnly />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedPassword)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
