const API_BASE_URL = 'http://localhost:8080/api/results';

// Initial fallback mock dataset in case backend is initializing
const INITIAL_DEMO_DATA = [
  {
    id: 'demo-1',
    prn: '22210045',
    studentName: 'Aarav Sharma',
    rollNo: '311045',
    branch: 'Computer Engineering',
    semester: 5,
    academicYear: '2025-2026',
    subjects: [
      { subjectCode: 'CS301', subjectName: 'Web Technology', credits: 4, mseMarks: 27.5, eseMarks: 63.0, totalCombinedMark: 90.5, letterGrade: 'S', gradePoint: 10 },
      { subjectCode: 'CS302', subjectName: 'Database Management Systems', credits: 4, mseMarks: 26.0, eseMarks: 65.0, totalCombinedMark: 91.0, letterGrade: 'S', gradePoint: 10 },
      { subjectCode: 'CS303', subjectName: 'Software Engineering', credits: 3, mseMarks: 25.0, eseMarks: 58.5, totalCombinedMark: 83.5, letterGrade: 'A', gradePoint: 9 },
      { subjectCode: 'CS304', subjectName: 'Computer Networks', credits: 3, mseMarks: 28.0, eseMarks: 66.0, totalCombinedMark: 94.0, letterGrade: 'S', gradePoint: 10 }
    ],
    totalObtainedMarks: 359.0,
    totalMaxMarks: 400.0,
    totalPercentage: 89.75,
    sgpa: 9.79,
    resultStatus: 'PASS',
    overallGrade: 'First Class with Distinction'
  },
  {
    id: 'demo-2',
    prn: '22210089',
    studentName: 'Ananya Deshmukh',
    rollNo: '321089',
    branch: 'Information Technology',
    semester: 5,
    academicYear: '2025-2026',
    subjects: [
      { subjectCode: 'CS301', subjectName: 'Web Technology', credits: 4, mseMarks: 29.0, eseMarks: 68.0, totalCombinedMark: 97.0, letterGrade: 'S', gradePoint: 10 },
      { subjectCode: 'CS302', subjectName: 'Database Management Systems', credits: 4, mseMarks: 30.0, eseMarks: 69.0, totalCombinedMark: 99.0, letterGrade: 'S', gradePoint: 10 },
      { subjectCode: 'CS303', subjectName: 'Software Engineering', credits: 3, mseMarks: 28.5, eseMarks: 65.5, totalCombinedMark: 94.0, letterGrade: 'S', gradePoint: 10 },
      { subjectCode: 'CS304', subjectName: 'Computer Networks', credits: 3, mseMarks: 29.5, eseMarks: 67.0, totalCombinedMark: 96.5, letterGrade: 'S', gradePoint: 10 }
    ],
    totalObtainedMarks: 386.5,
    totalMaxMarks: 400.0,
    totalPercentage: 96.63,
    sgpa: 10.00,
    resultStatus: 'PASS',
    overallGrade: 'First Class with Distinction'
  },
  {
    id: 'demo-3',
    prn: '22210102',
    studentName: 'Priya Kulkarni',
    rollNo: '331102',
    branch: 'AI & Data Science',
    semester: 5,
    academicYear: '2025-2026',
    subjects: [
      { subjectCode: 'CS301', subjectName: 'Web Technology', credits: 4, mseMarks: 22.0, eseMarks: 53.0, totalCombinedMark: 75.0, letterGrade: 'B', gradePoint: 8 },
      { subjectCode: 'CS302', subjectName: 'Database Management Systems', credits: 4, mseMarks: 21.5, eseMarks: 51.0, totalCombinedMark: 72.5, letterGrade: 'B', gradePoint: 8 },
      { subjectCode: 'CS303', subjectName: 'Software Engineering', credits: 3, mseMarks: 23.0, eseMarks: 54.0, totalCombinedMark: 77.0, letterGrade: 'B', gradePoint: 8 },
      { subjectCode: 'CS304', subjectName: 'Computer Networks', credits: 3, mseMarks: 20.0, eseMarks: 48.0, totalCombinedMark: 68.0, letterGrade: 'C', gradePoint: 7 }
    ],
    totalObtainedMarks: 292.5,
    totalMaxMarks: 400.0,
    totalPercentage: 73.13,
    sgpa: 7.79,
    resultStatus: 'PASS',
    overallGrade: 'First Class'
  },
  {
    id: 'demo-4',
    prn: '22210250',
    studentName: 'Vikram Mehta',
    rollNo: '311250',
    branch: 'Computer Engineering',
    semester: 5,
    academicYear: '2025-2026',
    subjects: [
      { subjectCode: 'CS301', subjectName: 'Web Technology', credits: 4, mseMarks: 11.0, eseMarks: 24.0, totalCombinedMark: 35.0, letterGrade: 'F', gradePoint: 0 },
      { subjectCode: 'CS302', subjectName: 'Database Management Systems', credits: 4, mseMarks: 15.0, eseMarks: 32.0, totalCombinedMark: 47.0, letterGrade: 'P', gradePoint: 5 },
      { subjectCode: 'CS303', subjectName: 'Software Engineering', credits: 3, mseMarks: 14.0, eseMarks: 28.0, totalCombinedMark: 42.0, letterGrade: 'P', gradePoint: 5 },
      { subjectCode: 'CS304', subjectName: 'Computer Networks', credits: 3, mseMarks: 18.0, eseMarks: 36.0, totalCombinedMark: 54.0, letterGrade: 'D', gradePoint: 6 }
    ],
    totalObtainedMarks: 178.0,
    totalMaxMarks: 400.0,
    totalPercentage: 44.5,
    sgpa: 3.79,
    resultStatus: 'FAIL',
    overallGrade: 'Fail'
  },
  {
    id: 'demo-5',
    prn: '22210201',
    studentName: 'Neha Joshi',
    rollNo: '341201',
    branch: 'Electronics & Telecom',
    semester: 5,
    academicYear: '2025-2026',
    subjects: [
      { subjectCode: 'CS301', subjectName: 'Web Technology', credits: 4, mseMarks: 25.0, eseMarks: 60.0, totalCombinedMark: 85.0, letterGrade: 'A', gradePoint: 9 },
      { subjectCode: 'CS302', subjectName: 'Database Management Systems', credits: 4, mseMarks: 24.0, eseMarks: 59.0, totalCombinedMark: 83.0, letterGrade: 'A', gradePoint: 9 },
      { subjectCode: 'CS303', subjectName: 'Software Engineering', credits: 3, mseMarks: 26.0, eseMarks: 62.0, totalCombinedMark: 88.0, letterGrade: 'A', gradePoint: 9 },
      { subjectCode: 'CS304', subjectName: 'Computer Networks', credits: 3, mseMarks: 27.0, eseMarks: 61.0, totalCombinedMark: 88.0, letterGrade: 'A', gradePoint: 9 }
    ],
    totalObtainedMarks: 344.0,
    totalMaxMarks: 400.0,
    totalPercentage: 86.0,
    sgpa: 9.00,
    resultStatus: 'PASS',
    overallGrade: 'First Class with Distinction'
  }
];

let localCache = [...INITIAL_DEMO_DATA];

export const calculateSubjectGrade = (mse, ese) => {
  const mseMarks = parseFloat(mse) || 0;
  const eseMarks = parseFloat(ese) || 0;
  const total = Math.round((mseMarks + eseMarks) * 100) / 100;
  let letterGrade = 'F';
  let gradePoint = 0;

  if (total >= 90) { letterGrade = 'S'; gradePoint = 10; }
  else if (total >= 80) { letterGrade = 'A'; gradePoint = 9; }
  else if (total >= 70) { letterGrade = 'B'; gradePoint = 8; }
  else if (total >= 60) { letterGrade = 'C'; gradePoint = 7; }
  else if (total >= 50) { letterGrade = 'D'; gradePoint = 6; }
  else if (total >= 40) { letterGrade = 'P'; gradePoint = 5; }
  else { letterGrade = 'F'; gradePoint = 0; }

  return { total, letterGrade, gradePoint };
};

export const computeResultMetrics = (studentData) => {
  const subjects = (studentData.subjects || []).map(sub => {
    const calc = calculateSubjectGrade(sub.mseMarks, sub.eseMarks);
    return {
      ...sub,
      totalCombinedMark: calc.total,
      letterGrade: calc.letterGrade,
      gradePoint: calc.gradePoint
    };
  });

  let totalMarksSum = 0;
  let weightedPointsSum = 0;
  let totalCreditsSum = 0;
  let hasFail = false;

  subjects.forEach(sub => {
    totalMarksSum += sub.totalCombinedMark;
    weightedPointsSum += (sub.gradePoint * sub.credits);
    totalCreditsSum += sub.credits;
    if (sub.letterGrade === 'F' || sub.totalCombinedMark < 40) {
      hasFail = true;
    }
  });

  const totalMaxMarks = subjects.length * 100;
  const totalPercentage = totalMaxMarks > 0 ? Math.round((totalMarksSum / totalMaxMarks * 100) * 100) / 100 : 0;
  const sgpa = totalCreditsSum > 0 ? Math.round((weightedPointsSum / totalCreditsSum) * 100) / 100 : 0;
  
  let resultStatus = hasFail ? 'FAIL' : 'PASS';
  let overallGrade = 'Fail';
  if (!hasFail) {
    if (sgpa >= 8.0) overallGrade = 'First Class with Distinction';
    else if (sgpa >= 6.75) overallGrade = 'First Class';
    else if (sgpa >= 6.0) overallGrade = 'Higher Second Class';
    else overallGrade = 'Pass Class';
  }

  return {
    ...studentData,
    subjects,
    totalObtainedMarks: Math.round(totalMarksSum * 100) / 100,
    totalMaxMarks,
    totalPercentage,
    sgpa,
    resultStatus,
    overallGrade
  };
};

export const fetchAllResults = async (searchQuery = '', branch = '') => {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (branch && branch !== 'ALL') params.append('branch', branch);

    const res = await fetch(`${API_BASE_URL}?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      localCache = data;
      return { data, isBackendConnected: true };
    }
  } catch (err) {
    console.warn('Backend API disconnected. Operating in client fallback mode.', err.message);
  }

  // Fallback filter over local memory
  let filtered = [...localCache];
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(item => 
      item.studentName.toLowerCase().includes(q) || 
      item.prn.toLowerCase().includes(q) ||
      item.rollNo.toLowerCase().includes(q)
    );
  }
  if (branch && branch !== 'ALL') {
    filtered = filtered.filter(item => item.branch.toLowerCase() === branch.toLowerCase());
  }
  return { data: filtered, isBackendConnected: false };
};

export const saveResultApi = async (studentResultData) => {
  const calculated = computeResultMetrics(studentResultData);
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calculated)
    });
    if (res.ok) {
      const saved = await res.json();
      return { data: saved, isBackendConnected: true };
    }
  } catch (err) {
    console.warn('Backend offline, saving locally in client cache', err.message);
  }

  const newItem = { ...calculated, id: 'local-' + Date.now() };
  localCache.unshift(newItem);
  return { data: newItem, isBackendConnected: false };
};

export const updateResultApi = async (id, studentResultData) => {
  const calculated = computeResultMetrics(studentResultData);
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calculated)
    });
    if (res.ok) {
      const updated = await res.json();
      return { data: updated, isBackendConnected: true };
    }
  } catch (err) {
    console.warn('Backend offline, updating local cache', err.message);
  }

  localCache = localCache.map(item => item.id === id ? { ...calculated, id } : item);
  return { data: { ...calculated, id }, isBackendConnected: false };
};

export const deleteResultApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      localCache = localCache.filter(item => item.id !== id);
      return { success: true, isBackendConnected: true };
    }
  } catch (err) {
    console.warn('Backend offline, deleting locally', err.message);
  }

  localCache = localCache.filter(item => item.id !== id);
  return { success: true, isBackendConnected: false };
};
