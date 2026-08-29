import React from 'react';
import { Award, Users, TrendingUp, CheckCircle, ChevronRight, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function Dashboard({ results, onNavigateToRecords }) {
  const totalStudents = results.length;
  const passCount = results.filter(r => r.resultStatus === 'PASS').length;
  const failCount = totalStudents - passCount;
  const passPercentage = totalStudents > 0 ? ((passCount / totalStudents) * 100).toFixed(1) : 0;
  const totalSgpa = results.reduce((acc, r) => acc + (r.sgpa || 0), 0);
  const avgSgpa = totalStudents > 0 ? (totalSgpa / totalStudents).toFixed(2) : '0.00';
  const maxSgpa = totalStudents > 0 ? Math.max(...results.map(r => r.sgpa || 0)).toFixed(2) : '0.00';
  const distinctionCount = results.filter(r => r.overallGrade === 'First Class with Distinction').length;
  const firstClassCount = results.filter(r => r.overallGrade === 'First Class').length;

  // Grade Distribution for Pie
  const gradeCounts = {};
  results.forEach(r => {
    const g = r.overallGrade || 'Unknown';
    gradeCounts[g] = (gradeCounts[g] || 0) + 1;
  });
  const gradeColors = {
    'First Class with Distinction': '#9c6b30',
    'First Class': '#b8945e',
    'Higher Second Class': '#c9aa82',
    'Pass Class': '#5a7c52',
    'Fail': '#a64a3c'
  };
  const pieData = Object.keys(gradeCounts).map(g => ({
    name: g, value: gradeCounts[g], color: gradeColors[g] || '#8a7e72'
  }));

  // Subject Average for Bar Chart
  const subjectStats = {
    'CS301': { code: 'CS301', name: 'Web Technology',    mseSum: 0, eseSum: 0, count: 0 },
    'CS302': { code: 'CS302', name: 'DBMS',              mseSum: 0, eseSum: 0, count: 0 },
    'CS303': { code: 'CS303', name: 'Software Engg',     mseSum: 0, eseSum: 0, count: 0 },
    'CS304': { code: 'CS304', name: 'Networks',          mseSum: 0, eseSum: 0, count: 0 }
  };
  results.forEach(r => {
    (r.subjects || []).forEach(sub => {
      if (subjectStats[sub.subjectCode]) {
        subjectStats[sub.subjectCode].mseSum += sub.mseMarks || 0;
        subjectStats[sub.subjectCode].eseSum += sub.eseMarks || 0;
        subjectStats[sub.subjectCode].count += 1;
      }
    });
  });
  const subjectChartData = Object.values(subjectStats).map(s => ({
    name: s.code,
    fullName: s.name,
    avgMSE: s.count > 0 ? +(s.mseSum / s.count).toFixed(1) : 0,
    avgESE: s.count > 0 ? +(s.eseSum / s.count).toFixed(1) : 0,
  }));

  const tooltipStyle = {
    backgroundColor: '#faf8f5',
    borderColor: '#e6dfd6',
    borderRadius: '10px',
    color: '#2c2014',
    boxShadow: '0 10px 15px -3px rgba(44,32,20,0.08)'
  };

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="card-panel p-7 sm:p-9 relative overflow-hidden bg-[#2c2014]">
        {/* Subtle texture layer */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_#d4a95e_0%,_transparent_60%)]" />
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#b8945e] uppercase tracking-[0.18em]">
            <Award className="w-4 h-4" /> Academic Year 2025-26 · Department Analytics
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#f5f1ec] tracking-tight leading-tight">
            Semester V Result Analytics Dashboard
          </h2>
          <p className="text-sm text-[#c9aa82] leading-relaxed max-w-2xl">
            Real-time evaluation for VIT Pune. Marks are weighted as{' '}
            <strong className="text-[#e6dfd6]">MSE (30%)</strong> and{' '}
            <strong className="text-[#e6dfd6]">ESE (70%)</strong> across 4 core engineering courses.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Candidates */}
        <div className="card-panel card-panel-hover p-5 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider">Total Candidates</p>
              <h3 className="text-4xl font-black text-[var(--text-h)] mt-1 font-mono">{totalStudents}</h3>
            </div>
            <div className="p-3 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border)]">
              <Users className="w-6 h-6 text-[var(--accent)]" />
            </div>
          </div>
          <p className="text-xs text-[var(--text)] mt-3">Enrolled across 4 branches</p>
        </div>

        {/* Pass Rate */}
        <div className="card-panel card-panel-hover p-5 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider">Class Pass Rate</p>
              <h3 className="text-4xl font-black text-[var(--success)] mt-1 font-mono">{passPercentage}%</h3>
            </div>
            <div className="p-3 bg-[var(--success-bg)] rounded-2xl border border-[var(--success-border)]">
              <CheckCircle className="w-6 h-6 text-[var(--success)]" />
            </div>
          </div>
          <p className="text-xs text-[var(--text)] mt-3">
            <span className="text-[var(--success)] font-bold">{passCount} passed</span> ·{' '}
            <span className="text-[var(--danger)] font-bold">{failCount} failed</span>
          </p>
        </div>

        {/* Average SGPA */}
        <div className="card-panel card-panel-hover p-5 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider">Average Class SGPA</p>
              <h3 className="text-4xl font-black text-[var(--accent)] mt-1 font-mono">
                {avgSgpa} <span className="text-sm font-normal text-[var(--text)]">/ 10</span>
              </h3>
            </div>
            <div className="p-3 bg-[var(--accent-bg)] rounded-2xl border border-[var(--accent-border)]">
              <TrendingUp className="w-6 h-6 text-[var(--accent)]" />
            </div>
          </div>
          <p className="text-xs text-[var(--text)] mt-3">
            Highest recorded: <strong className="text-[var(--text-h)]">{maxSgpa}</strong>
          </p>
        </div>

        {/* Distinction */}
        <div className="card-panel card-panel-hover p-5 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider">Distinction (SGPA ≥ 8.0)</p>
              <h3 className="text-4xl font-black text-[var(--text-h)] mt-1 font-mono">{distinctionCount}</h3>
            </div>
            <div className="p-3 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border)]">
              <Award className="w-6 h-6 text-[var(--accent)]" />
            </div>
          </div>
          <p className="text-xs text-[var(--text)] mt-3">
            First Class (6.75–7.99): <strong className="text-[var(--text-h)]">{firstClassCount}</strong>
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 card-panel p-6 bg-white space-y-4">
          <div>
            <h3 className="text-base font-bold text-[var(--text-h)] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--accent)]" />
              Subject Performance: Avg MSE (30%) vs ESE (70%)
            </h3>
            <p className="text-xs text-[var(--text)] mt-0.5">Average marks per subject across all students</p>
          </div>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#8a7e72" fontSize={12} tickLine={false} />
                <YAxis stroke="#8a7e72" fontSize={12} tickLine={false} domain={[0, 70]} />
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(v, n) => [v + ' marks', n === 'avgMSE' ? 'Avg MSE (Max 30)' : 'Avg ESE (Max 70)']} />
                <Bar dataKey="avgMSE" fill="#9c6b30" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="avgESE" fill="#c9aa82" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-[var(--text)] font-medium pt-1 border-t border-[var(--border)]">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#9c6b30]"></span> MSE Average (Max 30)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#c9aa82]"></span> ESE Average (Max 70)
            </span>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card-panel p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--text-h)] flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[var(--accent)]" />
              Grade Distribution
            </h3>
            <p className="text-xs text-[var(--text)] mt-0.5">Classification breakdown across class</p>
          </div>
          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
                  paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs pt-2 border-t border-[var(--border)]">
            {pieData.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-0.5">
                <span className="flex items-center gap-2 text-[var(--text)]">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-[var(--text-h)]">
                  {item.value} ({((item.value / totalStudents) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Info & CTA */}
      <div className="card-panel p-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-base font-bold text-[var(--text-h)]">VIT Semester V — Subject Credits & Weightage</h4>
            <p className="text-xs text-[var(--text)] mt-1">
              Subject Mark (100) = MSE (30%) + ESE (70%). Minimum passing threshold is 40% per course.
            </p>
          </div>
          <button
            onClick={onNavigateToRecords}
            className="flex items-center justify-center gap-2 bg-[#2c2014] hover:bg-[#3e2c1a] text-[#e6dfd6] font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md whitespace-nowrap"
          >
            View All Student Marksheets <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { code: 'CS301', name: 'Web Technology',             credits: 4, color: 'bg-[#9c6b30]' },
            { code: 'CS302', name: 'Database Management Systems',credits: 4, color: 'bg-[#b8945e]' },
            { code: 'CS303', name: 'Software Engineering',       credits: 3, color: 'bg-[#5a7c52]' },
            { code: 'CS304', name: 'Computer Networks',          credits: 3, color: 'bg-[#a64a3c]' },
          ].map(sub => (
            <div key={sub.code} className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
              <span className={`text-[10px] font-bold text-white ${sub.color} px-2 py-0.5 rounded uppercase`}>
                {sub.code} · {sub.credits} Credits
              </span>
              <h5 className="font-bold text-[var(--text-h)] mt-2 text-sm">{sub.name}</h5>
              <p className="text-xs text-[var(--text)] mt-1">MSE Max: 30 | ESE Max: 70</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
