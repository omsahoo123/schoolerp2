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
import { useToast } from "@/hooks/use-toast";
import { Copy, KeyRound } from "lucide-react";
import { useData } from "@/lib/data-context";

type TeacherCredentialsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TeacherCredentials({ open, onOpenChange }: TeacherCredentialsProps) {
  const { teachers, setUsers } = useData();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [generatedId, setGeneratedId] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!selectedTeacherId) {
      toast({ title: "Error", description: "Please select a teacher.", variant: "destructive" });
      return;
    }
    const teacher = teachers.find(t => t.id === selectedTeacherId);
    if (!teacher) return;

    const teacherUserId = `TCH-${teacher.name.split(' ').join('').slice(0, 5).toUpperCase()}`;
    const password = Math.random().toString(36).slice(-8);

    setGeneratedId(teacherUserId);
    setGeneratedPassword(password);
    
    // Add the new teacher to the users list
    setUsers(prevUsers => [
        ...prevUsers,
        { id: `U${Date.now()}`, userId: teacherUserId, password: password, role: 'Teacher' }
    ]);
    
    toast({ title: "Credentials Generated!", description: `Login details created for ${teacher.name}.` });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Credentials copied to clipboard." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Generate Teacher Credentials</DialogTitle>
          <DialogDescription>
            Select a teacher to generate a new user ID and temporary password.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="teacher-select">Select Teacher</Label>
            <Select onValueChange={setSelectedTeacherId}>
              <SelectTrigger id="teacher-select">
                <SelectValue placeholder="Select a teacher..." />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} className="w-full" disabled={!selectedTeacherId}>
            Generate Credentials
          </Button>
          {generatedId && generatedPassword && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Generated Credentials</h3>
              <div className="space-y-2">
                <Label htmlFor="generated-id">Teacher User ID</Label>
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
