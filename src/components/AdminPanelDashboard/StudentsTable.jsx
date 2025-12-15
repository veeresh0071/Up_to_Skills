import React, { useEffect, useMemo, useState } from 'react';

function downloadCSV(filename, rows) {
  if (!rows || rows.length === 0) return;
  const header = Object.keys(rows[0] || {}).join(',') + '\n';
  const csv = rows.map(r => Object.values(r).map(v => `"${String(v ?? '')}"`).join(',')).join('\n');
  const blob = new Blob([header + csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StudentsTable({ isDarkMode, onNavigateSection }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    let mounted = true;
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/students');
        const data = await res.json();
        if (!mounted) return;
        if (data && data.success && Array.isArray(data.data)) setStudents(data.data);
        else if (Array.isArray(data)) setStudents(data);
        else setStudents([]);
      } catch (err) {
        console.error('Error fetching students:', err);
        if (mounted) setStudents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchStudents();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s => (
      String(s.full_name || s.name || '').toLowerCase().includes(q) ||
      String(s.email || '').toLowerCase().includes(q) ||
      String(s.phone || '').toLowerCase().includes(q) ||
      String(s.id || '').includes(q)
    ));
  }, [students, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > pageCount) setPage(1); }, [pageCount]);

  const pageData = filtered.slice((page-1)*pageSize, page*pageSize);

  return (
    <main className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} p-4 sm:p-6 min-h-screen`}> 
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateSection && onNavigateSection('dashboard')}
            className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">All Students</h2>
          <span className="text-sm text-gray-500">({students.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone..."
            className="px-3 py-2 rounded-md border bg-transparent text-sm outline-none"
          />
          <button
            onClick={() => downloadCSV('students.csv', filtered)}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            disabled={filtered.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({length:6}).map((_,i)=> (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          ))}
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-md shadow-sm border ${isDarkMode ? 'border-gray-700' : ''}`}>
          <table className="min-w-full table-auto border-collapse">
            <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr className={`text-left border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
                <th className={`px-4 py-3 ${isDarkMode ? 'text-gray-100' : ''}`}>ID</th>
                <th className={`px-4 py-3 ${isDarkMode ? 'text-gray-100' : ''}`}>Name</th>
                <th className={`px-4 py-3 ${isDarkMode ? 'text-gray-100' : ''}`}>Email</th>
                <th className={`px-4 py-3 ${isDarkMode ? 'text-gray-100' : ''}`}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center">No students found.</td></tr>
              ) : pageData.map((s) => (
                <tr key={s.id} className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3 align-top">{s.id}</td>
                  <td className="px-4 py-3 align-top">{s.full_name || s.name}</td>
                  <td className="px-4 py-3 align-top">{s.email}</td>
                  <td className="px-4 py-3 align-top">{s.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className={`${isDarkMode ? 'text-gray-300' : 'text-sm text-gray-500'}`}>Showing {Math.min((page-1)*pageSize+1, filtered.length)}-{Math.min(page*pageSize, filtered.length)} of {filtered.length}</div>
        <div className="flex items-center gap-2">
          <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className={`px-3 py-1 rounded border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : ''}`}>Prev</button>
          <span className={`px-2 py-1 border rounded ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : ''}`}>{page} / {pageCount}</span>
          <button disabled={page===pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))} className={`px-3 py-1 rounded border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : ''}`}>Next</button>
        </div>
      </div>
    </main>
  );
}
