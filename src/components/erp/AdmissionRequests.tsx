"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/data-context";
import { AdmissionApplication, Student } from "@/lib/types";
import { Check, X } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const studentImages = PlaceHolderImages.filter(p => p.id.startsWith('student-avatar'));

export default function AdmissionRequests() {
    const { admissionApplications, setAdmissionApplications, setStudents } = useData();
    const { toast } = useToast();

    const pendingApplications = admissionApplications.filter(app => app.status === 'Pending');

    const handleRequest = (application: AdmissionApplication, newStatus: 'Approved' | 'Rejected') => {
        if (newStatus === 'Approved') {
            const newStudent: Student = {
                id: `S${Date.now()}`,
                name: application.studentName,
                class: application.applyingForGrade,
                section: 'A', // Default section
                rollNumber: String(Math.floor(Math.random() * 100) + 1), // Assign random roll number
                avatar: studentImages[Math.floor(Math.random() * studentImages.length)].imageUrl,
            };
            setStudents(prev => [...prev, newStudent]);
        }

        setAdmissionApplications(prev => 
            prev.filter(app => app.id !== application.id)
        );

        toast({
            title: `Application ${newStatus}`,
            description: `The application for ${application.studentName} has been ${newStatus.toLowerCase()}.`,
            variant: newStatus === 'Rejected' ? 'destructive' : 'default',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Pending Admission Requests</CardTitle>
                <CardDescription>Review and process new student applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Applying for Grade</TableHead>
                            <TableHead>Parent Name</TableHead>
                            <TableHead>Submission Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingApplications.length > 0 ? (
                            pendingApplications.map(app => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium">{app.studentName}</TableCell>
                                <TableCell>{app.applyingForGrade}</TableCell>
                                <TableCell>{app.parentName}</TableCell>
                                <TableCell>{app.date}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700" onClick={() => handleRequest(app, 'Approved')}>
                                        <Check className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleRequest(app, 'Rejected')}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">No pending applications.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
