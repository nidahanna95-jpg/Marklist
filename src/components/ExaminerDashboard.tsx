import React, { useState, useMemo } from 'react';
import { Student, StudentMarks, SUBJECTS } from '../types';
import { calculateStudentMetrics, calculateClassStatistics } from '../utils/calculations';
import {
  Search,
  Filter,
  UserPlus,
  Edit3,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  RotateCcw,
  Sparkles,
  Trophy,
  BarChart3,
  Send,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
} from 'lucide-react';

interface ExaminerDashboardProps {
  students: Student[];
  onUpdateMarks: (studentId: string, updatedMarks: StudentMarks, isPublished: boolean, remarks?: string) => void;
  onTogglePublish: (studentId: string) => void;
  onPublishAll: () => void;
  onUnpublishAll: () => void;
  onAddStudent: (newStudent: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onResetData: () => void;
  onGenerateRandomMarks: () => void;
  onPreviewStudent: (student: Student) => void;
  onOpenEditModal: (student: Student) => void;
  onOpenAddModal: () => void;
}

export const ExaminerDashboard: React.FC<ExaminerDashboardProps> = ({
  students,
  onTogglePublish,
  onPublishAll,
  onUnpublishAll,
  onDeleteStudent,
  onResetData,
  onGenerateRandomMarks,
  onPreviewStudent,
  onOpenEditModal,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'FAIL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [sortBy, setSortBy] = useState<'rollNo' | 'name' | 'percentage' | 'total'>('rollNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const stats = useMemo(() => calculateClassStatistics(students), [students]);

  // Filtered & Sorted student list
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const metrics = calculateStudentMetrics(student.marks);
        const matchesSearch =
          student.studentName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase().trim());

        if (!matchesSearch) return false;

        if (statusFilter === 'PASS') return metrics.status === 'PASS';
        if (statusFilter === 'FAIL') return metrics.status === 'FAIL';
        if (statusFilter === 'PUBLISHED') return student.isPublished;
        if (statusFilter === 'DRAFT') return !student.isPublished;
        return true;
      })
      .sort((a, b) => {
        const metricsA = calculateStudentMetrics(a.marks);
        const metricsB = calculateStudentMetrics(b.marks);

        let comparison = 0;
        if (sortBy === 'rollNo') comparison = a.rollNo - b.rollNo;
        else if (sortBy === 'name') comparison = a.studentName.localeCompare(b.studentName);
        else if (sortBy === 'percentage') comparison = metricsA.percentage - metricsB.percentage;
        else if (sortBy === 'total') comparison = metricsA.totalMarks - metricsB.totalMarks;

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [students, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const headers = [
      'Roll No',
      'Student Name',
      'Register Number',
      'English',
      'Mathematics',
      'Science',
      'Social Science',
      'Computer Science',
      'Total Marks (out of 500)',
      'Percentage (%)',
      'Grade',
      'Status',
      'Division',
      'Publication State',
    ];

    const rows = students.map((s) => {
      const m = calculateStudentMetrics(s.marks);
      return [
        s.rollNo,
        `"${s.studentName}"`,
        s.registerNumber,
        s.marks.English ?? 0,
        s.marks.Mathematics ?? 0,
        s.marks.Science ?? 0,
        s.marks['Social Science'] ?? 0,
        s.marks['Computer Science'] ?? 0,
        m.totalMarks,
        m.percentage,
        m.grade,
        m.status,
        `"${m.division}"`,
        s.isPublished ? 'Published' : 'Draft',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ABC_University_Results_Examiner_Abhinav.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Controller Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Examiner Console · Evaluation Branch
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">Evaluator: Abhinav</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Student Result Management &amp; Marks Publication
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Enter, modify, and publish semester examination results for ABC International University Delhi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
            <button
              type="button"
              onClick={onPublishAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              title="Publish all student marks so students can view them"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish All</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              title="Export complete result roster to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                showAnalytics
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block">Total Students</span>
            <span className="text-xl font-mono-num font-bold text-slate-900">{stats.totalStudents}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Enrolled Roster</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block">Pass Rate</span>
            <span className="text-xl font-mono-num font-bold text-emerald-700">
              {stats.passPercentage}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {stats.passedStudents} Passed · {stats.failedStudents} Fail
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block">Class Average</span>
            <span className="text-xl font-mono-num font-bold text-slate-900">
              {stats.averagePercentage}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Mean Score / 500</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-600" />
              Class Topper
            </span>
            <span className="text-sm font-bold text-amber-950 truncate block mt-0.5" title={stats.topperStudent?.name}>
              {stats.topperStudent?.name || '—'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {stats.topperStudent?.percentage}% ({stats.topperStudent?.total}/500)
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-slate-500 block">Publication State</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {students.filter((s) => s.isPublished).length} / {students.length}
            </div>
            <span className="text-[10px] text-slate-500 block">Published to Students</span>
          </div>
        </div>
      </div>

      {/* Analytics Drawer (Expandable) */}
      {showAnalytics && (
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-700" />
              <span>Subject Performance &amp; Evaluation Breakdown</span>
            </h3>
            <span className="text-xs text-slate-500">Evaluated by Examiner Abhinav</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {SUBJECTS.map((sub) => {
              const avg = stats.subjectAverages[sub.name] ?? 0;
              const high = stats.subjectHighest[sub.name] ?? { name: '—', mark: 0 };
              return (
                <div key={sub.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-900 mb-1 truncate" title={sub.name}>
                    {sub.name}
                  </div>
                  <div className="text-slate-600 mb-1">
                    Subject Avg:{' '}
                    <strong className="text-slate-900 font-mono-num">{avg} / 100</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-amber-600 rounded-full"
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate" title={`Highest: ${high.mark} by ${high.name}`}>
                    Top: <strong className="text-slate-800">{high.mark}</strong> ({high.name})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grade Distribution */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-700">Grade Distribution:</span>
            <div className="flex flex-wrap items-center gap-3">
              {(['A+', 'A', 'B+', 'B', 'C', 'D', 'F'] as const).map((grade) => (
                <div key={grade} className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">{grade}:</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono-num font-bold text-slate-900">
                    {stats.gradeDistribution[grade]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Roster Controls: Search, Filters, Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or register no (e.g. Anu, PQASAEGR1)..."
              className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all"
            />
          </div>

          {/* Filter tabs & Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(['ALL', 'PASS', 'FAIL', 'PUBLISHED', 'DRAFT'] as const).map((filterOpt) => (
                <button
                  key={filterOpt}
                  type="button"
                  onClick={() => setStatusFilter(filterOpt)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    statusFilter === filterOpt
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filterOpt === 'ALL'
                    ? 'All'
                    : filterOpt === 'PASS'
                    ? 'Passed'
                    : filterOpt === 'FAIL'
                    ? 'Failed'
                    : filterOpt === 'PUBLISHED'
                    ? 'Published'
                    : 'Draft'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-slate-700 outline-hidden"
              >
                <option value="rollNo">Sort: Roll No</option>
                <option value="name">Sort: Name</option>
                <option value="percentage">Sort: Percentage</option>
                <option value="total">Sort: Total Marks</option>
              </select>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded text-slate-500 hover:bg-slate-100 text-xs font-mono font-bold"
                title="Toggle sort direction"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Testing Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-slate-500">
            Showing <strong className="text-slate-800 font-semibold">{filteredStudents.length}</strong> of{' '}
            <strong className="text-slate-800 font-semibold">{students.length}</strong> registered students
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGenerateRandomMarks}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              title="Regenerate realistic marks for testing"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Randomize Realistic Marks</span>
            </button>
            <button
              type="button"
              onClick={onResetData}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              title="Reset data back to prompt defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Mark Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-3 text-center">English</th>
                <th className="py-3 px-3 text-center">Maths</th>
                <th className="py-3 px-3 text-center">Science</th>
                <th className="py-3 px-3 text-center">Social Sci</th>
                <th className="py-3 px-3 text-center">Comp Sci</th>
                <th className="py-3 px-3 text-center">Total / 500</th>
                <th className="py-3 px-3 text-center">%</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Publish</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-400">
                    <p className="text-sm">No students match your search or filter criteria.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('ALL');
                      }}
                      className="mt-2 text-xs text-amber-700 hover:underline font-semibold"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const metrics = calculateStudentMetrics(student.marks);
                  const isPass = metrics.status === 'PASS';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-mono-num font-semibold text-slate-500">
                        {student.rollNo}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student.studentName}</div>
                        <div className="font-mono text-[11px] text-slate-500">{student.registerNumber}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono-num font-semibold ${
                            (student.marks.English ?? 0) < 40 ? 'text-red-600 font-bold' : 'text-slate-800'
                          }`}
                        >
                          {student.marks.English ?? 0}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono-num font-semibold ${
                            (student.marks.Mathematics ?? 0) < 40 ? 'text-red-600 font-bold' : 'text-slate-800'
                          }`}
                        >
                          {student.marks.Mathematics ?? 0}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono-num font-semibold ${
                            (student.marks.Science ?? 0) < 40 ? 'text-red-600 font-bold' : 'text-slate-800'
                          }`}
                        >
                          {student.marks.Science ?? 0}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono-num font-semibold ${
                            (student.marks['Social Science'] ?? 0) < 40
                              ? 'text-red-600 font-bold'
                              : 'text-slate-800'
                          }`}
                        >
                          {student.marks['Social Science'] ?? 0}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono-num font-semibold ${
                            (student.marks['Computer Science'] ?? 0) < 40
                              ? 'text-red-600 font-bold'
                              : 'text-slate-800'
                          }`}
                        >
                          {student.marks['Computer Science'] ?? 0}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono-num font-bold text-slate-900">
                        {metrics.totalMarks}
                      </td>

                      <td className="py-3 px-3 text-center font-mono-num font-semibold text-slate-800">
                        {metrics.percentage}%
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {metrics.grade}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {metrics.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onTogglePublish(student.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                            student.isPublished
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {student.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(student)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Edit student marks"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onPreviewStudent(student)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Preview student's official marksheet"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove student ${student.studentName} (${student.registerNumber})?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary in Table */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            <span>Examiner: <strong>Abhinav</strong> (Examinations &amp; Evaluation Branch)</span>
          </div>
          <div>
            <span>Official CBCS Evaluation Standard · Max 100 per Subject</span>
          </div>
        </div>
      </div>
    </div>
  );
};
