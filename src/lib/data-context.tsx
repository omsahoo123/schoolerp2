"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  students as initialStudents,
  fees as initialFees,
  studentAttendance as initialStudentAttendance,
  hostelRooms as initialHostelRooms,
  homeworks as initialHomeworks,
  admissions as initialAdmissions,
} from './data';
import { Student, Fee, StudentAttendance, HostelRoom, Homework, Admission } from './types';

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
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [fees, setFees] = useState<Fee[]>(initialFees);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>(initialStudentAttendance);
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>(initialHostelRooms);
  const [homeworks, setHomeworks] = useState<Homework[]>(initialHomeworks);
  const [admissions, setAdmissions] = useState<Admission[]>(initialAdmissions);

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
