import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle, AlertCircle } from 'lucide-react';

const DEFAULT_SUBJECTS = [
  { subjectCode: 'CS301', subjectName: 'Web Technology',              credits: 4, mseMarks: 25.0, eseMarks: 60.0 },
  { subjectCode: 'CS302', subjectName: 'Database Management Systems', credits: 4, mseMarks: 25.0, eseMarks: 60.0 },
  { subjectCode: 'CS303', subjectName: 'Software Engineering',        credits: 3, mseMarks: 20.0, eseMarks: 50.0 },
  { subjectCode: 'CS304', subjectName: 'Computer Networks',           credits: 3, mseMarks: 20.0, eseMarks: 50.0 },
];

export default function StudentFormModal({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    prn: '', studentName: '', rollNo: '',
    branch: 'Computer Engineering',
    semester: 5, academicYear: '2025-2026',
    subjects: DEFAULT_SUBJECTS,
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        prn: initialData.prn || '',
        studentName: initialData.studentName || '',
        rollNo: initialData.rollNo || '',
        branch: initialData.branch || 'Computer Engineering',
        semester: initialData.semester || 5,
        academicYear: initialData.academicYear || '2025-2026',
        subjects: initialData.subjects?.length === 4 ? initialData.subjects : DEFAULT_SUBJECTS,
      });
    }
  }, [initialData]);

  const set = (field, value) => setFormData(p => ({ ...p, [field]: value }));
  const setMark = (idx, field, raw) => {
    let v = parseFloat(raw);
    if (isNaN(v)) v = 0;
    if (field === 'mseMarks') v = Math.min(30, Math.max(0, v));
    if (field === 'eseMarks') v = Math.min(70, Math.max(0, v));
    const subs = [...formData.subjects];
    subs[idx] = { ...subs[idx], [field]: v };
    setFormData(p => ({ ...p, subjects: subs }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.prn.trim()) { setErrorMsg('PRN number is required.'); return; }
    if (!formData.studentName.trim()) { setErrorMsg('Student name is required.'); return; }
    if (!formData.rollNo.trim()) { setErrorMsg('Roll number is required.'); return; }
    setErrorMsg('');
    onSave(formData);
  };

  const inputCls = "w-full bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-h)] placeholder-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2014]/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden my-6">

        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-[var(--bg-subtle)] border-b border-[var(--border)]">
          <h3 className="text-base font-bold text-[var(--text-h)] flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[var(--accent)]" />
            {formData.id ? 'Edit Student Result Record' : 'Create New Student Result Entry'}
          </h3>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--border)] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger)] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Section 1: Student Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.15em]">1. Student Identification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">PRN Number</label>
                <input type="text" placeholder="e.g. 22210099" value={formData.prn}
                  onChange={e => set('prn', e.target.value)}
                  className={`${inputCls} font-mono`} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Student Full Name</label>
                <input type="text" placeholder="e.g. Rajesh Patil" value={formData.studentName}
                  onChange={e => set('studentName', e.target.value)}
                  className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Roll Number</label>
                <input type="text" placeholder="e.g. 311099" value={formData.rollNo}
                  onChange={e => set('rollNo', e.target.value)}
                  className={`${inputCls} font-mono`} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Engineering Branch</label>
                <select value={formData.branch} onChange={e => set('branch', e.target.value)}
                  className={inputCls}>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="AI & Data Science">AI &amp; Data Science</option>
                  <option value="Electronics & Telecom">Electronics &amp; Telecom</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Academic Year & Semester</label>
                <input type="text" value="Semester V (2025-2026)" disabled
                  className="w-full bg-[var(--code-bg)] border border-[var(--border)] text-[var(--text)] rounded-xl px-3 py-2 text-xs cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Section 2: Subject Marks */}
          <div className="space-y-3 pt-4 border-t border-[var(--border)]">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.15em]">
                2. Subject Marks (MSE 30% + ESE 70%)
              </h4>
              <span className="text-[10px] text-[var(--text)]">4 Core Subjects</span>
            </div>

            <div className="space-y-3">
              {formData.subjects.map((sub, idx) => (
                <div key={sub.subjectCode} className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="font-bold text-[var(--text-h)]">{sub.subjectCode}: {sub.subjectName}</span>
                    <span className="font-mono text-[var(--accent)] text-[11px] font-bold">{sub.credits} Credits</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[var(--text)] mb-1">MSE Marks (Max 30)</label>
                      <input type="number" min="0" max="30" step="0.5" value={sub.mseMarks}
                        onChange={e => setMark(idx, 'mseMarks', e.target.value)}
                        className="w-full bg-white border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-h)] font-mono focus:outline-none focus:border-[var(--accent)]" required />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text)] mb-1">ESE Marks (Max 70)</label>
                      <input type="number" min="0" max="70" step="0.5" value={sub.eseMarks}
                        onChange={e => setMark(idx, 'eseMarks', e.target.value)}
                        className="w-full bg-white border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-h)] font-mono focus:outline-none focus:border-[var(--accent-muted)]" required />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--bg-subtle)] transition-all">
              Cancel
            </button>
            <button type="submit"
              className="flex items-center gap-2 bg-[#2c2014] hover:bg-[#3e2c1a] text-[#e6dfd6] font-bold px-5 py-2 rounded-xl text-xs shadow-md transition-all">
              <Save className="w-4 h-4" />
              Save to MongoDB
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
