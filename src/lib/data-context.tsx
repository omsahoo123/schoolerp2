
"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useCollection } from '@/firebase';
import { collection, addDoc, getDocs, query, where, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Student, Fee, StudentAttendance, HostelRoom, Homework, Admission, User, Teacher, AdmissionApplication, HostelFee, JobApplication, Notice } from './types';

// Define the shape of our context
interface DataContextProps {
  students: Student[] | null;
  teachers: Teacher[] | null;
  fees: Fee[] | null;
  hostelFees: HostelFee[] | null;
  studentAttendance: StudentAttendance[] | null;
  hostelRooms: HostelRoom[] | null;
  homeworks: Homework[] | null;
  admissions: Admission[] | null;
  admissionApplications: AdmissionApplication[] | null;
  jobApplications: JobApplication[] | null;
  users: User[] | null;
  notices: Notice[] | null;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

// Function to seed initial admin user
const seedAdminUser = async (firestore: Firestore) => {
    const usersCollection = collection(firestore, 'users');
    const adminQuery = query(usersCollection, where("role", "==", "Admin"));
    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
        console.log("No admin user found, creating one...");
        await addDoc(usersCollection, {
            userId: 'admin',
            password: 'password', // In a real app, this should be handled securely
            role: 'Admin',
        });
    } else {
        console.log("Admin user already exists.");
    }
};

// This provider will now fetch data from Firestore
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const firestore = useFirestore();
  const { data: students } = useCollection<Student>('students');
  const { data: teachers } = useCollection<Teacher>('teachers');
  const { data: fees } = useCollection<Fee>('fees');
  const { data: hostelFees } = useCollection<HostelFee>('hostelFees');
  const { data: studentAttendance } = useCollection<StudentAttendance>('studentAttendance');
  const { data: hostelRooms } = useCollection<HostelRoom>('hostelRooms');
  const { data: homeworks } = useCollection<Homework>('homeworks');
  const { data: admissions } = useCollection<Admission>('admissions');
  const { data: admissionApplications } = useCollection<AdmissionApplication>('admissionApplications');
  const { data: jobApplications } = useCollection<JobApplication>('jobApplications');
  const { data: users } = useCollection<User>('users');
  const { data: notices } = useCollection<Notice>('notices');

  useEffect(() => {
    if (firestore) {
      seedAdminUser(firestore);
    }
  }, [firestore]);

  const value = {
    students,
    teachers,
    fees,
    hostelFees,
    studentAttendance,
    hostelRooms,
    homeworks,
    admissions,
    admissionApplications,
    jobApplications,
    users,
    notices,
  };

  return (
    <DataContext.Provider value={value as DataContextProps}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
