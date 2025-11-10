
"use client";

import { useState } from "react";
import { BookOpen, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Homework as HomeworkType } from "@/lib/types";
import { format } from "date-fns";
import { useData } from "@/lib/data-context";
import { useFirestore } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

type HomeworkProps = {
  isTeacher?: boolean;
  studentClass?: string;
  studentSection?: string;
};

export default function Homework({ isTeacher = false, studentClass, studentSection }: HomeworkProps) {
  const { homeworks } = useData();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const filteredHomeworks = isTeacher
    ? homeworks
    : homeworks?.filter(hw => hw.class === studentClass && hw.section === studentSection);

  const handleAddHomework = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;

    const formData = new FormData(event.currentTarget);
    const newHomework = {
      class: formData.get("class") as string,
      section: formData.get("section") as string,
      subject: formData.get("subject") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      dueDate: formData.get("dueDate") as string,
      assignedBy: "Me", // This could be replaced with the actual teacher's name
    };
    await addDoc(collection(firestore, "homeworks"), newHomework);

    setOpen(false);
    toast({
      title: "Homework Assigned!",
      description: `New homework for Class ${newHomework.class}-${newHomework.section} has been added.`,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="font-headline flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Homework
          </CardTitle>
          <CardDescription>
            {isTeacher ? "Manage and assign homework" : "Your assigned homework"}
          </CardDescription>
        </div>
        {isTeacher && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Assign New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline">Assign New Homework</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new assignment.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddHomework} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Input id="class" name="class" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Input id="section" name="section" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" name="dueDate" type="date" required />
                </div>
                <DialogFooter>
                  <Button type="submit">Assign Homework</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-auto">
          {(filteredHomeworks || []).length > 0 ? filteredHomeworks?.map((hw) => (
            <div key={hw.id} className="p-4 border rounded-lg bg-background">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{hw.title} - <span className="font-normal text-muted-foreground">{hw.subject}</span></h4>
                  <p className="text-sm text-muted-foreground">
                    Due: {format(new Date(hw.dueDate), "MMM dd, yyyy")}
                  </p>
                </div>
                {isTeacher && <p className="text-xs font-medium">Class {hw.class}-{hw.section}</p>}
              </div>
              <p className="text-sm mt-2">{hw.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Assigned by: {hw.assignedBy}</p>
            </div>
          )) : (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No homework assigned.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
