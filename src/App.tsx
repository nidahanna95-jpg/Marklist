import React, { useState, useEffect } from 'react';
import { Student, StudentMarks, UserSession } from './types';
import { INITIAL_STUDENTS } from './data/initialData';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { ExaminerDashboard } from './components/ExaminerDashboard';
import { StudentResultCard } from './components/StudentResultCard';
import { EditMarksModal } from './components/EditMarksModal';
import { AddStudentModal } from './components/AddStudentModal';

const STORAGE_KEY = 'abcu_delhi_student_results_v1';
const SESSION_KEY = 'abcu_delhi_user_session_v1';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS;
  });

  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        return JSON.parse(savedSession);
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Modals & previews
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewingStudent, setPreviewingStudent] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  // Sync session to localStorage
  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore
    }
  }, [session]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
    setPreviewingStudent(null);
    if (newSession.role === 'examiner') {
      showToast('Welcome Examiner Abhinav! Result management portal is active.');
    } else {
      showToast(`Welcome ${newSession.student?.studentName}! Showing your examination marksheet.`);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setPreviewingStudent(null);
    setEditingStudent(null);
    showToast('Signed out successfully.');
  };

  const handleUpdateMarks = (
    studentId: string,
    updatedMarks: StudentMarks,
    isPublished: boolean,
    remarks?: string
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            marks: updatedMarks,
            isPublished,
            remarks: remarks !== undefined ? remarks : s.remarks,
            lastUpdated: new Date().toISOString(),
          };
        }
        return s;
      })
    );

    // If student themselves is logged in or previewed, update their session view
    if (session?.role === 'student' && session.student?.id === studentId) {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              student: {
                ...prev.student!,
                marks: updatedMarks,
                isPublished,
                remarks,
                lastUpdated: new Date().toISOString(),
              },
            }
          : null
      );
    }

    if (previewingStudent && previewingStudent.id === studentId) {
      setPreviewingStudent((prev) =>
        prev
          ? {
              ...prev,
              marks: updatedMarks,
              isPublished,
              remarks,
              lastUpdated: new Date().toISOString(),
            }
          : null
      );
    }

    showToast('Student marks and evaluation updated successfully.');
  };

  const handleTogglePublish = (studentId: string) => {
    let nextStatus = false;
    let targetName = '';
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          nextStatus = !s.isPublished;
          targetName = s.studentName;
          return { ...s, isPublished: nextStatus };
        }
        return s;
      })
    );
    showToast(
      `${targetName}'s results ${nextStatus ? 'published for student view' : 'set to draft (moderation)'}.`
    );
  };

  const handlePublishAll = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, isPublished: true })));
    showToast('All student marks published successfully.');
  };

  const handleUnpublishAll = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, isPublished: false })));
    showToast('All student marks saved as draft (moderation mode).');
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
    showToast(`Student ${newStudent.studentName} (${newStudent.registerNumber}) registered successfully.`);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    showToast('Student record removed.');
  };

  const handleResetData = () => {
    if (confirm('Reset all student marks back to official initial records?')) {
      setStudents(INITIAL_STUDENTS);
      showToast('Student database reset to official default records.');
    }
  };

  const handleGenerateRandomMarks = () => {
    setStudents((prev) =>
      prev.map((student) => {
        const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        return {
          ...student,
          marks: {
            English: rand(55, 98),
            Mathematics: rand(42, 99),
            Science: rand(48, 97),
            'Social Science': rand(50, 96),
            'Computer Science': rand(60, 99),
          },
          lastUpdated: new Date().toISOString(),
        };
      })
    );
    showToast('Generated realistic randomized marks across all subjects.');
  };

  // Get current student object from synced state if logged in as student
  const activeStudent =
    session?.role === 'student' && session.student
      ? students.find((s) => s.id === session.student?.id) || session.student
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header
        session={session}
        onLogout={handleLogout}
        onOpenSwitchRole={() => setSession(null)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 no-print animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-lg border border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* If Examiner clicked preview on a student */}
        {previewingStudent ? (
          <StudentResultCard
            student={
              students.find((s) => s.id === previewingStudent.id) || previewingStudent
            }
            onBack={() => setPreviewingStudent(null)}
            isExaminerPreview={true}
          />
        ) : !session ? (
          /* Public login screen with tabs for Student and Examiner */
          <LoginView students={students} onLogin={handleLogin} />
        ) : session.role === 'examiner' ? (
          /* Examiner Console for Abhinav */
          <ExaminerDashboard
            students={students}
            onUpdateMarks={handleUpdateMarks}
            onTogglePublish={handleTogglePublish}
            onPublishAll={handlePublishAll}
            onUnpublishAll={handleUnpublishAll}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onResetData={handleResetData}
            onGenerateRandomMarks={handleGenerateRandomMarks}
            onPreviewStudent={(s) => setPreviewingStudent(s)}
            onOpenEditModal={(s) => setEditingStudent(s)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        ) : activeStudent ? (
          /* Student's personalized official result marksheet */
          <StudentResultCard student={activeStudent} onBack={handleLogout} />
        ) : (
          <div className="p-8 text-center text-slate-500">
            Student record not found. Please log in again.
          </div>
        )}
      </main>

      {/* Edit Marks Modal */}
      {editingStudent && (
        <EditMarksModal
          student={students.find((s) => s.id === editingStudent.id) || editingStudent}
          onSave={handleUpdateMarks}
          onClose={() => setEditingStudent(null)}
        />
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <AddStudentModal
          existingStudents={students}
          onAdd={handleAddStudent}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* University Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-slate-700">
              ABC INTERNATIONAL UNIVERSITY DELHI
            </span>
            <span aria-hidden="true">·</span>
            <span>Directorate of Examinations</span>
          </div>
          <div>
            <span>Examiner in Charge: <strong>Abhinav</strong> · Examination System v2.6</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
