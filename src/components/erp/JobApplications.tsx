"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/data-context";
import { JobApplication, Teacher } from "@/lib/types";
import { Check, Eye, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export default function JobApplications() {
    const { jobApplications, setJobApplications, setTeachers } = useData();
    const { toast } = useToast();
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    const handleAccept = (application: JobApplication) => {
        // Create new teacher
        const newTeacher: Teacher = {
            id: `T${Date.now()}`,
            name: application.fullName,
            subject: application.subject,
        };
        setTeachers(prev => [...prev, newTeacher]);
        
        setJobApplications(prev => 
            prev.map(app => app.id === application.id ? {...app, status: 'Accepted'} : app)
        );

        toast({
            title: `Application Accepted`,
            description: `${application.fullName} has been added as a new teacher.`,
        });
    };

    const handleReject = (application: JobApplication) => {
         setJobApplications(prev => 
            prev.map(app => app.id === application.id ? {...app, status: 'Rejected'} : app)
        );

        toast({
            title: `Application Rejected`,
            description: `The application from ${application.fullName} has been rejected.`,
            variant: 'destructive',
        });
    }

    const handleViewResume = (application: JobApplication) => {
        setSelectedApplication(application);
        setIsResumeOpen(true);
    }

    const displayedApplications = jobApplications.filter(app => app.status === 'Pending');

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Pending Job Applications</CardTitle>
                <CardDescription>Review and process new teacher applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Resume/Profile</TableHead>
                             <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobApplications.length > 0 ? (
                            jobApplications.map(app => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium">{app.fullName}</TableCell>
                                <TableCell className="capitalize">{app.subject}</TableCell>
                                <TableCell>{app.experience} years</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => handleViewResume(app)}>
                                        <Eye className="mr-2 h-4 w-4" /> View
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={app.status === 'Pending' ? 'warning' : app.status === 'Accepted' ? 'success' : 'destructive'}>
                                        {app.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {app.status === 'Pending' && (
                                        <>
                                        <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700" onClick={() => handleAccept(app)}>
                                            <Check className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleReject(app)}>
                                            <X className="h-5 w-5" />
                                        </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">No pending job applications.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
         <Dialog open={isResumeOpen} onOpenChange={setIsResumeOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Resume: {selectedApplication?.fullName}</DialogTitle>
                        <DialogDescription>
                            Subject: {selectedApplication?.subject} | Experience: {selectedApplication?.experience} years
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-96 w-full rounded-md border p-4 my-4">
                        <pre className="whitespace-pre-wrap text-sm">{selectedApplication?.resume}</pre>
                    </ScrollArea>
                    <DialogFooter>
                        <Button onClick={() => setIsResumeOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
