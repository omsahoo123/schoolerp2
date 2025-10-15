
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  students as initialStudents,
  fees as initialFees,
  studentAttendance as initialStudentAttendance,
  hostelRooms as initialHostelRooms,
  homeworks as initialHomeworks,
  admissions as initialAdmissions,
  admissionApplications as initialAdmissionApplications,
  users as initialUsers,
  teachers as initialTeachers,
  hostelFees as initialHostelFees,
  jobApplications as initialJobApplications,
  notices as initialNotices
} from './data';
import { Student, Fee, StudentAttendance, HostelRoom, Homework, Admission, User, Teacher, AdmissionApplication, HostelFee, JobApplication, Notice } from './types';

// Helper function to get data from localStorage or use initial data
const getInitialState = <T>(key: string, initialData: T): T => {
  if (typeof window === "undefined") {
    return initialData;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialData;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return initialData;
  }
};


interface DataContextProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  fees: Fee[];
  setFees: React.Dispatch<React.SetStateAction<Fee[]>>;
  hostelFees: HostelFee[];
  setHostelFees: React.Dispatch<React.SetStateAction<HostelFee[]>>;
  studentAttendance: StudentAttendance[];
  setStudentAttendance: React.Dispatch<React.SetStateAction<StudentAttendance[]>>;
  hostelRooms: HostelRoom[];
  setHostelRooms: React.Dispatch<React.SetStateAction<HostelRoom[]>>;
  homeworks: Homework[];
  setHomeworks: React.Dispatch<React.SetStateAction<Homework[]>>;
  admissions: Admission[];
  setAdmissions: React.Dispatch<React.SetStateAction<Admission[]>>;
  admissionApplications: AdmissionApplication[];
  setAdmissionApplications: React.Dispatch<React.SetStateAction<AdmissionApplication[]>>;
  jobApplications: JobApplication[];
  setJobApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(() => getInitialState('students', initialStudents));
  const [teachers, setTeachers] = useState<Teacher[]>(() => getInitialState('teachers', initialTeachers));
  const [fees, setFees] = useState<Fee[]>(() => getInitialState('fees', initialFees));
  const [hostelFees, setHostelFees] = useState<HostelFee[]>(() => getInitialState('hostelFees', initialHostelFees));
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>(() => getInitialState('studentAttendance', initialStudentAttendance));
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>(() => getInitialState('hostelRooms', initialHostelRooms));
  const [homeworks, setHomeworks] = useState<Homework[]>(() => getInitialState('homeworks', initialHomeworks));
  const [admissions, setAdmissions] = useState<Admission[]>(() => getInitialState('admissions', initialAdmissions));
  const [admissionApplications, setAdmissionApplications] = useState<AdmissionApplication[]>(() => getInitialState('admissionApplications', initialAdmissionApplications));
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => getInitialState('jobApplications', initialJobApplications));
  const [users, setUsers] = useState<User[]>(() => getInitialState('users', initialUsers));
  const [notices, setNotices] = useState<Notice[]>(() => getInitialState('notices', initialNotices));

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem('students', JSON.stringify(students));
      window.localStorage.setItem('teachers', JSON.stringify(teachers));
      window.localStorage.setItem('fees', JSON.stringify(fees));
      window.localStorage.setItem('hostelFees', JSON.stringify(hostelFees));
      window.localStorage.setItem('studentAttendance', JSON.stringify(studentAttendance));
      window.localStorage.setItem('hostelRooms', JSON.stringify(hostelRooms));
      window.localStorage.setItem('homeworks', JSON.stringify(homeworks));
      window.localStorage.setItem('admissions', JSON.stringify(admissions));
      window.localStorage.setItem('admissionApplications', JSON.stringify(admissionApplications));
      window.localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
      window.localStorage.setItem('users', JSON.stringify(users));
      window.localStorage.setItem('notices', JSON.stringify(notices));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  }, [students, teachers, fees, hostelFees, studentAttendance, hostelRooms, homeworks, admissions, admissionApplications, jobApplications, users, notices]);


  return (
    <DataContext.Provider
      value={{
        students,
        setStudents,
        teachers,
        setTeachers,
        fees,
        setFees,
        hostelFees,
        setHostelFees,
        studentAttendance,
        setStudentAttendance,
        hostelRooms,
        setHostelRooms,
        homeworks,
        setHomeworks,
        admissions,
        setAdmissions,
        admissionApplications,
        setAdmissionApplications,
        jobApplications,
        setJobApplications,
        users,
        setUsers,
        notices,
        setNotices,
      }}
    >
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
