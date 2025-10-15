"use client";

import { useState } from "react";
import { Megaphone, PlusCircle } from "lucide-react";
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
import { Notice } from "@/lib/types";
import { format } from "date-fns";
import { useData } from "@/lib/data-context";
import { ScrollArea } from "../ui/scroll-area";

type NoticeBoardProps = {
  userRole: 'Admin' | 'Teacher' | 'Student' | 'Finance';
};

export default function NoticeBoard({ userRole }: NoticeBoardProps) {
  const { notices, setNotices } = useData();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const canPostNotice = userRole === 'Admin' || userRole === 'Teacher';

  const handleAddNotice = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newNotice: Notice = {
      id: `N${Date.now()}`,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      author: userRole, // Simplified author
      role: userRole as 'Admin' | 'Teacher',
      date: new Date().toISOString().split('T')[0],
    };
    setNotices(prev => [newNotice, ...prev]);
    setOpen(false);
    toast({
      title: "Notice Posted!",
      description: `The new notice "${newNotice.title}" has been published.`,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="font-headline flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Digital Notice Board
          </CardTitle>
          <CardDescription>
            Latest school-wide announcements and updates.
          </CardDescription>
        </div>
        {canPostNotice && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post Notice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline">Post a New Notice</DialogTitle>
                <DialogDescription>
                  This notice will be visible to all users on their dashboard.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddNotice} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required placeholder="e.g., School Holiday Announcement" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" required placeholder="Enter the full details of the notice here." className="min-h-[120px]" />
                </div>
                <DialogFooter>
                  <Button type="submit">Post Notice</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
            <div className="space-y-4">
            {notices.length > 0 ? notices.map((notice) => (
                <div key={notice.id} className="p-4 border rounded-lg bg-background">
                <div className="flex justify-between items-start">
                    <div>
                    <h4 className="font-semibold">{notice.title}</h4>
                    <p className="text-sm text-muted-foreground">
                        Posted on: {format(new Date(notice.date), "MMM dd, yyyy")}
                    </p>
                    </div>
                     <p className="text-xs font-medium">by {notice.author}</p>
                </div>
                <p className="text-sm mt-2">{notice.content}</p>
                </div>
            )) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No notices posted yet.</p>
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
