import React, { useState } from 'react';
import { Search, Eye, Edit2, Trash2, Plus, FileText, CheckCircle2, XCircle } from 'lucide-react';

export default function StudentList({ results, onViewMarksheet, onEditStudent, onDeleteStudent, onOpenAddModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredResults = results.filter(student => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      student.studentName.toLowerCase().includes(q) ||
      student.prn.toLowerCase().includes(q) ||
      student.rollNo.toLowerCase().includes(q);
    const matchesBranch = selectedBranch === 'ALL' || student.branch.toLowerCase() === selectedBranch.toLowerCase();
    const matchesStatus = selectedStatus === 'ALL' || student.resultStatus === selectedStatus;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const selectCls = "w-full bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[var(--text-h)] focus:outline-none focus:border-[var(--accent)] transition-all";

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-panel p-5 bg-white">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-h)] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--accent)]" />
            Student Marksheets Directory
          </h2>
          <p className="text-xs text-[var(--text)] mt-1">Semester V records synchronised with MongoDB.</p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 bg-[#2c2014] hover:bg-[#3e2c1a] text-[#e6dfd6] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Student Result
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 card-panel p-4 bg-white">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[var(--text)] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by Name, PRN (e.g. 22210045), or Roll No..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[var(--text-h)] placeholder-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-all"
          />
        </div>
        <div className="md:col-span-3">
          <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className={selectCls}>
            <option value="ALL">All Branches</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="AI & Data Science">AI &amp; Data Science</option>
            <option value="Electronics & Telecom">Electronics &amp; Telecom</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className={selectCls}>
            <option value="ALL">All Statuses</option>
            <option value="PASS">PASS Only</option>
            <option value="FAIL">FAIL Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-panel overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-[var(--text)]">
            <thead className="bg-[var(--bg-subtle)] text-[var(--text-h)] uppercase text-[11px] font-bold tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="py-3.5 px-4">Student Details</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4 text-center">WT (4cr)</th>
                <th className="py-3.5 px-4 text-center">DBMS (4cr)</th>
                <th className="py-3.5 px-4 text-center">SE (3cr)</th>
                <th className="py-3.5 px-4 text-center">CN (3cr)</th>
                <th className="py-3.5 px-4 text-center">SGPA</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-white">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-14 text-center text-[var(--text)] italic">
                    No records match the current filter criteria.
                  </td>
                </tr>
              ) : filteredResults.map(student => {
                const getSub = code => student.subjects?.find(s => s.subjectCode === code);
                const isPassed = student.resultStatus === 'PASS';
                const SubCell = ({ code }) => {
                  const sub = getSub(code);
                  if (!sub) return <td className="py-4 px-4 text-center text-[var(--text)]">—</td>;
                  const isFail = sub.letterGrade === 'F';
                  return (
                    <td className="py-4 px-4 text-center font-mono">
                      <span className="font-bold text-[var(--text-h)]">{sub.totalCombinedMark}</span>
                      <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isFail
                          ? 'bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger-border)]'
                          : 'bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]'
                      }`}>
                        {sub.letterGrade}
                      </span>
                    </td>
                  );
                };

                return (
                  <tr key={student.id || student.prn} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-[var(--text-h)] text-sm">{student.studentName}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text)]">
                        <span className="bg-[var(--bg-subtle)] text-[var(--accent)] px-1.5 py-0.5 rounded border border-[var(--border)] font-mono text-[10px] font-bold">
                          PRN: {student.prn}
                        </span>
                        <span>Roll: {student.rollNo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-[var(--text-h)]">{student.branch}</td>
                    <SubCell code="CS301" />
                    <SubCell code="CS302" />
                    <SubCell code="CS303" />
                    <SubCell code="CS304" />
                    <td className="py-4 px-4 text-center font-mono font-black text-sm text-[var(--accent)]">
                      {student.sgpa ? student.sgpa.toFixed(2) : '0.00'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border ${
                        isPassed
                          ? 'bg-[var(--success-bg)] border-[var(--success-border)] text-[var(--success)]'
                          : 'bg-[var(--danger-bg)] border-[var(--danger-border)] text-[var(--danger)]'
                      }`}>
                        {isPassed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {student.resultStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => onViewMarksheet(student)} title="View Marksheet"
                          className="p-1.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--accent)] hover:bg-[var(--accent-bg)] border border-[var(--border)] transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => onEditStudent(student)} title="Edit"
                          className="p-1.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--code-bg)] border border-[var(--border)] transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDeleteStudent(student.id || student.prn)} title="Delete"
                          className="p-1.5 rounded-lg bg-[var(--danger-bg)] text-[var(--danger)] hover:bg-rose-100 border border-[var(--danger-border)] transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-[var(--bg-subtle)] px-4 py-3 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--text)]">
          <span>Showing <strong>{filteredResults.length}</strong> of <strong>{results.length}</strong> total records</span>
          <span className="hidden sm:inline">Evaluation: MSE (30%) + ESE (70%)</span>
        </div>
      </div>
    </div>
  );
}
