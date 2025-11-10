
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCollection } from '@/firebase';
import { Student, Fee, StudentAttendance, HostelRoom, Homework, Admission, User, Teacher, AdmissionApplication, HostelFee, JobApplication, Notice } from './types';

// Define the shape of our context
interface DataContextProps {
  students: Student[];
  teachers: Teacher[];
  fees: Fee[];
  hostelFees: HostelFee[];
  studentAttendance: StudentAttendance[];
  hostelRooms: HostelRoom[];
  homeworks: Homework[];
  admissions: Admission[];
  admissionApplications: AdmissionApplication[];
  jobApplications: JobApplication[];
  users: User[];
  notices: Notice[];
  
  // We will remove setters as data will be managed by Firestore hooks directly in components
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

// This provider will now fetch data from Firestore
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { data: students = [] } = useCollection<Student>('students');
  const { data: teachers = [] } = useCollection<Teacher>('teachers');
  const { data: fees = [] } = useCollection<Fee>('fees');
  const { data: hostelFees = [] } = useCollection<HostelFee>('hostelFees');
  const { data: studentAttendance = [] } = useCollection<StudentAttendance>('studentAttendance');
  const { data: hostelRooms = [] } = useCollection<HostelRoom>('hostelRooms');
  const { data: homeworks = [] } = useCollection<Homework>('homeworks');
  const { data: admissions = [] } = useCollection<Admission>('admissions');
  const { data: admissionApplications = [] } = useCollection<AdmissionApplication>('admissionApplications');
  const { data: jobApplications = [] } = useCollection<JobApplication>('jobApplications');
  const { data: users = [] } = useCollection<User>('users');
  const { data: notices = [] } = useCollection<Notice>('notices');

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
