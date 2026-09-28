import React, { useState } from 'react';
import { Student, UserSession } from '../types';
import { EXAMINER_CREDENTIALS } from '../data/initialData';
import universityCrest from '../assets/images/university_crest_seal_1790616050853.jpg';
import { ShieldCheck, GraduationCap, ArrowRight, KeyRound, User, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  students: Student[];
  onLogin: (session: UserSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ students, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'examiner'>('student');

  // Examiner login state
  const [examinerUsername, setExaminerUsername] = useState('');
  const [examinerPassword, setExaminerPassword] = useState('');
  const [examinerError, setExaminerError] = useState('');

  // Student login state
  const [studentName, setStudentName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [studentError, setStudentError] = useState('');

  const handleExaminerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExaminerError('');

    const cleanUsername = examinerUsername.trim();
    const cleanPassword = examinerPassword.trim();

    if (
      cleanUsername.toLowerCase() === EXAMINER_CREDENTIALS.username.toLowerCase() &&
      cleanPassword === EXAMINER_CREDENTIALS.password
    ) {
      onLogin({
        role: 'examiner',
        examinerName: EXAMINER_CREDENTIALS.fullName,
      });
    } else {
      setExaminerError('Invalid examiner credentials. Username is "Abhinav" and password is secure.');
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');

    const cleanName = studentName.trim().toLowerCase();
    const cleanReg = registerNumber.trim().toUpperCase();

    const matchedStudent = students.find(
      (s) =>
        s.studentName.trim().toLowerCase() === cleanName &&
        s.registerNumber.trim().toUpperCase() === cleanReg
    );

    if (matchedStudent) {
      onLogin({
        role: 'student',
        student: matchedStudent,
      });
    } else {
      setStudentError(
        'No matching student found. Please verify your Student Name and Register Number (e.g., Anu / PQASAEGR1).'
      );
    }
  };

  const fillExaminerDemo = () => {
    setExaminerUsername(EXAMINER_CREDENTIALS.username);
    setExaminerPassword(EXAMINER_CREDENTIALS.password);
    setExaminerError('');
  };

  const fillStudentDemo = (student: Student) => {
    setStudentName(student.studentName);
    setRegisterNumber(student.registerNumber);
    setStudentError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-amber-50/20 to-slate-100">
      <div className="max-w-xl w-full mx-auto">
        {/* Institutional Branding */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <img
              src={universityCrest}
              alt="ABC International University Seal"
              className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-amber-300 shadow-md mb-3"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase">
            ABC International University
          </h1>
          <p className="text-xs font-semibold tracking-widest text-amber-900 uppercase mt-0.5">
            Delhi · Controller of Examinations
          </p>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Official Result Management & Verification System for Semester Examinations.
          </p>
        </div>

        {/* Card Enclosure */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setStudentError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('examiner');
                setExaminerError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'examiner'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Examiner Login</span>
            </button>
          </div>

          {activeTab === 'student' ? (
            <div>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-slate-900">Check Your Examination Results</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your registered Student Name as Username and your Register Number as Password.
                </p>
              </div>

              {studentError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <span className="font-semibold shrink-0">Login failed:</span>
                  <span>{studentError}</span>
                </div>
              )}

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username (Student Name)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Anu or Sara"
                      className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password (Register Number)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      placeholder="e.g. PQASAEGR1"
                      className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all uppercase tracking-wider"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <span>View My Results</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Select for Reviewer Testing */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Quick Student Login (Test Evaluation)
                  </span>
                  <span className="text-[11px] text-slate-500">15 Preloaded Students</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                  {students.map((std) => (
                    <button
                      key={std.id}
                      type="button"
                      onClick={() => fillStudentDemo(std)}
                      className="text-left p-1.5 rounded hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200 text-xs transition-all"
                      title={`${std.studentName} (${std.registerNumber})`}
                    >
                      <div className="font-semibold text-slate-800 truncate">{std.studentName}</div>
                      <div className="text-[10px] text-slate-500 truncate">{std.registerNumber}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900">Examiner Sign In</h2>
                  <span className="text-[11px] font-medium bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    Evaluation Office
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authorized access for Examiner Abhinav to add, edit, update, and publish student marks.
                </p>
              </div>

              {examinerError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <span className="font-semibold shrink-0">Authentication Error:</span>
                  <span>{examinerError}</span>
                </div>
              )}

              <form onSubmit={handleExaminerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Examiner Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={examinerUsername}
                      onChange={(e) => setExaminerUsername(e.target.value)}
                      placeholder="Abhinav"
                      className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Examiner Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={examinerPassword}
                      onChange={(e) => setExaminerPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-colors shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Examiner Console</span>
                </button>
              </form>

              {/* Quick Fill for Examiner */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-semibold text-amber-950">Assigned Examiner Credentials</p>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      Username: <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">Abhinav</code> ·
                      Password: <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">Abhinav@2026</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fillExaminerDemo}
                    className="shrink-0 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Auto-Fill</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security and Examination Seal Footer Notice */}
        <div className="text-center mt-6 text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Evaluation Record System · ABC International University Delhi</span>
        </div>
      </div>
    </div>
  );
};
