import React, { useState } from 'react';
import { Student, StudentMarks, SUBJECTS } from '../types';
import { X, UserPlus, AlertCircle } from 'lucide-react';

interface AddStudentModalProps {
  existingStudents: Student[];
  onAdd: (newStudent: Student) => void;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  existingStudents,
  onAdd,
  onClose,
}) => {
  const nextRoll = existingStudents.length > 0 ? Math.max(...existingStudents.map((s) => s.rollNo)) + 1 : 1;
  const [studentName, setStudentName] = useState('');
  const [registerNumber, setRegisterNumber] = useState(`PQASAEGR${nextRoll}`);
  const [marks, setMarks] = useState<StudentMarks>({
    English: 75,
    Mathematics: 75,
    Science: 75,
    'Social Science': 75,
    'Computer Science': 75,
  });
  const [remarks, setRemarks] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState('');

  const handleMarkChange = (subjectName: string, val: string) => {
    const num = val === '' ? 0 : Number(val);
    if (isNaN(num)) return;
    setMarks((prev) => ({
      ...prev,
      [subjectName]: Math.max(0, Math.min(100, num)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = studentName.trim();
    const cleanReg = registerNumber.trim().toUpperCase();

    if (!cleanName) {
      setError('Please provide a student name.');
      return;
    }
    if (!cleanReg) {
      setError('Please provide a register number.');
      return;
    }

    const regExists = existingStudents.some(
      (s) => s.registerNumber.toUpperCase() === cleanReg
    );
    if (regExists) {
      setError(`Register number ${cleanReg} is already assigned to another student.`);
      return;
    }

    const newStudent: Student = {
      id: cleanReg,
      rollNo: nextRoll,
      studentName: cleanName,
      registerNumber: cleanReg,
      marks,
      isPublished,
      remarks: remarks.trim() || 'Evaluated by Examiner Abhinav.',
      lastUpdated: new Date().toISOString(),
    };

    onAdd(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Add New Student & Marks</h3>
            <p className="text-xs text-slate-500">
              Register student into ABC International University Examination System
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Neha Sharma"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Register Number
              </label>
              <input
                type="text"
                required
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value.toUpperCase())}
                placeholder="e.g. PQASAEGR16"
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Initial Subject Marks (out of 100)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUBJECTS.map((sub) => (
                <div key={sub.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-700 font-medium truncate mr-2">{sub.name}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={marks[sub.name] ?? 0}
                      onChange={(e) => handleMarkChange(sub.name, e.target.value)}
                      className="w-16 px-2 py-1 text-xs font-mono-num font-semibold text-center bg-white border border-slate-300 rounded"
                    />
                    <span className="text-[11px] text-slate-400">/ 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Verified by Examiner Abhinav"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="publishCheckbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
            />
            <label htmlFor="publishCheckbox" className="text-xs text-slate-700 cursor-pointer">
              Publish immediately (Student can view results with their Name & Register Number)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Student</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
