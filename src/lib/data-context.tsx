"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  students as initialStudents,
  fees as initialFees,
  studentAttendance as initialStudentAttendance,
  hostelRooms as initialHostelRooms,
  homeworks as initialHomeworks,
  admissions as initialAdmissions,
  admissionApplications as initialAdmissionApplications,
  users as initialUsers,
  teachers as initialTeachers
} from './data';
import { Student, Fee, StudentAttendance, HostelRoom, Homework, Admission, User, Teacher, AdmissionApplication } from './types';

interface DataContextProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  fees: Fee[];
  setFees: React.Dispatch<React.SetStateAction<Fee[]>>;
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
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [fees, setFees] = useState<Fee[]>(initialFees);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>(initialStudentAttendance);
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>(initialHostelRooms);
  const [homeworks, setHomeworks] = useState<Homework[]>(initialHomeworks);
  const [admissions, setAdmissions] = useState<Admission[]>(initialAdmissions);
  const [admissionApplications, setAdmissionApplications] = useState<AdmissionApplication[]>(initialAdmissionApplications);
  const [users, setUsers] = useState<User[]>(initialUsers);

  return (
    <DataContext.Provider
      value={{
        students,
        setStudents,
        teachers,
        setTeachers,
        fees,
        setFees,
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
        users,
        setUsers,
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
