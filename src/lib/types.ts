
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
  id: string; // Document ID from Firestore
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  status: FeeStatus;
  dueDate: string;
}

export interface HostelFee {
  id: string; // Document ID from Firestore
  studentId: string;
  studentName: string;
  roomNumber: string;
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
  id: string; // Document ID from Firestore (same as studentId)
  studentId: string;
  records: AttendanceRecord[];
}

export interface Hostel {
  id: string;
  name: string;
  type: 'Boys' | 'Girls';
}

export interface HostelRoom {
  id: string;
  hostelId: string;
  hostelName: string;
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
    id: string; // Document ID from Firestore
    month: string;
    admitted: number;
    capacity: number;
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  applyingForGrade: string;
  parentName: string;
  parentEmail: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  gender: string;
}

export interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  experience: number;
  resume: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  date: string;
}


export interface User {
  id: string;
  userId: string;
  password: string; // In a real app, this would be a hash
  role: 'Admin' | 'Teacher' | 'Student' | 'Finance';
  studentId?: string; // Only for student users
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  role: 'Admin' | 'Teacher';
  date: string;
}
