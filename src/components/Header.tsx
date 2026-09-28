import React from 'react';
import { UserSession } from '../types';
import universityCrest from '../assets/images/university_crest_seal_1790616050853.jpg';

interface HeaderProps {
  session: UserSession | null;
  onLogout: () => void;
  onOpenSwitchRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({ session, onLogout, onOpenSwitchRole }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <img
              src={universityCrest}
              alt="ABC International University Delhi Official Seal"
              className="w-10 h-10 rounded-full object-cover shadow-xs border border-amber-200"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
                ABC INTERNATIONAL UNIVERSITY
              </span>
              <span className="text-[11px] font-medium tracking-wider text-amber-800 uppercase">
                Delhi · Examination Branch
              </span>
            </div>
          </div>

          {/* Zone 2: Center Status / Session Context */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span>Academic Session 2025–2026</span>
            <span aria-hidden="true">·</span>
            <span>Semester VI Regular Evaluation</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">UGC Recognized</span>
          </div>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            {session ? (
              <>
                <div className="flex items-center gap-2 mr-1">
                  <span className="text-xs text-slate-600 hidden sm:inline">
                    Logged in as:{' '}
                    <strong className="text-slate-900 font-semibold">
                      {session.role === 'examiner'
                        ? session.examinerName
                        : session.student?.studentName}
                    </strong>
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                      session.role === 'examiner'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {session.role === 'examiner' ? 'Examiner' : 'Student'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                  title="Sign out of current account"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenSwitchRole}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
