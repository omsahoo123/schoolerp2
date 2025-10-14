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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/data-context";
import { AdmissionApplication, Fee, Student } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { addDays, format } from "date-fns";

type HostelAllocationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: AdmissionApplication | null;
  onAllocationSuccess: () => void;
};

const studentImages = PlaceHolderImages.filter(p => p.id.startsWith('student-avatar'));

const hostelTypes = {
  'Boys': ['Boys Hostel A', 'Boys Hostel B'],
  'Girls': ['Girls Hostel A', 'Girls Hostel B']
};

export default function HostelAllocationDialog({ open, onOpenChange, application, onAllocationSuccess }: HostelAllocationDialogProps) {
  const { hostelRooms, setHostelRooms, setStudents, setAdmissionApplications, setFees } = useData();
  const { toast } = useToast();

  const [selectedHostelType, setSelectedHostelType] = useState<'Boys' | 'Girls' | ''>('');
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const [availableHostels, setAvailableHostels] = useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  

  useEffect(() => {
    if (application && application.gender) {
      const gender = application.gender.toLowerCase();
      if (gender === 'male') {
        setSelectedHostelType('Boys');
      } else if (gender === 'female') {
        setSelectedHostelType('Girls');
      } else {
        setSelectedHostelType('');
      }
    } else {
        setSelectedHostelType('');
    }
    // Reset other fields when application changes
    setSelectedHostel('');
    setSelectedRoom('');
  }, [application]);


  useEffect(() => {
    if (selectedHostelType) {
        const hostels = hostelTypes[selectedHostelType] || [];
        setAvailableHostels(hostels);
        setSelectedHostel('');
        setSelectedRoom('');
    } else {
        setAvailableHostels([]);
    }
  }, [selectedHostelType]);

  useEffect(() => {
    if (selectedHostel) {
      const rooms = hostelRooms
        .filter(room => room.occupants.length < room.capacity)
        .map(room => room.roomNumber);
      setAvailableRooms(rooms);
       setSelectedRoom('');
    } else {
        setAvailableRooms([]);
    }
  }, [selectedHostel, hostelRooms]);


  const handleAllocate = () => {
    if (!application || !selectedHostel || !selectedRoom) {
      toast({ title: "Error", description: "Please select all fields.", variant: "destructive" });
      return;
    }

    // 1. Create new student
    const newStudent: Student = {
        id: `S${Date.now()}`,
        name: application.studentName,
        class: application.applyingForGrade,
        section: 'A', // Default section
        rollNumber: String(Math.floor(Math.random() * 100) + 1),
        avatar: studentImages[Math.floor(Math.random() * studentImages.length)].imageUrl,
    };
    setStudents(prev => [...prev, newStudent]);

    // 2. Update hostel room
    setHostelRooms(prevRooms =>
      prevRooms.map(room =>
        room.roomNumber === selectedRoom
          ? { ...room, occupants: [...room.occupants, newStudent.name] }
          : room
      )
    );

    // 3. Create new fee record
    const newFee: Fee = {
        studentId: newStudent.id,
        studentName: newStudent.name,
        class: `${newStudent.class}${newStudent.section}`,
        amount: 5500, // Default fee amount
        status: 'Due',
        dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    };
    setFees(prev => [...prev, newFee]);

    // 4. Remove application from pending
    setAdmissionApplications(prev =>
      prev.filter(app => app.id !== application.id)
    );

    toast({
      title: "Student Approved!",
      description: `${application.studentName} has been admitted and allocated to Room ${selectedRoom}.`,
    });

    onAllocationSuccess();
    resetAndClose();
  };
  
  const resetAndClose = () => {
    onOpenChange(false);
    setSelectedHostelType('');
    setSelectedHostel('');
    setSelectedRoom('');
    setAvailableHostels([]);
    setAvailableRooms([]);
  }

  const gender = application?.gender?.toLowerCase();

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Hostel Allocation</DialogTitle>
          <DialogDescription>
            Allocate a hostel room for {application?.studentName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Hostel Type</Label>
            <RadioGroup value={selectedHostelType} onValueChange={(value) => setSelectedHostelType(value as 'Boys' | 'Girls')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Boys" id="boys" disabled={gender !== 'male'} />
                <Label htmlFor="boys">Boys Hostel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Girls" id="girls" disabled={gender !== 'female'} />
                <Label htmlFor="girls">Girls Hostel</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hostel-name">Hostel Name</Label>
            <Select 
                value={selectedHostel} 
                onValueChange={setSelectedHostel} 
                disabled={!selectedHostelType}
            >
              <SelectTrigger id="hostel-name">
                <SelectValue placeholder="Select hostel" />
              </SelectTrigger>
              <SelectContent>
                {availableHostels.map(hostel => (
                  <SelectItem key={hostel} value={hostel}>{hostel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-number">Room Number</Label>
            <Select 
                value={selectedRoom} 
                onValueChange={setSelectedRoom} 
                disabled={!selectedHostel || availableRooms.length === 0}
            >
              <SelectTrigger id="room-number">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map(room => (
                  <SelectItem key={room} value={room}>Room {room}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableRooms.length === 0 && selectedHostel && (
                <p className="text-xs text-destructive">No rooms available in this hostel.</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
          <Button onClick={handleAllocate} disabled={!selectedRoom}>Allocate & Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
