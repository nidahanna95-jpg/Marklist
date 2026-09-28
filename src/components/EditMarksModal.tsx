import React, { useState } from 'react';
import { Student, StudentMarks, SUBJECTS } from '../types';
import { calculateStudentMetrics } from '../utils/calculations';
import { X, Check, AlertCircle, Save } from 'lucide-react';

interface EditMarksModalProps {
  student: Student;
  onSave: (studentId: string, updatedMarks: StudentMarks, isPublished: boolean, remarks?: string) => void;
  onClose: () => void;
}

export const EditMarksModal: React.FC<EditMarksModalProps> = ({ student, onSave, onClose }) => {
  const [marks, setMarks] = useState<StudentMarks>({ ...student.marks });
  const [isPublished, setIsPublished] = useState<boolean>(student.isPublished);
  const [remarks, setRemarks] = useState<string>(student.remarks || '');
  const [error, setError] = useState<string>('');

  const handleMarkChange = (subjectName: string, valStr: string) => {
    setError('');
    const num = valStr === '' ? 0 : Number(valStr);
    if (isNaN(num)) return;
    if (num < 0 || num > 100) {
      setError(`Marks for ${subjectName} must be between 0 and 100.`);
      return;
    }
    setMarks((prev) => ({
      ...prev,
      [subjectName]: num,
    }));
  };

  const currentMetrics = calculateStudentMetrics(marks);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const sub of SUBJECTS) {
      const val = marks[sub.name];
      if (val === undefined || val < 0 || val > 100 || isNaN(val)) {
        setError(`Please enter a valid score (0-100) for ${sub.name}.`);
        return;
      }
    }
    onSave(student.id, marks, isPublished, remarks.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Edit Examination Marks</h3>
            <p className="text-xs text-slate-500">
              Student: <span className="font-semibold text-slate-700">{student.studentName}</span> · Reg:{' '}
              <span className="font-mono text-slate-700 font-semibold">{student.registerNumber}</span>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Marks Input Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800">
                Subject Marks (Maximum: 100 each · Minimum Pass: 40)
              </label>
              <span className="text-[11px] text-slate-500">Examiner: Abhinav</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => {
                const currentVal = marks[subject.name] ?? 0;
                const isPass = currentVal >= subject.passMarks;
                return (
                  <div
                    key={subject.name}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-800 truncate" title={subject.name}>
                        {subject.name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isPass ? 'Pass' : 'Fail (<40)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={currentVal}
                        onChange={(e) => handleMarkChange(subject.name, e.target.value)}
                        className="w-full px-3 py-1.5 text-sm font-mono-num font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
                      />
                      <span className="text-xs font-medium text-slate-400">/ 100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Automatic Calculations Display */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <span className="text-[11px] font-bold tracking-wider text-amber-900 uppercase block mb-2">
              Automatic Computed Result Preview
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-2xs">
                <div className="text-[10px] text-slate-500">Total Marks</div>
                <div className="font-mono-num font-bold text-sm text-slate-900">
                  {currentMetrics.totalMarks} / 500
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-2xs">
                <div className="text-[10px] text-slate-500">Percentage</div>
                <div className="font-mono-num font-bold text-sm text-slate-900">
                  {currentMetrics.percentage}%
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-2xs">
                <div className="text-[10px] text-slate-500">Grade</div>
                <div className="font-bold text-sm text-slate-900">{currentMetrics.grade}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-2xs">
                <div className="text-[10px] text-slate-500">Status</div>
                <div
                  className={`font-bold text-xs mt-0.5 ${
                    currentMetrics.status === 'PASS' ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {currentMetrics.status}
                </div>
              </div>
            </div>
          </div>

          {/* Remarks & Publication Status */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Examiner Evaluation Remarks
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Excellent conceptual grasp, commended coursework."
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Publication Status</span>
                <span className="text-[11px] text-slate-500">
                  {isPublished
                    ? 'Published: Student can view results immediately upon login'
                    : 'Draft: Marked as undergoing moderation; hidden from student'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isPublished
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isPublished && <Check className="w-3.5 h-3.5" />}
                <span>{isPublished ? 'Published' : 'Save as Draft'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
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
              <Save className="w-3.5 h-3.5" />
              <span>Update Marks</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
