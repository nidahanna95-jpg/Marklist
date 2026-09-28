import React from 'react';
import { Student, SUBJECTS } from '../types';
import { calculateStudentMetrics } from '../utils/calculations';
import universityCrest from '../assets/images/university_crest_seal_1790616050853.jpg';
import { Printer, CheckCircle2, XCircle, ArrowLeft, Clock, Award, ShieldCheck, FileCheck2 } from 'lucide-react';

interface StudentResultCardProps {
  student: Student;
  onBack: () => void;
  isExaminerPreview?: boolean;
}

export const StudentResultCard: React.FC<StudentResultCardProps> = ({
  student,
  onBack,
  isExaminerPreview = false,
}) => {
  const metrics = calculateStudentMetrics(student.marks);

  const handlePrint = () => {
    window.print();
  };

  // If student is unpublished and viewer is NOT an examiner previewing, show moderation notice
  if (!student.isPublished && !isExaminerPreview) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Results Under Moderation</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Dear <strong className="text-slate-800">{student.studentName}</strong> (Register No:{' '}
            <strong className="text-slate-800 font-mono">{student.registerNumber}</strong>), your Semester
            examination results are currently undergoing final evaluation and moderation by{' '}
            <strong className="text-slate-900">Examiner Abhinav</strong>.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 mb-6">
            Please check back shortly once the Controller of Examinations publishes the finalized mark
            sheets.
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Controls (Hidden during print) */}
      <div className="no-print flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isExaminerPreview ? 'Back to Examiner Dashboard' : 'Sign Out / Portal'}</span>
        </button>

        <div className="flex items-center gap-2">
          {isExaminerPreview && (
            <span className="text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-semibold border border-amber-300">
              Examiner Preview Mode
            </span>
          )}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Marksheet / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Marksheet Document Container */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 print-shadow-none shadow-md overflow-hidden relative print:border-slate-400 print:rounded-none">
        {/* Watermark subtle seal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <img
            src={universityCrest}
            alt=""
            className="w-[500px] h-[500px] object-contain"
            aria-hidden="true"
          />
        </div>

        {/* Certificate Header Banner */}
        <div className="p-6 sm:p-8 border-b-2 border-amber-700/30 bg-gradient-to-b from-amber-50/40 via-white to-white text-center relative">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
            <img
              src={universityCrest}
              alt="ABC International University Seal"
              className="w-20 h-20 rounded-full object-cover border-2 border-amber-600/40 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase">
                ABC INTERNATIONAL UNIVERSITY DELHI
              </h1>
              <p className="text-xs font-semibold tracking-widest text-amber-900 uppercase">
                Established under UGC Act · Accredited Grade &apos;A++&apos;
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Directorate of Examinations & Academic Evaluation · Delhi, India
              </p>
            </div>
          </div>

          <div className="inline-block mt-3 px-4 py-1 rounded bg-slate-900 text-white font-medium text-xs tracking-wider uppercase">
            Official Statement of Marks &amp; Grades
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Bachelor of Science (Regular Semester VI Final Examinations 2026)
          </p>
        </div>

        {/* Student Credential Metadata Box */}
        <div className="px-6 sm:px-8 py-5 bg-slate-50/80 border-b border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block">Student Name</span>
              <strong className="text-sm text-slate-900 uppercase">{student.studentName}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Register Number</span>
              <strong className="text-sm font-mono text-slate-900">{student.registerNumber}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Roll Number</span>
              <span className="font-semibold text-slate-900 font-mono-num">{student.rollNo}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Evaluation Status</span>
              <span
                className={`inline-flex items-center gap-1 font-bold ${
                  metrics.status === 'PASS' ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {metrics.status === 'PASS' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PASSED</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>REAPPEAR / FAIL</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Subject Marks Table */}
        <div className="px-6 sm:px-8 py-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Subject Code</th>
                  <th className="py-2.5 px-3">Subject Title</th>
                  <th className="py-2.5 px-3 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Pass Marks</th>
                  <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Grade Point</th>
                  <th className="py-2.5 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {SUBJECTS.map((sub) => {
                  const subjectMetric = metrics.subjectGrades[sub.name];
                  const mark = subjectMetric?.marks ?? 0;
                  const isPass = subjectMetric?.status === 'PASS';

                  return (
                    <tr
                      key={sub.code}
                      className={!isPass ? 'bg-red-50/60 font-medium' : 'hover:bg-slate-50/50'}
                    >
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">{sub.code}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{sub.name}</td>
                      <td className="py-3 px-3 text-center font-mono-num text-slate-600">{sub.maxMarks}</td>
                      <td className="py-3 px-3 text-center font-mono-num text-slate-600">{sub.passMarks}</td>
                      <td className="py-3 px-3 text-center font-mono-num font-bold text-sm text-slate-900">
                        {mark}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {subjectMetric?.grade}
                      </td>
                      <td className="py-3 px-3 text-center font-mono-num text-slate-700">
                        {subjectMetric?.gradePoint?.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPass ? 'text-emerald-800 bg-emerald-100' : 'text-red-800 bg-red-100'
                          }`}
                        >
                          {isPass ? 'PASS' : 'REAPPEAR'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-800 bg-slate-100/90 font-bold text-slate-900">
                  <td colSpan={2} className="py-3 px-3 uppercase tracking-wider text-xs">
                    Grand Total
                  </td>
                  <td className="py-3 px-3 text-center font-mono-num text-slate-700">
                    {metrics.maxTotalMarks}
                  </td>
                  <td className="py-3 px-3 text-center font-mono-num text-slate-700">200</td>
                  <td className="py-3 px-3 text-center font-mono-num text-base text-slate-950 font-bold">
                    {metrics.totalMarks}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-base text-amber-900">
                    {metrics.grade}
                  </td>
                  <td className="py-3 px-3 text-center font-mono-num text-slate-800">
                    {metrics.gradePoint.toFixed(1)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-extrabold ${
                        metrics.status === 'PASS'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {metrics.status}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Grand Summary Metrics Panel */}
          <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Overall Percentage</span>
              <span className="text-xl font-mono-num font-bold text-slate-900">
                {metrics.percentage}%
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Final Grade</span>
              <span className="text-xl font-bold text-amber-900">{metrics.grade}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Division Awarded</span>
              <span className="text-xs font-bold text-slate-800 block mt-1">
                {metrics.division}
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Result Classification</span>
              <span
                className={`text-xs font-extrabold block mt-1 ${
                  metrics.status === 'PASS' ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {metrics.status === 'PASS' ? 'QUALIFIED FOR DEGREE' : 'COMPARTMENT REQUIRED'}
              </span>
            </div>
          </div>

          {metrics.failedSubjects.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
              <strong>Notice on Compartment:</strong> Student scored below minimum 40 marks in:{' '}
              <span className="font-semibold">{metrics.failedSubjects.join(', ')}</span>. As per
              university examination regulations, student must reappear in the supplementary examination for
              the specified subject(s).
            </div>
          )}

          {student.remarks && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950">
              <span className="font-semibold block mb-0.5">Examiner Evaluation Remark:</span>
              <p className="italic text-slate-700">&ldquo;{student.remarks}&rdquo;</p>
            </div>
          )}

          {/* Performance Breakdown Bar Chart (screen only) */}
          <div className="mt-6 pt-5 border-t border-slate-200 no-print">
            <h4 className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Subject Performance Visualizer</span>
            </h4>
            <div className="space-y-2.5">
              {SUBJECTS.map((sub) => {
                const mark = student.marks[sub.name] ?? 0;
                return (
                  <div key={sub.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{sub.name}</span>
                      <span className="font-mono-num font-bold text-slate-900">{mark} / 100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          mark >= 75
                            ? 'bg-emerald-500'
                            : mark >= 60
                            ? 'bg-blue-500'
                            : mark >= 40
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${mark}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grading System Key */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 block mb-1">Grading Scale (CBCS 10-Point Scale):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <span>90-100: A+ (Outstanding / 10)</span>
              <span>80-89: A (Excellent / 9)</span>
              <span>70-79: B+ (Very Good / 8)</span>
              <span>60-69: B (Good / 7)</span>
              <span>50-59: C (Above Average / 6)</span>
              <span>40-49: D (Pass / 5)</span>
              <span className="text-red-600 font-medium">Below 40: F (Fail / 0)</span>
              <span>Passing: Min 40 in each subject</span>
            </div>
          </div>
        </div>

        {/* Verification & Sign-off Footer */}
        <div className="px-6 sm:px-8 py-6 bg-slate-50/90 border-t-2 border-slate-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Security Barcode / QR Simulation */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 p-1 bg-white border border-slate-300 rounded shadow-2xs flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-14 h-14 text-slate-900"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                >
                  <rect x="2" y="2" width="6" height="6" fill="currentColor" />
                  <rect x="16" y="2" width="6" height="6" fill="currentColor" />
                  <rect x="2" y="16" width="6" height="6" fill="currentColor" />
                  <rect x="9" y="4" width="2" height="2" fill="currentColor" />
                  <rect x="13" y="4" width="2" height="2" fill="currentColor" />
                  <rect x="9" y="8" width="4" height="2" fill="currentColor" />
                  <rect x="16" y="10" width="2" height="4" fill="currentColor" />
                  <rect x="10" y="14" width="3" height="3" fill="currentColor" />
                  <rect x="18" y="16" width="4" height="2" fill="currentColor" />
                  <rect x="16" y="20" width="4" height="2" fill="currentColor" />
                </svg>
              </div>
              <div className="text-[11px] text-slate-500">
                <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Digitally Verified &amp; Cryptographically Signed</span>
                </div>
                <div className="font-mono text-[10px] text-slate-600 mt-0.5">
                  DOC-ID: ABCU-{student.registerNumber}-2026
                </div>
                <div className="text-[10px] text-slate-400">
                  Issued on: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="flex items-center gap-8 text-center">
              <div>
                <div className="h-10 flex items-center justify-center font-display italic font-bold text-slate-800 text-sm border-b border-slate-400 px-4">
                  Abhinav
                </div>
                <span className="text-[11px] font-semibold text-slate-800 block mt-1">
                  Examiner Abhinav
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Senior Evaluator of Examinations
                </span>
              </div>

              <div>
                <div className="h-10 flex items-center justify-center border-b border-slate-400 px-4">
                  <FileCheck2 className="w-6 h-6 text-amber-800" />
                </div>
                <span className="text-[11px] font-semibold text-slate-800 block mt-1">
                  Registrar / Controller
                </span>
                <span className="text-[10px] text-slate-500 block">
                  ABC International University Delhi
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mt-5 pt-3 border-t border-slate-200 text-[10px] text-slate-400">
            This is an official university grade transcript issued under the authority of the Board of Examinations,
            ABC International University Delhi. Any alterations render this document null and void.
          </div>
        </div>
      </div>
    </div>
  );
};
