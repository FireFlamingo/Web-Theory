import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import MarksheetModal from './components/MarksheetModal';
import ResultCalculator from './components/ResultCalculator';
import StudentFormModal from './components/StudentFormModal';
import ApiExplorer from './components/ApiExplorer';
import { fetchAllResults, saveResultApi, updateResultApi, deleteResultApi } from './api/resultApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [results, setResults] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedStudentMarksheet, setSelectedStudentMarksheet] = useState(null);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchAllResults();
    setResults(res.data || []);
    setIsBackendConnected(res.isBackendConnected);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveStudent = async (formData) => {
    if (formData.id) await updateResultApi(formData.id, formData);
    else await saveResultApi(formData);
    setIsFormModalOpen(false);
    setStudentToEdit(null);
    await loadData();
    setActiveTab('records');
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Delete this student result record?')) {
      await deleteResultApi(id);
      await loadData();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col font-sans selection:bg-[var(--accent)] selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendConnected={isBackendConnected}
        totalCount={results.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-[var(--text)]">Loading VIT Semester Results from MongoDB…</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard'   && <Dashboard results={results} onNavigateToRecords={() => setActiveTab('records')} />}
            {activeTab === 'records'     && <StudentList results={results}
                onViewMarksheet={s => setSelectedStudentMarksheet(s)}
                onEditStudent={s => { setStudentToEdit(s); setIsFormModalOpen(true); }}
                onDeleteStudent={handleDeleteStudent}
                onOpenAddModal={() => { setStudentToEdit(null); setIsFormModalOpen(true); }} />}
            {activeTab === 'calculator'  && <ResultCalculator />}
            {activeTab === 'add'         && <StudentFormModal initialData={null}
                onClose={() => setActiveTab('records')} onSave={handleSaveStudent} />}
            {activeTab === 'api'         && <ApiExplorer results={results} isBackendConnected={isBackendConnected} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text)] space-y-1 no-print">
        <p className="font-semibold text-[var(--text-h)]">
          Vishwakarma Institute of Technology · Department of Computer Engineering
        </p>
        <p className="text-[11px]">
          React · Spring Boot REST API · Spring Data MongoDB · Tailwind CSS
        </p>
      </footer>

      {selectedStudentMarksheet && (
        <MarksheetModal student={selectedStudentMarksheet} onClose={() => setSelectedStudentMarksheet(null)} />
      )}
      {isFormModalOpen && (
        <StudentFormModal
          initialData={studentToEdit}
          onClose={() => { setIsFormModalOpen(false); setStudentToEdit(null); }}
          onSave={handleSaveStudent}
        />
      )}
    </div>
  );
}
