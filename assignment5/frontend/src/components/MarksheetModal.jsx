import React from 'react';
import { X, Printer, Award } from 'lucide-react';

export default function MarksheetModal({ student, onClose }) {
  if (!student) return null;
  const isPassed = student.resultStatus === 'PASS';
  const totalCreditsSum = (student.subjects || []).reduce((a, s) => a + (s.credits || 0), 0);
  const totalCreditPoints = (student.subjects || []).reduce((a, s) => a + ((s.gradePoint || 0) * (s.credits || 0)), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2014]/80 backdrop-blur-md overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-[var(--bg-subtle)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden my-8">

        {/* Control Bar */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#2c2014] border-b border-[#3e2c1a] no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d4a95e]" />
            <h3 className="text-sm font-bold text-[#e6dfd6] uppercase tracking-wider">Official Semester Marksheet Preview</h3>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()}
              className="flex items-center gap-2 bg-[#9c6b30] hover:bg-[#845a27] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md">
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button onClick={onClose}
              className="p-2 rounded-xl bg-[#3e2c1a] text-[#b8945e] hover:text-[#e6dfd6] hover:bg-[#52391f] transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document */}
        <div className="printable-area p-8 sm:p-12 bg-white text-slate-900 font-serif relative">

          {/* Institutional Header */}
          <div className="text-center border-b-2 border-[#2c2014] pb-6 mb-6">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-full bg-[#2c2014] flex items-center justify-center font-bold text-xl border-2 border-[#9c6b30]">
                <span className="text-[#d4a95e] font-black text-sm">VIT</span>
              </div>
              <div className="text-left font-sans">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2c2014] uppercase leading-tight">
                  Vishwakarma Institute of Technology
                </h1>
                <p className="text-xs font-semibold text-[#6b5c4a]">
                  (An Autonomous Institute Affiliated to Savitribai Phule Pune University)
                </p>
                <p className="text-[11px] text-[#8a7e72] font-mono">
                  666, Upper Indiranagar, Bibwewadi, Pune, Maharashtra 411037
                </p>
              </div>
            </div>
            <div className="mt-4 bg-[#f5f1ec] py-2 px-5 rounded border border-[#e6dfd6] inline-block font-sans">
              <h2 className="text-sm font-bold text-[#2c2014] tracking-wider uppercase">
                Statement of Grades · B.Tech Semester V Examination
              </h2>
              <p className="text-[11px] text-[#8a7e72]">Evaluation Scheme: Mid Sem (MSE 30%) + End Sem (ESE 70%)</p>
            </div>
          </div>

          {/* Student Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans text-xs bg-[#faf8f5] p-4 rounded-lg border border-[#e6dfd6] mb-6">
            {[
              ['Student Name', student.studentName, false],
              ['PRN', student.prn, true],
              ['Roll Number', student.rollNo, true],
              ['Branch', student.branch, false],
              ['Semester & Year', `Semester V (${student.academicYear || '2025-2026'})`, false],
              ['Examination Month', 'DECEMBER 2025', false],
              ['Total Credits', `${totalCreditsSum} Credits`, false],
            ].map(([label, value, mono]) => (
              <div key={label}>
                <span className="text-[#8a7e72] text-[10px] uppercase font-bold block">{label}</span>
                <strong className={`text-sm text-[#2c2014] font-bold ${mono ? 'font-mono' : ''}`}>{value}</strong>
              </div>
            ))}
            <div>
              <span className="text-[#8a7e72] text-[10px] uppercase font-bold block">Status</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                isPassed ? 'bg-[#f0f5ee] text-[#5a7c52]' : 'bg-[#faf0ee] text-[#a64a3c]'
              }`}>
                {student.resultStatus}
              </span>
            </div>
          </div>

          {/* Marks Table */}
          <div className="font-sans overflow-hidden border border-[#e6dfd6] rounded-lg mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#2c2014] text-[#e6dfd6] text-[11px] uppercase tracking-wider font-bold">
                  {['Course Code','Course Title','Credits','MSE (30%)','ESE (70%)','Total (100)','Grade','Grade Point','Earned Pts'].map(h => (
                    <th key={h} className="py-2.5 px-3 border-r border-[#3e2c1a] last:border-none text-center first:text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd6]">
                {(student.subjects || []).map((sub, idx) => {
                  const earned = (sub.gradePoint || 0) * (sub.credits || 0);
                  return (
                    <tr key={idx} className="hover:bg-[#faf8f5]">
                      <td className="py-2.5 px-3 font-mono font-bold border-r border-[#e6dfd6] text-[#2c2014]">{sub.subjectCode}</td>
                      <td className="py-2.5 px-3 font-medium border-r border-[#e6dfd6] text-[#2c2014]">{sub.subjectName}</td>
                      <td className="py-2.5 px-3 text-center font-bold border-r border-[#e6dfd6]">{sub.credits}</td>
                      <td className="py-2.5 px-3 text-center font-mono border-r border-[#e6dfd6]">{sub.mseMarks} / 30</td>
                      <td className="py-2.5 px-3 text-center font-mono border-r border-[#e6dfd6]">{sub.eseMarks} / 70</td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono border-r border-[#e6dfd6] text-[#2c2014]">{sub.totalCombinedMark}</td>
                      <td className="py-2.5 px-3 text-center border-r border-[#e6dfd6]">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          sub.letterGrade === 'F' ? 'bg-[#faf0ee] text-[#a64a3c]' : 'bg-[#f5f1ec] text-[#9c6b30]'
                        }`}>{sub.letterGrade}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono border-r border-[#e6dfd6]">{sub.gradePoint}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#2c2014]">{earned}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary & SGPA Box */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 font-sans mb-8">
            <div className="sm:col-span-8 bg-[#faf8f5] p-4 rounded-lg border border-[#e6dfd6] space-y-2 text-xs">
              <h4 className="font-bold text-[#2c2014] border-b border-[#e6dfd6] pb-1">Grading Scale & SGPA Formula</h4>
              <p className="text-[11px] text-[#6b5c4a] leading-relaxed">
                SGPA = ∑ (Grade Point × Credits) / Total Credits =
                <strong className="font-mono text-[#2c2014]"> {totalCreditPoints} / {totalCreditsSum} = {student.sgpa?.toFixed(2)}</strong>
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#8a7e72] pt-1">
                {[['S','90-100%','10'],['A','80-89%','9'],['B','70-79%','8'],['C','60-69%','7'],['D','50-59%','6'],['P','40-49%','5'],['F','<40%','0']].map(([g,r,p]) => (
                  <span key={g}>• Grade {g} ({r}): {p} pts</span>
                ))}
              </div>
            </div>
            <div className="sm:col-span-4 bg-[#2c2014] text-[#e6dfd6] p-4 rounded-lg flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-[10px] font-bold text-[#b8945e] uppercase tracking-widest block">SGPA</span>
                <span className="text-4xl font-black text-[#d4a95e] font-mono mt-1 block">
                  {student.sgpa ? student.sgpa.toFixed(2) : '0.00'}
                </span>
                <span className="text-[11px] text-[#c9aa82] font-bold block mt-1">{student.overallGrade}</span>
              </div>
              <div className={`mt-3 w-full py-1 px-3 rounded text-xs font-black uppercase tracking-wider ${
                isPassed ? 'bg-[#5a7c52] text-white' : 'bg-[#a64a3c] text-white'
              }`}>
                Final Result: {student.resultStatus}
              </div>
            </div>
          </div>

          {/* Seals & Signature */}
          <div className="pt-5 border-t-2 border-[#2c2014] font-sans flex justify-between items-end text-xs">
            <div className="space-y-1">
              <div className="w-16 h-16 border border-dashed border-[#c9aa82] rounded flex items-center justify-center text-[10px] text-[#8a7e72] font-mono">
                [QR SEAL]
              </div>
              <p className="text-[10px] text-[#8a7e72] font-mono">Verified Digital Transcript · VIT Pune</p>
              <p className="text-[10px] text-[#c9aa82] font-mono">Issue Date: 29 AUGUST 2026</p>
            </div>
            <div className="text-center space-y-8">
              <div className="italic font-serif text-[#6b5c4a] text-sm">Prof. Standard Evaluation</div>
              <div className="border-t border-[#2c2014] pt-1 font-bold text-[#2c2014] uppercase text-xs">
                Controller of Examinations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
