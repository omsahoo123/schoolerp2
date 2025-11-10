
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { useData } from "@/lib/data-context";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useFirestore } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

type AttendanceLoggerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AttendanceState = Record<string, boolean>;

export default function AttendanceLogger({ open, onOpenChange }: AttendanceLoggerProps) {
  const { students: mockStudents } = useData();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const { toast } = useToast();
  const firestore = useFirestore();

  const classes = mockStudents ? [...new Set(mockStudents.map(s => s.class))] : [];
  const sections = mockStudents ? [...new Set(mockStudents.filter(s => s.class === selectedClass).map(s => s.section))] : [];

  useEffect(() => {
    setSelectedSection('');
    setStudents([]);
    setAttendance({});
  }, [selectedClass]);
  
  useEffect(() => {
    if (selectedClass && selectedSection && mockStudents) {
        const filteredStudents = mockStudents.filter(s => s.class === selectedClass && s.section === selectedSection);
        setStudents(filteredStudents);
        const initialAttendance = filteredStudents.reduce((acc, student) => {
          acc[student.id] = true; // Default to present
          return acc;
        }, {} as AttendanceState);
        setAttendance(initialAttendance);
    }
  }, [selectedClass, selectedSection, mockStudents]);


  const handleClassChange = (value: string) => {
    setSelectedClass(value);
  };

  const handleSectionChange = (value: string) => {
    setSelectedSection(value);
  };

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
  };

  const handleSubmit = async () => {
    if (!date || !firestore) {
        toast({
            title: "Error",
            description: "Please select a date.",
            variant: "destructive",
        });
        return;
    }
    const selectedDate = format(date, 'yyyy-MM-dd');
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const absentCount = students.length - presentCount;

    for (const student of students) {
        const isPresent = attendance[student.id];
        const attendanceDocRef = doc(firestore, "studentAttendance", student.id);
        const newRecord = { date: selectedDate, status: isPresent ? 'Present' : 'Absent' as const };

        const docSnap = await getDoc(attendanceDocRef);
        if (docSnap.exists()) {
            const existingRecords = docSnap.data().records || [];
            const recordIndex = existingRecords.findIndex((r: any) => r.date === selectedDate);
            if (recordIndex > -1) {
                existingRecords[recordIndex] = newRecord;
            } else {
                existingRecords.unshift(newRecord);
            }
            await updateDoc(attendanceDocRef, { records: existingRecords });
        } else {
            await setDoc(attendanceDocRef, { studentId: student.id, records: [newRecord] });
        }
    }

    toast({
      title: "Attendance Submitted",
      description: `For ${format(date, "PPP")}, Class ${selectedClass}-${selectedSection}: ${presentCount} present, ${absentCount} absent.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Log Attendance</DialogTitle>
          <DialogDescription>Select date, class and section to mark student attendance.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d > new Date()}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
          <Select onValueChange={handleClassChange} value={selectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={handleSectionChange} value={selectedSection} disabled={!selectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select Section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {students.length > 0 && (
          <ScrollArea className="h-72">
            <div className="space-y-4 pr-4">
              {students.map(student => (
                <div key={student.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Roll No: {student.rollNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`attendance-${student.id}`} className={cn("transition-colors", attendance[student.id] ? 'text-success' : 'text-destructive')}>
                      {attendance[student.id] ? 'Present' : 'Absent'}
                    </Label>
                    <Switch
                      id={`attendance-${student.id}`}
                      checked={attendance[student.id]}
                      onCheckedChange={(checked) => handleAttendanceChange(student.id, checked)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={students.length === 0}>Submit Attendance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
