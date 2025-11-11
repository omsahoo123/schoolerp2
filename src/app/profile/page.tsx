
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/data-context";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import Header from "@/components/erp/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { students, teachers, users } = useData();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    const sId = sessionStorage.getItem("studentId");
    
    if (!role) {
      router.push("/login");
    } else {
      setUserRole(role);
      setStudentId(sId);
      setIsLoading(false);
    }
  }, [router]);

  const student = students?.find(s => s.id === studentId);

  useEffect(() => {
    if (student) {
        setAvatarUrl(student.avatar);
    }
  }, [student]);


  const handleAvatarUpdate = async () => {
    if (!firestore || !studentId || !avatarUrl) {
      toast({
        title: "Error",
        description: "Could not update avatar. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    const studentDocRef = doc(firestore, "students", studentId);
    try {
      await updateDoc(studentDocRef, { avatar: avatarUrl });
      toast({
        title: "Success!",
        description: "Your profile picture has been updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your picture.",
        variant: "destructive",
      });
    }
  };
  
  const renderProfileContent = () => {
    if (isLoading) {
      return <Skeleton className="h-96 w-full" />
    }
    
    switch (userRole) {
      case 'Student':
        if (!student) return <p>Loading student data...</p>;
        return (
          <Card>
            <CardHeader className="items-center text-center">
              <div className="relative w-32 h-32">
                <Avatar className="w-32 h-32 border-4 border-primary">
                  <AvatarImage src={avatarUrl} alt={student.name} />
                  <AvatarFallback className="text-4xl">{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="absolute bottom-1 right-1 rounded-full h-8 w-8 bg-background" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="font-headline mt-4">{student.name}</CardTitle>
              <CardDescription>Class {student.class}{student.section} | Roll No: {student.rollNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing && (
                <div className="space-y-4 animate-in fade-in-0 zoom-in-95">
                  <Label htmlFor="avatar-url">New Profile Picture URL</Label>
                  <div className="flex gap-2">
                    <Input id="avatar-url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/image.png"/>
                    <Button onClick={handleAvatarUpdate}>Save</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the URL of your new profile picture. You can use a service like Imgur to host your image.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      // Add cases for other roles if needed
      case 'Teacher':
      case 'Admin':
      case 'Finance':
         return (
            <Card>
                <CardHeader className="items-center text-center">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src="https://picsum.photos/seed/110/200/200" alt="User Avatar" />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline mt-4">{userRole} Profile</CardTitle>
                    <CardDescription>User ID: {sessionStorage.getItem('userRole')?.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">Profile editing for this role is not yet available.</p>
                </CardContent>
            </Card>
         );
      default:
        return <p>Invalid user role.</p>;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          {renderProfileContent()}
        </div>
      </main>
    </div>
  );
}
