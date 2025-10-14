
"use client";

import { useEffect, useState, useMemo } from "react";
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
import { AdmissionApplication, Fee, Student, HostelFee } from "@/lib/types";
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
  const { hostelRooms, setHostelRooms, setStudents, setFees, students: allStudents, setHostelFees } = useData();
  const { toast } = useToast();

  const [selectedHostelType, setSelectedHostelType] = useState<'Boys' | 'Girls' | ''>('');
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  // Effect to initialize hostel type based on application gender and reset on close/application change
  useEffect(() => {
    if (open && application) {
      if (application.gender?.toLowerCase() === 'male') {
        setSelectedHostelType('Boys');
      } else if (application.gender?.toLowerCase() === 'female') {
        setSelectedHostelType('Girls');
      } else {
        setSelectedHostelType('');
      }
      // Reset selections when dialog opens for a new application
      setSelectedHostel('');
      setSelectedRoom('');
    }
  }, [application, open]);
  
  const handleHostelTypeChange = (value: 'Boys' | 'Girls' | '') => {
    setSelectedHostelType(value);
    setSelectedHostel('');
    setSelectedRoom('');
  }

  const availableHostels = useMemo(() => {
    if (!selectedHostelType) return [];
    return hostelTypes[selectedHostelType] || [];
  }, [selectedHostelType]);
  
  const availableRooms = useMemo(() => {
    if (!selectedHostel) return [];
    // This is a simplified logic. In a real app, you'd filter rooms by hostel name as well.
    return hostelRooms
      .filter(room => room.occupants.length < room.capacity)
      .map(room => room.roomNumber);
  }, [selectedHostel, hostelRooms]);

  const handleAllocate = () => {
    if (!application || !selectedHostel || !selectedRoom) {
      toast({ title: "Error", description: "Please select all fields.", variant: "destructive" });
      return;
    }

    let studentId = '';
    const existingStudent = allStudents.find(s => s.name === application.studentName);

    if (!existingStudent) {
        const newStudent: Student = {
            id: `S${Date.now()}`,
            name: application.studentName,
            class: application.applyingForGrade,
            section: 'A', // Default section
            rollNumber: String(Math.floor(Math.random() * 100) + 1),
            avatar: studentImages[Math.floor(Math.random() * studentImages.length)].imageUrl,
        };
        setStudents(prev => [...prev, newStudent]);
        studentId = newStudent.id;

        const newFee: Fee = {
            studentId: newStudent.id,
            studentName: newStudent.name,
            class: `${newStudent.class}${newStudent.section}`,
            amount: 5500,
            status: 'Due',
            dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        };
        setFees(prev => [...prev, newFee]);
    } else {
        studentId = existingStudent.id;
    }

    setHostelRooms(prevRooms =>
      prevRooms.map(room =>
        room.roomNumber === selectedRoom
          ? { ...room, occupants: [...room.occupants, application.studentName] }
          : room
      )
    );

    // Create a new hostel fee record
    const newHostelFee: HostelFee = {
        studentId: studentId,
        studentName: application.studentName,
        roomNumber: selectedRoom,
        amount: 2500, // Default hostel fee amount
        status: 'Due',
        dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    };
    setHostelFees(prev => [...prev, newHostelFee]);

    toast({
      title: "Hostel Allocated!",
      description: `${application.studentName} has been allocated to Room ${selectedRoom}.`,
    });

    onAllocationSuccess();
    onOpenChange(false);
  };
  
  const resetAndClose = () => {
    onOpenChange(false);
  }

  const applicantGender = application?.gender?.toLowerCase();

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
            <RadioGroup value={selectedHostelType} onValueChange={(value) => handleHostelTypeChange(value as 'Boys' | 'Girls')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Boys" id="boys" disabled={applicantGender !== 'male'} />
                <Label htmlFor="boys">Boys Hostel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Girls" id="girls" disabled={applicantGender !== 'female'} />
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
          <Button onClick={handleAllocate} disabled={!selectedRoom}>Allocate Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
