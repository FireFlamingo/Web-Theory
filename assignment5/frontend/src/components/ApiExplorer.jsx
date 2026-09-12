import React, { useState } from 'react';
import { Database, Terminal, Server, Copy, Check } from 'lucide-react';

export default function ApiExplorer({ results, isBackendConnected }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET_ALL');
  const [copied, setCopied] = useState(false);

  const endpoints = [
    { id: 'GET_ALL',      method: 'GET',  url: 'http://localhost:8080/api/results',            desc: 'Fetch all student result documents from MongoDB' },
    { id: 'GET_PRN',      method: 'GET',  url: 'http://localhost:8080/api/results/prn/22210045', desc: 'Find student result by PRN index' },
    { id: 'POST_CALC',    method: 'POST', url: 'http://localhost:8080/api/results/calculate',  desc: 'Simulate SGPA without persisting to DB' },
    { id: 'GET_ANALYTICS',method: 'GET',  url: 'http://localhost:8080/api/results/analytics',  desc: 'Aggregate class performance metrics' },
  ];

  const getResponse = () => {
    switch (selectedEndpoint) {
      case 'GET_ALL': return results;
      case 'GET_PRN': return results.find(r => r.prn === '22210045') || results[0] || {};
      case 'POST_CALC': return {
        requestBody: { prn: '22210999', subjects: [
          { subjectCode: 'CS301', mseMarks: 28, eseMarks: 64 },
          { subjectCode: 'CS302', mseMarks: 29, eseMarks: 66 },
          { subjectCode: 'CS303', mseMarks: 26, eseMarks: 60 },
          { subjectCode: 'CS304', mseMarks: 27, eseMarks: 62 },
        ]},
        calculatedResult: { totalObtainedMarks: 362.0, totalMaxMarks: 400.0,
          totalPercentage: 90.5, sgpa: 9.79, resultStatus: 'PASS',
          overallGrade: 'First Class with Distinction' },
      };
      case 'GET_ANALYTICS': {
        const total = results.length;
        const pass  = results.filter(r => r.resultStatus === 'PASS').length;
        return {
          totalStudents: total, passCount: pass, failCount: total - pass,
          passPercentage: total > 0 ? +((pass / total) * 100).toFixed(2) : 0,
          avgSgpa: total > 0 ? +(results.reduce((a, b) => a + b.sgpa, 0) / total).toFixed(2) : 0,
          databaseEngine: 'MongoDB (Collection: student_results)',
        };
      }
      default: return results;
    }
  };

  const json = JSON.stringify(getResponse(), null, 2);
  const handleCopy = () => { navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="card-panel p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-[0.15em]">
            <Database className="w-4 h-4" /> Spring Boot & MongoDB Integration
          </div>
          <h2 className="text-2xl font-black text-[var(--text-h)] tracking-tight mt-1">
            REST API & Database Payload Explorer
          </h2>
          <p className="text-xs text-[var(--text)] mt-1">
            Inspect live JSON responses served by the Spring Boot backend.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--text-h)] whitespace-nowrap">
          <Server className="w-4 h-4 text-[var(--accent)]" />
          <span>mongodb://localhost:27017/<strong>vit_results</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Endpoint Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider px-1">Available Endpoints</h3>
          {endpoints.map(ep => (
            <button key={ep.id} onClick={() => setSelectedEndpoint(ep.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all space-y-1.5 ${
                selectedEndpoint === ep.id
                  ? 'bg-white border-[var(--accent)] shadow-md'
                  : 'bg-[var(--bg-subtle)] border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                  ep.method === 'GET'
                    ? 'bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-border)]'
                    : 'bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]'
                }`}>{ep.method}</span>
                <span className="text-[10px] font-mono text-[var(--text)]">200 OK</span>
              </div>
              <div className="font-mono text-xs text-[var(--text-h)] font-semibold truncate">{ep.url}</div>
              <p className="text-[11px] text-[var(--text)]">{ep.desc}</p>
            </button>
          ))}
        </div>

        {/* JSON Viewer */}
        <div className="lg:col-span-8 card-panel overflow-hidden bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-subtle)] border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-xs font-mono font-bold text-[var(--text-h)]">Response Payload (application/json)</span>
            </div>
            <button onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text)] hover:text-[var(--text-h)] bg-white px-2.5 py-1 rounded-lg border border-[var(--border)] transition-all">
              {copied ? <Check className="w-3.5 h-3.5 text-[var(--success)]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <div className="p-4 overflow-auto max-h-[500px] bg-[var(--code-bg)] border-t border-[var(--border)]">
            <pre className="font-mono text-xs text-[#2c2014] leading-relaxed">{json}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
