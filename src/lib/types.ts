export interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  avatar: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
}

export type FeeStatus = 'Paid' | 'Due' | 'Overdue';

export interface Fee {
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  status: FeeStatus;
  dueDate: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Holiday';

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
}

export interface StudentAttendance {
  studentId: string;
  records: AttendanceRecord[];
}

export interface HostelRoom {
  id: string;
  roomNumber: string;
  capacity: number;
  occupants: string[];
}

export interface Homework {
  id: string;
  class: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  assignedBy: string;
}

export interface Admission {
    month: string;
    admitted: number;
    capacity: number;
}

export interface User {
  id: string;
  userId: string;
  password: string; // In a real app, this would be a hash
  role: 'Admin' | 'Teacher' | 'Student' | 'Finance';
  studentId?: string; // Only for student users
}
