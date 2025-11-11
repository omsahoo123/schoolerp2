
"use client";

import { useState } from "react";
import { BedDouble, Edit, PlusCircle, Trash, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/lib/data-context";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { AdmissionApplication, Hostel, HostelRoom } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import HostelAllocationDialog from "./HostelAllocationDialog";

export default function HostelManagement() {
  const { hostels, hostelRooms, students } = useData();
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isHostelDialogOpen, setIsHostelDialogOpen] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  
  const [editingRoom, setEditingRoom] = useState<HostelRoom | null>(null);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);

  const { toast } = useToast();
  const firestore = useFirestore();

  const handleAddNewRoom = () => {
    setEditingRoom(null);
    setIsRoomDialogOpen(true);
  };

  const handleEditRoom = (room: HostelRoom) => {
    setEditingRoom(room);
    setIsRoomDialogOpen(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!firestore) return;
    if (confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
        await deleteDoc(doc(firestore, "hostelRooms", roomId));
        toast({
            title: "Room Deleted",
            description: `The room has been successfully deleted.`,
            variant: "destructive"
        });
    }
  };

  const handleSaveRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;
    const formData = new FormData(event.currentTarget);
    const roomNumber = formData.get("roomNumber") as string;
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const hostelId = formData.get("hostelId") as string;

    if (!roomNumber || isNaN(capacity) || capacity <= 0 || !hostelId) {
        toast({ title: "Invalid Input", description: "Please provide a valid room number, capacity and select a hostel.", variant: "destructive" });
        return;
    }

    const selectedHostel = hostels?.find(h => h.id === hostelId);
    if (!selectedHostel) {
        toast({ title: "Hostel not found", variant: "destructive" });
        return;
    }

    const roomData = {
        roomNumber,
        capacity,
        hostelId,
        hostelName: selectedHostel.name,
    };

    if (editingRoom) {
      // Update existing room
      const roomDocRef = doc(firestore, "hostelRooms", editingRoom.id);
      await updateDoc(roomDocRef, roomData);
      toast({ title: "Room Updated", description: `Room ${roomNumber} has been updated.` });
    } else {
      // Add new room
      await addDoc(collection(firestore, "hostelRooms"), { 
          ...roomData,
          occupants: [] 
      });
      toast({ title: "Room Added", description: `New room ${roomNumber} has been added to ${selectedHostel.name}.` });
    }

    setIsRoomDialogOpen(false);
    setEditingRoom(null);
  };

  const handleAddNewHostel = () => {
    setEditingHostel(null);
    setIsHostelDialogOpen(true);
  };

  const handleEditHostel = (hostel: Hostel) => {
    setEditingHostel(hostel);
    setIsHostelDialogOpen(true);
  };

  const handleDeleteHostel = async (hostel: Hostel) => {
    if (!firestore) return;
    if (confirm(`Are you sure you want to delete ${hostel.name}? This will also delete all rooms associated with it.`)) {
        const batch = writeBatch(firestore);
        
        // Delete the hostel
        const hostelDocRef = doc(firestore, "hostels", hostel.id);
        batch.delete(hostelDocRef);

        // Delete all rooms in that hostel
        const roomsToDelete = hostelRooms?.filter(room => room.hostelId === hostel.id) || [];
        roomsToDelete.forEach(room => {
            const roomDocRef = doc(firestore, "hostelRooms", room.id);
            batch.delete(roomDocRef);
        });

        await batch.commit();

        toast({
            title: "Hostel Deleted",
            description: `${hostel.name} and all its rooms have been deleted.`,
            variant: "destructive"
        });
    }
  };

  const handleSaveHostel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;
    const formData = new FormData(event.currentTarget);
    const name = formData.get("hostelName") as string;
    const type = formData.get("hostelType") as 'Boys' | 'Girls';

    if (!name || !type) {
        toast({ title: "Invalid Input", description: "Please provide a valid name and type.", variant: "destructive" });
        return;
    }

    if (editingHostel) {
      const hostelDocRef = doc(firestore, "hostels", editingHostel.id);
      await updateDoc(hostelDocRef, { name, type });

      // Also update hostelName in all associated rooms
      if (editingHostel.name !== name) {
          const batch = writeBatch(firestore);
          const roomsToUpdate = hostelRooms?.filter(room => room.hostelId === editingHostel.id) || [];
          roomsToUpdate.forEach(room => {
              const roomDocRef = doc(firestore, "hostelRooms", room.id);
              batch.update(roomDocRef, { hostelName: name });
          });
          await batch.commit();
      }

      toast({ title: "Hostel Updated", description: `${name} has been updated.` });
    } else {
      await addDoc(collection(firestore, "hostels"), { name, type });
      toast({ title: "Hostel Added", description: `New hostel "${name}" has been created.` });
    }
    setIsHostelDialogOpen(false);
    setEditingHostel(null);
  };
  
  const occupants = hostelRooms?.flatMap(room => room.occupants.map(name => ({
      studentName: name,
      roomNumber: room.roomNumber,
      hostelName: room.hostelName
  }))) || [];

  const handleEditOccupant = (occupant: {studentName: string}) => {
    const student = students?.find(s => s.name === occupant.studentName);
    if (student) {
        // Create a fake application object to pass to the dialog
        const application: AdmissionApplication = {
            id: student.id,
            studentName: student.name,
            gender: 'N/A', // Gender may not be available on student, can be improved
            applyingForGrade: student.class,
            parentName: 'N/A',
            parentEmail: 'N/A',
            status: 'Approved',
            date: new Date().toISOString()
        }
        setSelectedApplication(application);
        setIsAllocationDialogOpen(true);
    } else {
        toast({title: "Error", description: "Could not find student details to edit.", variant: "destructive"});
    }
  };

  const handleDeleteOccupant = async (occupant: { studentName: string; roomNumber: string; hostelName: string }) => {
    if (!firestore || !hostelRooms) return;
    if (confirm(`Are you sure you want to remove ${occupant.studentName} from this room?`)) {
        const room = hostelRooms.find(r => r.roomNumber === occupant.roomNumber && r.hostelName === occupant.hostelName);
        if (room) {
            const roomDocRef = doc(firestore, "hostelRooms", room.id);
            const updatedOccupants = room.occupants.filter(name => name !== occupant.studentName);
            await updateDoc(roomDocRef, { occupants: updatedOccupants });
            toast({
                title: "Occupant Removed",
                description: `${occupant.studentName} has been removed from room ${occupant.roomNumber}.`
            });
        }
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <BedDouble /> Hostel Management
            </CardTitle>
            <CardDescription>Manage hostels, rooms, and view occupants.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rooms">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="hostels">Hostels</TabsTrigger>
                <TabsTrigger value="occupants">Occupants</TabsTrigger>
            </TabsList>

            <TabsContent value="rooms" className="mt-4">
              <div className="flex justify-end mb-4">
                 <Button onClick={handleAddNewRoom} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Room
                </Button>
              </div>
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Room No.</TableHead>
                      <TableHead>Hostel</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Occupants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hostelRooms && hostelRooms.length > 0 ? (
                      hostelRooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.roomNumber}</TableCell>
                          <TableCell>{room.hostelName}</TableCell>
                          <TableCell>{room.capacity}</TableCell>
                          <TableCell>{room.occupants.length}</TableCell>
                          <TableCell>
                            {room.occupants.length === room.capacity ? (
                              <Badge variant="destructive">Full</Badge>
                            ) : room.occupants.length > 0 ? (
                              <Badge variant="warning">Partially Full</Badge>
                            ) : (
                              <Badge variant="success">Empty</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)} className="text-destructive hover:text-destructive">
                                <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">No hostel rooms found. Add one to get started.</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="hostels" className="mt-4">
                <div className="flex justify-end mb-4">
                    <Button onClick={handleAddNewHostel} size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Hostel
                    </Button>
                </div>
                <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hostel Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hostels && hostels.length > 0 ? (
                                hostels.map(hostel => (
                                    <TableRow key={hostel.id}>
                                        <TableCell className="font-medium">{hostel.name}</TableCell>
                                        <TableCell>{hostel.type}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditHostel(hostel)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteHostel(hostel)} className="text-destructive hover:text-destructive">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">No hostels found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </TabsContent>

            <TabsContent value="occupants" className="mt-4">
                 <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Hostel</TableHead>
                                <TableHead>Room No.</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {occupants.length > 0 ? (
                                occupants.map((occ, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{occ.studentName}</TableCell>
                                        <TableCell>{occ.hostelName}</TableCell>
                                        <TableCell>{occ.roomNumber}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditOccupant(occ)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteOccupant(occ)} className="text-destructive hover:text-destructive">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No students are currently in the hostel.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSaveRoom}>
            <DialogHeader>
              <DialogTitle className="font-headline">{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
              <DialogDescription>
                {editingRoom ? `Update the details for room ${editingRoom.roomNumber}.` : "Enter the details for the new hostel room."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="hostelId">Hostel</Label>
                <Select name="hostelId" defaultValue={editingRoom?.hostelId} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a hostel" />
                    </SelectTrigger>
                    <SelectContent>
                        {hostels?.map(hostel => (
                            <SelectItem key={hostel.id} value={hostel.id}>{hostel.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input id="roomNumber" name="roomNumber" defaultValue={editingRoom?.roomNumber || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" defaultValue={editingRoom?.capacity || ""} required min="1" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRoomDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Room</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isHostelDialogOpen} onOpenChange={setIsHostelDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSaveHostel}>
            <DialogHeader>
              <DialogTitle className="font-headline">{editingHostel ? "Edit Hostel" : "Add New Hostel"}</DialogTitle>
              <DialogDescription>
                {editingHostel ? `Update details for ${editingHostel.name}.` : "Create a new hostel building."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="hostelName">Hostel Name</Label>
                <Input id="hostelName" name="hostelName" defaultValue={editingHostel?.name || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hostelType">Hostel Type</Label>
                <Select name="hostelType" defaultValue={editingHostel?.type} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Boys">Boys</SelectItem>
                        <SelectItem value="Girls">Girls</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsHostelDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Hostel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <HostelAllocationDialog
        open={isAllocationDialogOpen}
        onOpenChange={setIsAllocationDialogOpen}
        application={selectedApplication}
        onAllocationSuccess={() => {}}
      />
    </>
  );
}

    