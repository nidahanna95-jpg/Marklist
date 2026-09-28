export interface Subject {
  code: string;
  name: string;
  maxMarks: number;
  passMarks: number;
  credits: number;
}

export const SUBJECTS: Subject[] = [
  { code: 'ENG101', name: 'English', maxMarks: 100, passMarks: 40, credits: 4 },
  { code: 'MTH102', name: 'Mathematics', maxMarks: 100, passMarks: 40, credits: 4 },
  { code: 'SCI103', name: 'Science', maxMarks: 100, passMarks: 40, credits: 4 },
  { code: 'SOC104', name: 'Social Science', maxMarks: 100, passMarks: 40, credits: 4 },
  { code: 'CSC105', name: 'Computer Science', maxMarks: 100, passMarks: 40, credits: 4 },
];

export type SubjectName = 'English' | 'Mathematics' | 'Science' | 'Social Science' | 'Computer Science';

export interface StudentMarks {
  English: number;
  Mathematics: number;
  Science: number;
  'Social Science': number;
  'Computer Science': number;
  [key: string]: number;
}

export interface Student {
  id: string;
  rollNo: number;
  studentName: string;
  registerNumber: string;
  marks: StudentMarks;
  isPublished: boolean;
  remarks?: string;
  lastUpdated: string;
}

export type GradeType = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';

export interface StudentResultMetrics {
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  grade: GradeType;
  gradePoint: number;
  status: 'PASS' | 'FAIL';
  division: string;
  failedSubjects: string[];
  subjectGrades: {
    [subjectName: string]: {
      marks: number;
      grade: GradeType;
      gradePoint: number;
      status: 'PASS' | 'FAIL';
    };
  };
}

export interface UserSession {
  role: 'examiner' | 'student';
  examinerName?: string;
  student?: Student;
}
