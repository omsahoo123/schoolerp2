import { Student, Fee, StudentAttendance, HostelRoom, Homework, Admission, User, Teacher, AdmissionApplication, HostelFee, JobApplication } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { subDays, format } from 'date-fns';

const studentImages = PlaceHolderImages.filter(p => p.id.startsWith('student-avatar'));

export const users: User[] = [
  { id: 'U001', userId: 'admin', password: 'password', role: 'Admin' },
  { id: 'U002', userId: 'teacher', password: 'password', role: 'Teacher' },
  { id: 'U003', userId: 'student', password: 'password', role: 'Student', studentId: 'S004' },
  { id: 'U004', userId: 'finance', password: 'password', role: 'Finance' },
];

export const teachers: Teacher[] = [
  { id: 'T001', name: 'Mr. John Doe', subject: 'Mathematics' },
  { id: 'T002', name: 'Ms. Jane Smith', subject: 'Physics' },
  { id: 'T003', name: 'Mr. Richard Roe', subject: 'Chemistry' },
];

export const students: Student[] = [
  { id: 'S001', name: 'Aarav Sharma', class: '10', section: 'A', rollNumber: '1', avatar: studentImages[0].imageUrl },
  { id: 'S002', name: 'Diya Patel', class: '10', section: 'A', rollNumber: '2', avatar: studentImages[1].imageUrl },
  { id: 'S003', name: 'Vivaan Singh', class: '10', section: 'B', rollNumber: '1', avatar: studentImages[2].imageUrl },
  { id: 'S004', name: 'Myra Kumar', class: '11', section: 'A', rollNumber: '1', avatar: studentImages[3].imageUrl },
  { id: 'S005', name: 'Advik Reddy', class: '11', section: 'A', rollNumber: '2', avatar: studentImages[4].imageUrl },
  { id: 'S006', name: 'Ishaan Gupta', class: '12', section: 'C', rollNumber: '3', avatar: studentImages[0].imageUrl },
  { id: 'S007', name: 'Anika Verma', class: '10', section: 'A', rollNumber: '3', avatar: studentImages[1].imageUrl },
];

export const fees: Fee[] = [
  { studentId: 'S001', studentName: 'Aarav Sharma', class: '10A', amount: 5000, status: 'Paid', dueDate: '2024-07-10' },
  { studentId: 'S002', studentName: 'Diya Patel', class: '10A', amount: 5000, status: 'Due', dueDate: '2024-07-10' },
  { studentId: 'S003', studentName: 'Vivaan Singh', class: '10B', amount: 5000, status: 'Overdue', dueDate: '2024-06-10' },
  { studentId: 'S004', studentName: 'Myra Kumar', class: '11A', amount: 6000, status: 'Paid', dueDate: '2024-07-10' },
  { studentId: 'S005', studentName: 'Advik Reddy', class: '11A', amount: 6000, status: 'Due', dueDate: '2024-07-10' },
  { studentId: 'S006', studentName: 'Ishaan Gupta', class: '12C', amount: 7000, status: 'Paid', dueDate: '2024-07-10' },
];

export const hostelFees: HostelFee[] = [
    { studentId: 'S001', studentName: 'Aarav Sharma', roomNumber: '101', amount: 2500, status: 'Paid', dueDate: '2024-07-10' },
    { studentId: 'S003', studentName: 'Vivaan Singh', roomNumber: '101', amount: 2500, status: 'Due', dueDate: '2024-07-10' },
    { studentId: 'S004', studentName: 'Myra Kumar', roomNumber: '201', amount: 3000, status: 'Overdue', dueDate: '2024-06-10' },
    { studentId: 'S005', studentName: 'Advik Reddy', roomNumber: '201', amount: 3000, status: 'Paid', dueDate: '2024-07-10' },
];

const today = new Date();
export const studentAttendance: StudentAttendance[] = [
  {
    studentId: 'S001', records: [
      { date: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'Present' },
      { date: format(subDays(today, 2), 'yyyy-MM-dd'), status: 'Present' },
      { date: format(subDays(today, 3), 'yyyy-MM-dd'), status: 'Absent' },
      { date: format(subDays(today, 4), 'yyyy-MM-dd'), status: 'Holiday' },
      { date: format(subDays(today, 5), 'yyyy-MM-dd'), status: 'Present' },
    ]
  },
  // Data for student S004 (Myra Kumar) to view in student dashboard
  {
    studentId: 'S004', records: [
      { date: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'Present' },
      { date: format(subDays(today, 2), 'yyyy-MM-dd'), status: 'Absent' },
      { date: format(subDays(today, 3), 'yyyy-MM-dd'), status: 'Present' },
      { date: format(subDays(today, 4), 'yyyy-MM-dd'), status: 'Holiday' },
      { date: format(subDays(today, 5), 'yyyy-MM-dd'), status: 'Present' },
      { date: format(subDays(today, 6), 'yyyy-MM-dd'), status: 'Present' },
      { date: format(subDays(today, 8), 'yyyy-MM-dd'), status: 'Present' },
      { date: format(subDays(today, 9), 'yyyy-MM-dd'), status: 'Absent' },
    ]
  }
];

export const hostelRooms: HostelRoom[] = [
  { id: 'H101', roomNumber: '101', capacity: 2, occupants: ['Aarav Sharma', 'Vivaan Singh'] },
  { id: 'H102', roomNumber: '102', capacity: 2, occupants: ['Diya Patel'] },
  { id: 'H103', roomNumber: '103', capacity: 2, occupants: [] },
  { id: 'H201', roomNumber: '201', capacity: 3, occupants: ['Myra Kumar', 'Advik Reddy', 'Ishaan Gupta'] },
  { id: 'H202', roomNumber: '202', capacity: 3, occupants: ['Anika Verma'] },
];

export const homeworks: Homework[] = [
  { id: 'HW01', class: '10', section: 'A', subject: 'Mathematics', title: 'Algebra Chapter 5', description: 'Complete exercises 5.1 and 5.2 from the textbook.', dueDate: '2024-07-15', assignedBy: 'Mr. John Doe' },
  { id: 'HW02', class: '10', section: 'A', subject: 'Physics', title: 'Laws of Motion', description: 'Write a summary of Newton\'s three laws of motion.', dueDate: '2024-07-16', assignedBy: 'Ms. Jane Smith' },
  { id: 'HW03', class: '11', section: 'A', subject: 'Chemistry', title: 'Organic Chemistry Basics', description: 'Read chapter 1 and answer the questions at the end.', dueDate: '2024-07-18', assignedBy: 'Mr. Richard Roe' },
];

export const admissions: Admission[] = [
    { month: 'January', admitted: 15, capacity: 20 },
    { month: 'February', admitted: 18, capacity: 20 },
    { month: 'March', admitted: 20, capacity: 25 },
    { month: 'April', admitted: 22, capacity: 25 },
    { month: 'May', admitted: 19, capacity: 25 },
    { month: 'June', admitted: 24, capacity: 30 },
];

export const admissionApplications: AdmissionApplication[] = [
    { id: 'APP001', studentName: 'Rohan Mehra', applyingForGrade: '8', parentName: 'Sunil Mehra', parentEmail: 'sunil.mehra@example.com', status: 'Pending', date: format(subDays(today, 1), 'yyyy-MM-dd'), gender: 'male'},
    { id: 'APP002', studentName: 'Priya Jain', applyingForGrade: '9', parentName: 'Anjali Jain', parentEmail: 'anjali.jain@example.com', status: 'Pending', date: format(subDays(today, 2), 'yyyy-MM-dd'), gender: 'female'},
];

export const jobApplications: JobApplication[] = [
    { id: 'JOB001', fullName: 'Sanjay Gupta', email: 'sanjay.g@example.com', phone: '9876543210', subject: 'Mathematics', experience: 5, status: 'Pending', date: format(subDays(today, 3), 'yyyy-MM-dd') },
    { id: 'JOB002', fullName: 'Meera Devi', email: 'meera.d@example.com', phone: '8765432109', subject: 'Physics', experience: 8, status: 'Pending', date: format(subDays(today, 1), 'yyyy-MM-dd') },
];
