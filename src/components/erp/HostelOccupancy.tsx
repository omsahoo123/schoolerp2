"use client";

import { BedDouble, UserCheck, UserX } from "lucide-react";
import KpiCard from "./KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/lib/data-context";

export default function HostelOccupancy() {
  const { hostelRooms } = useData();
  const totalCapacity = hostelRooms.reduce((acc, room) => acc + room.capacity, 0);
  const totalOccupants = hostelRooms.reduce((acc, room) => acc + room.occupants.length, 0);
  const availableSlots = totalCapacity - totalOccupants;
  const occupancyRate = totalCapacity > 0 ? (totalOccupants / totalCapacity) * 100 : 0;

  return (
    <Card className="h-full col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BedDouble className="h-6 w-6" />
          Hostel Occupancy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Occupancy Rate"
            icon={<BedDouble className="h-5 w-5" />}
            value={`${occupancyRate.toFixed(1)}%`}
            description={`${totalOccupants} / ${totalCapacity} Beds Filled`}
          />
          <KpiCard
            title="Total Occupants"
            icon={<UserCheck className="h-5 w-5" />}
            value={totalOccupants.toString()}
            description="Students currently in hostel"
          />
          <KpiCard
            title="Available Slots"
            icon={<UserX className="h-5 w-5" />}
            value={availableSlots.toString()}
            description="Beds available for new students"
          />
          <KpiCard
            title="Total Rooms"
            icon={<BedDouble className="h-5 w-5" />}
            value={hostelRooms.length.toString()}
            description="Across all hostel blocks"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Room Status</h3>
          <div className="rounded-md border max-h-60 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Room No.</TableHead>
                  <TableHead>Occupants</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostelRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.roomNumber}</TableCell>
                    <TableCell>{room.occupants.length} / {room.capacity}</TableCell>
                    <TableCell className="text-right">
                      {room.occupants.length === room.capacity ? (
                        <Badge variant="destructive">Full</Badge>
                      ) : room.occupants.length > 0 ? (
                        <Badge variant="warning">Partially Full</Badge>
                      ) : (
                        <Badge variant="success">Empty</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
