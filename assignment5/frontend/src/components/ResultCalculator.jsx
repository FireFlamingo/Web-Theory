import React, { useState } from 'react';
import { RefreshCw, Info } from 'lucide-react';
import { calculateSubjectGrade } from '../api/resultApi';

const DEFAULT_SUBJECTS = [
  { subjectCode: 'CS301', subjectName: 'Web Technology',              credits: 4, mse: 26, ese: 62 },
  { subjectCode: 'CS302', subjectName: 'Database Management Systems', credits: 4, mse: 27, ese: 64 },
  { subjectCode: 'CS303', subjectName: 'Software Engineering',        credits: 3, mse: 24, ese: 56 },
  { subjectCode: 'CS304', subjectName: 'Computer Networks',           credits: 3, mse: 25, ese: 58 },
];

export default function ResultCalculator() {
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);

  const handleMark = (idx, field, value) => {
    let v = parseFloat(value);
    if (isNaN(v)) v = 0;
    if (field === 'mse') v = Math.min(30, Math.max(0, v));
    if (field === 'ese') v = Math.min(70, Math.max(0, v));
    const updated = [...subjects];
    updated[idx] = { ...updated[idx], [field]: v };
    setSubjects(updated);
  };

  const calc = subjects.map(sub => {
    const c = calculateSubjectGrade(sub.mse, sub.ese);
    return { ...sub, total: c.total, letterGrade: c.letterGrade, gradePoint: c.gradePoint, creditPoints: c.gradePoint * sub.credits };
  });

  const totalCredits = calc.reduce((a, s) => a + s.credits, 0);
  const earnedPoints = calc.reduce((a, s) => a + s.creditPoints, 0);
  const totalMarks = calc.reduce((a, s) => a + s.total, 0);
  const maxMarks = calc.length * 100;
  const sgpa = totalCredits > 0 ? (earnedPoints / totalCredits).toFixed(2) : '0.00';
  const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);
  const hasFail = calc.some(s => s.letterGrade === 'F');
  const resultStatus = hasFail ? 'FAIL' : 'PASS';
  const sgpaNum = parseFloat(sgpa);
  let overallGrade = 'Fail';
  if (!hasFail) {
    if (sgpaNum >= 8.0) overallGrade = 'First Class with Distinction';
    else if (sgpaNum >= 6.75) overallGrade = 'First Class';
    else if (sgpaNum >= 6.0) overallGrade = 'Higher Second Class';
    else overallGrade = 'Pass Class';
  }

  const inputCls = "w-16 bg-white border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-center font-mono font-bold text-[var(--text-h)] focus:outline-none focus:border-[var(--accent)]";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="card-panel p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.15em] mb-1">Live Grade & SGPA Predictor</div>
          <h2 className="text-2xl font-black text-[var(--text-h)] tracking-tight">Interactive Semester Result Calculator</h2>
          <p className="text-xs text-[var(--text)] mt-1">
            Adjust MSE (30%) & ESE (70%) marks for each subject — SGPA updates in real time.
          </p>
        </div>
        <button onClick={() => setSubjects(DEFAULT_SUBJECTS)}
          className="flex items-center gap-2 bg-[var(--bg-subtle)] hover:bg-[var(--code-bg)] text-[var(--text-h)] px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border)] transition-all self-start md:self-auto">
          <RefreshCw className="w-3.5 h-3.5" /> Reset to Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Subject Sliders */}
        <div className="lg:col-span-8 space-y-4">
          {calc.map((sub, idx) => {
            const isFail = sub.letterGrade === 'F';
            return (
              <div key={sub.subjectCode} className="card-panel p-5 bg-white space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[var(--accent)] bg-[var(--accent-bg)] px-2 py-0.5 rounded border border-[var(--accent-border)]">
                      {sub.subjectCode} · {sub.credits} Credits
                    </span>
                    <h3 className="font-bold text-[var(--text-h)] text-base mt-1.5">{sub.subjectName}</h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text)]">Total:</span>
                      <span className="text-xl font-black text-[var(--text-h)] font-mono">{sub.total} / 100</span>
                      <span className={`px-2 py-0.5 rounded font-black text-xs border ${
                        isFail
                          ? 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger-border)]'
                          : 'bg-[var(--accent-bg)] text-[var(--accent)] border-[var(--accent-border)]'
                      }`}>
                        {sub.letterGrade} ({sub.gradePoint} pts)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--border)]">
                  {/* MSE */}
                  <div className="space-y-2 bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border)]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[var(--text-h)]">Mid Semester (MSE)</span>
                      <span className="text-[var(--accent)] font-mono font-bold">{sub.mse} / 30</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="30" step="0.5" value={sub.mse}
                        onChange={e => handleMark(idx, 'mse', e.target.value)}
                        className="w-full h-1.5 rounded-lg cursor-pointer accent-[#9c6b30]" />
                      <input type="number" min="0" max="30" step="0.5" value={sub.mse}
                        onChange={e => handleMark(idx, 'mse', e.target.value)}
                        className={inputCls} />
                    </div>
                  </div>

                  {/* ESE */}
                  <div className="space-y-2 bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border)]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[var(--text-h)]">End Semester (ESE)</span>
                      <span className="text-[var(--accent-muted)] font-mono font-bold">{sub.ese} / 70</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="70" step="0.5" value={sub.ese}
                        onChange={e => handleMark(idx, 'ese', e.target.value)}
                        className="w-full h-1.5 rounded-lg cursor-pointer accent-[#b8945e]" />
                      <input type="number" min="0" max="70" step="0.5" value={sub.ese}
                        onChange={e => handleMark(idx, 'ese', e.target.value)}
                        className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SGPA Summary Panel */}
        <div className="lg:col-span-4">
          <div className="card-panel p-6 bg-[#2c2014] sticky top-24 space-y-5">
            <div className="text-center pb-4 border-b border-[#3e2c1a]">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#b8945e]">Predicted SGPA</span>
              <div className="text-5xl font-black text-[#d4a95e] font-mono mt-2 tracking-tight">
                {sgpa} <span className="text-sm font-normal text-[#8a7e72]">/ 10.0</span>
              </div>
              <div className="mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  hasFail
                    ? 'bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger-border)]'
                    : 'bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-border)]'
                }`}>
                  STATUS: {resultStatus}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { label: 'Total Marks Obtained', value: `${totalMarks} / ${maxMarks}`, valueClass: 'text-[#e6dfd6] font-mono text-sm' },
                { label: 'Overall Percentage',   value: `${percentage}%`,              valueClass: 'text-[#d4a95e] font-mono text-sm' },
                { label: 'Earned Credit Points', value: `${earnedPoints} / ${totalCredits * 10}`, valueClass: 'text-[#e6dfd6] font-mono text-sm' },
                { label: 'Class Award',          value: overallGrade,                   valueClass: 'text-[#c9aa82] text-xs font-bold' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-[#3e2c1a] last:border-none">
                  <span className="text-[#8a7e72]">{row.label}</span>
                  <strong className={row.valueClass}>{row.value}</strong>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#3e2c1a] border border-[#52391f] text-[11px] text-[#b8945e] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#d4a95e] font-bold">
                <Info className="w-3.5 h-3.5" /> VIT Grading Formula
              </div>
              <p>Subject Mark = MSE (30%) + ESE (70%)</p>
              <p className="font-mono text-[10px] text-[#c9aa82]">
                SGPA = (∑ GradePoint × Credits) / {totalCredits}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
