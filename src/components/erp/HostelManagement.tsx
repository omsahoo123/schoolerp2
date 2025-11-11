
"use client";

import { useState } from "react";
import { BedDouble, Edit, PlusCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/lib/data-context";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { HostelRoom } from "@/lib/types";

export default function HostelManagement() {
  const { hostelRooms } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<HostelRoom | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleAddNew = () => {
    setEditingRoom(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (room: HostelRoom) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDelete = async (roomId: string) => {
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

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;
    const formData = new FormData(event.currentTarget);
    const roomNumber = formData.get("roomNumber") as string;
    const capacity = parseInt(formData.get("capacity") as string, 10);

    if (!roomNumber || isNaN(capacity) || capacity <= 0) {
        toast({ title: "Invalid Input", description: "Please provide a valid room number and capacity.", variant: "destructive" });
        return;
    }

    if (editingRoom) {
      // Update existing room
      const roomDocRef = doc(firestore, "hostelRooms", editingRoom.id);
      await updateDoc(roomDocRef, { roomNumber, capacity });
      toast({ title: "Room Updated", description: `Room ${roomNumber} has been updated.` });
    } else {
      // Add new room
      await addDoc(collection(firestore, "hostelRooms"), { 
          roomNumber, 
          capacity, 
          occupants: [] 
      });
      toast({ title: "Room Added", description: `New room ${roomNumber} has been added.` });
    }

    setIsDialogOpen(false);
    setEditingRoom(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline flex items-center gap-2">
                    <BedDouble /> Hostel Management
                </CardTitle>
                <CardDescription>Add, edit, or remove hostel rooms.</CardDescription>
            </div>
            <Button onClick={handleAddNew} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Room
            </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border max-h-96 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Room No.</TableHead>
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
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)} className="text-destructive hover:text-destructive">
                            <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">No hostel rooms found. Add one to get started.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="font-headline">{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
              <DialogDescription>
                {editingRoom ? `Update the details for room ${editingRoom.roomNumber}.` : "Enter the details for the new hostel room."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Room</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
