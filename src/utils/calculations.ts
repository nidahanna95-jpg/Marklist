import { SUBJECTS, Student, StudentMarks, StudentResultMetrics, GradeType } from '../types';

export function getGradeFromMarks(marks: number): { grade: GradeType; gradePoint: number; status: 'PASS' | 'FAIL' } {
  if (marks >= 90) return { grade: 'A+', gradePoint: 10, status: 'PASS' };
  if (marks >= 80) return { grade: 'A', gradePoint: 9, status: 'PASS' };
  if (marks >= 70) return { grade: 'B+', gradePoint: 8, status: 'PASS' };
  if (marks >= 60) return { grade: 'B', gradePoint: 7, status: 'PASS' };
  if (marks >= 50) return { grade: 'C', gradePoint: 6, status: 'PASS' };
  if (marks >= 40) return { grade: 'D', gradePoint: 5, status: 'PASS' };
  return { grade: 'F', gradePoint: 0, status: 'FAIL' };
}

export function calculateStudentMetrics(marks: StudentMarks): StudentResultMetrics {
  let totalMarks = 0;
  const maxTotalMarks = SUBJECTS.length * 100;
  const failedSubjects: string[] = [];
  const subjectGrades: StudentResultMetrics['subjectGrades'] = {};

  SUBJECTS.forEach((subject) => {
    const mark = Math.max(0, Math.min(100, Number(marks[subject.name] ?? 0)));
    totalMarks += mark;
    const gradeInfo = getGradeFromMarks(mark);

    if (mark < subject.passMarks) {
      failedSubjects.push(subject.name);
    }

    subjectGrades[subject.name] = {
      marks: mark,
      grade: gradeInfo.grade,
      gradePoint: gradeInfo.gradePoint,
      status: mark >= subject.passMarks ? 'PASS' : 'FAIL',
    };
  });

  const percentage = Number(((totalMarks / maxTotalMarks) * 100).toFixed(2));
  const overallGradeInfo = getGradeFromMarks(percentage);

  const status: 'PASS' | 'FAIL' = failedSubjects.length === 0 ? 'PASS' : 'FAIL';

  let division = 'Fail / Reappear';
  if (status === 'PASS') {
    if (percentage >= 75) {
      division = 'First Division with Distinction';
    } else if (percentage >= 60) {
      division = 'First Division';
    } else if (percentage >= 50) {
      division = 'Second Division';
    } else {
      division = 'Third Division';
    }
  }

  return {
    totalMarks,
    maxTotalMarks,
    percentage,
    grade: status === 'PASS' ? overallGradeInfo.grade : 'F',
    gradePoint: overallGradeInfo.gradePoint,
    status,
    division,
    failedSubjects,
    subjectGrades,
  };
}

export interface ClassStatistics {
  totalStudents: number;
  passedStudents: number;
  failedStudents: number;
  passPercentage: number;
  averagePercentage: number;
  highestPercentage: number;
  topperStudent?: { name: string; registerNumber: string; percentage: number; total: number };
  subjectAverages: { [key: string]: number };
  subjectHighest: { [key: string]: { name: string; mark: number } };
  gradeDistribution: { [key in GradeType]: number };
}

export function calculateClassStatistics(students: Student[]): ClassStatistics {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      passedStudents: 0,
      failedStudents: 0,
      passPercentage: 0,
      averagePercentage: 0,
      highestPercentage: 0,
      subjectAverages: {},
      subjectHighest: {},
      gradeDistribution: { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 },
    };
  }

  let totalPercentageSum = 0;
  let passedCount = 0;
  let highestPercentage = -1;
  let topper: { name: string; registerNumber: string; percentage: number; total: number } | undefined;

  const subjectTotals: { [key: string]: number } = {};
  const subjectHighest: { [key: string]: { name: string; mark: number } } = {};
  const gradeDistribution: { [key in GradeType]: number } = {
    'A+': 0,
    'A': 0,
    'B+': 0,
    'B': 0,
    'C': 0,
    'D': 0,
    'F': 0,
  };

  SUBJECTS.forEach((s) => {
    subjectTotals[s.name] = 0;
    subjectHighest[s.name] = { name: '', mark: -1 };
  });

  students.forEach((student) => {
    const metrics = calculateStudentMetrics(student.marks);
    totalPercentageSum += metrics.percentage;

    if (metrics.status === 'PASS') {
      passedCount++;
      gradeDistribution[metrics.grade]++;
    } else {
      gradeDistribution['F']++;
    }

    if (metrics.percentage > highestPercentage) {
      highestPercentage = metrics.percentage;
      topper = {
        name: student.studentName,
        registerNumber: student.registerNumber,
        percentage: metrics.percentage,
        total: metrics.totalMarks,
      };
    }

    SUBJECTS.forEach((s) => {
      const mark = Number(student.marks[s.name] ?? 0);
      subjectTotals[s.name] += mark;
      if (mark > subjectHighest[s.name].mark) {
        subjectHighest[s.name] = { name: student.studentName, mark };
      }
    });
  });

  const subjectAverages: { [key: string]: number } = {};
  SUBJECTS.forEach((s) => {
    subjectAverages[s.name] = Number((subjectTotals[s.name] / students.length).toFixed(1));
  });

  return {
    totalStudents: students.length,
    passedStudents: passedCount,
    failedStudents: students.length - passedCount,
    passPercentage: Number(((passedCount / students.length) * 100).toFixed(1)),
    averagePercentage: Number((totalPercentageSum / students.length).toFixed(1)),
    highestPercentage: Math.max(0, highestPercentage),
    topperStudent: topper,
    subjectAverages,
    subjectHighest,
    gradeDistribution,
  };
}
