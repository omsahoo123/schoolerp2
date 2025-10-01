"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  students as initialStudents,
  fees as initialFees,
  studentAttendance as initialStudentAttendance,
  hostelRooms as initialHostelRooms,
  homeworks as initialHomeworks,
  admissions as initialAdmissions,
  users as initialUsers
} from './data';
import { Student, Fee, StudentAttendance, HostelRoom, Homework, Admission, User } from './types';

interface DataContextProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
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
  users: User[];
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [fees, setFees] = useState<Fee[]>(initialFees);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>(initialStudentAttendance);
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>(initialHostelRooms);
  const [homeworks, setHomeworks] = useState<Homework[]>(initialHomeworks);
  const [admissions, setAdmissions] = useState<Admission[]>(initialAdmissions);
  const [users, setUsers] = useState<User[]>(initialUsers);

  return (
    <DataContext.Provider
      value={{
        students,
        setStudents,
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
        users,
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
