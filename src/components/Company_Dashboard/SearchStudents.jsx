import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { Search, Loader, User, Phone, Linkedin, Github, ArrowLeft, Filter, RotateCcw, Clock, Trash2 } from "lucide-react";
import Footer from "../AboutPage/Footer";
import { Button } from "./ui/button";
import StudentCard from "./StudentCard";
import { useTheme } from "../../context/ThemeContext";

const DOMAINS = [
  "All Domains",
  "Web Development",
  "AI/ML",
  "Data Science",
  "Mobile Development",
  "DevOps",
  "UI/UX Design",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "Game Development",
  "Other",
];

export default function SearchStudents() {
  const { darkMode } = useTheme();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [filterSuggestions, setFilterSuggestions] = useState([]);
  const [showFilterSuggestions, setShowFilterSuggestions] = useState(false);
  const [filters, setFilters] = useState({ name: "", domain: "All Domains" });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const filtersPanelRef = useRef(null);
  const filterToggleRef = useRef(null);

  // Close filters when clicking outside or pressing Escape
  useEffect(() => {
    const handlePointer = (e) => {
      if (!showFiltersPanel) return;
      const panel = filtersPanelRef.current;
      const toggle = filterToggleRef.current;
      if (!panel) return;
      const target = e.target;
      if (panel.contains(target) || (toggle && toggle.contains(target))) return;
      setShowFiltersPanel(false);
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setShowFiltersPanel(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showFiltersPanel]);

  // Simple normalizers
  const normalizeName = (s) => (s?.student_name || s?.full_name || s?.profile_full_name || s?.name || "").toString().trim();
  const normalizeDomains = (s) => {
    try {
      if (!s) return [];
      if (Array.isArray(s.domains_of_interest)) return s.domains_of_interest.map((d) => d?.toString().trim()).filter(Boolean);
      if (typeof s.domains_of_interest === "string") {
        const t = s.domains_of_interest.trim();
        if (!t) return [];
        if (t.startsWith("[")) return JSON.parse(t);
        return t.split(/[,|]/).map((d) => d.trim()).filter(Boolean);
      }
      if (Array.isArray(s.domainsOfInterest)) return s.domainsOfInterest.map((d) => d?.toString().trim()).filter(Boolean);
      if (typeof s.domainsOfInterest === "string") return s.domainsOfInterest.split(/[,|]/).map((d) => d.trim()).filter(Boolean);
    } catch (e) {
      return [];
    }
    const fallback = s?.othersDomain || s?.others_domain || "";
    return fallback ? [fallback.toString().trim()] : [];
  };

  const dedupe = (items) => {
    const seen = new Set();
    const out = [];
    items.forEach((it) => {
      const v = it?.toString().trim();
      if (!v) return;
      const k = v.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        out.push(v);
      }
    });
    return out;
  };

  const suggestionPool = useMemo(() => {
    const nameSamples = students.map(normalizeName).filter(Boolean);
    const domainSamples = students.flatMap((st) => normalizeDomains(st)).filter(Boolean);
    const aiSnips = students
      .map((st) => (st.ai_skill_summary || st.ai_skills || "").toString().trim())
      .filter(Boolean)
      .map((r) => r.split(/[.,]/)[0].trim())
      .filter(Boolean);
    return dedupe([...nameSamples, ...domainSamples, ...aiSnips]);
  }, [students]);

  const computeSuggestions = (q) => {
    const t = q.trim().toLowerCase();
    if (!t) return suggestionPool.slice(0, 8);
    return suggestionPool.filter((it) => it.toLowerCase().includes(t)).slice(0, 8);
  };

  // Fetch students on mount
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/students/all-students");
        const data = res.data;
        const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (!mounted) return;
        // Debug: inspect duplicates returned by the API (grouped by normalized name)
        try {
          const byName = rows.reduce((m, r) => {
            const name = (r.full_name || r.student_name || r.profile_full_name || r.name || "").toString().trim().toLowerCase();
            (m[name] = m[name] || []).push(r);
            return m;
          }, {});
          Object.entries(byName).forEach(([name, arr]) => {
            if (arr.length > 1) {
              console.groupCollapsed(`Duplicate name: ${name} (${arr.length})`);
              arr.forEach(a => console.log('id:', a.user_detail_id || a.id || a.student_id, 'email/contact:', a.email || a.contact_email || a.contact_number || a.phone || a.contact_number || '—', a));
              console.groupEnd();
            }
          });
        } catch (e) {
          // ignore debug errors in production
        }
        // normalize and dedupe preferring email -> phone -> id -> name
        const seen = new Set();
        const normalized = [];
        const emailFor = (r) => (r.email || r.email_address || r.contact_email || "").toString().trim().toLowerCase();
        const phoneFor = (r) => (r.contact_number || r.phone || r.phone_number || "").toString().trim().toLowerCase();
        for (const r of rows) {
          const email = emailFor(r);
          const phone = phoneFor(r);
          const id = r.user_detail_id || r.id || r.student_id || null;
          const nameKey = (r.full_name || r.student_name || r.profile_full_name || r.name || "").toString().trim().toLowerCase();
          const key = email ? `email:${email}` : (phone ? `phone:${phone}` : (id ? `id:${String(id)}` : `name:${nameKey}`));
          if (seen.has(key)) continue;
          seen.add(key);
          normalized.push(r);
        }
        if (normalized.length !== rows.length) console.warn(`Deduped students: removed ${rows.length - normalized.length} duplicate entries (preferring email/phone/id)`);
        setStudents(normalized);
        setFilteredStudents(normalized);
      } catch (e) {
        console.error(e);
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, []);

  // Fetch interviews once to allow StudentCard instances to read from a single source
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/interviews');
        const data = res.data;
        const rows = Array.isArray(data) ? data : (data?.data || []);
        if (!mounted) return;
        setInterviews(rows);
      } catch (e) {
        console.error('Error fetching interviews (parent):', e);
        setInterviews([]);
      }
    };
    run();
    return () => { mounted = false; };
  }, []);

  // Filtering
  useEffect(() => {
    let out = students;
    if (filters.name.trim()) {
      const q = filters.name.trim().toLowerCase();
      out = out.filter((s) => ((s.student_name || s.full_name || s.name || s.displayName || "") + "").toLowerCase().includes(q));
    }
    if (filters.domain !== "All Domains") {
      out = out.filter((s) => {
        const domains = (normalizeDomains(s) || []).join(" ").toLowerCase();
        const others = (s?.othersDomain || s?.others_domain || "").toString().toLowerCase();
        return (domains + " " + others).includes(filters.domain.toLowerCase());
      });
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      out = out.filter((s) => {
        const name = ((s.student_name || s.full_name || s.name || s.displayName || "") + "").toLowerCase();
        const domains = (normalizeDomains(s) || []).join(" ").toLowerCase();
        const ai = (s.ai_skill_summary || s.ai_skills || s.ai || "").toString().toLowerCase();
        const others = (s.othersDomain || s.others_domain || "").toString().toLowerCase();
        return name.includes(q) || domains.includes(q) || ai.includes(q) || others.includes(q);
      });
    }
    setFilteredStudents(out);
  }, [searchQuery, filters, students]);

  useEffect(() => {
    const q = searchQuery || "";
    const t = q.trim().toLowerCase();
    if (!t) {
      // don't show suggestions when input is empty
      setSearchSuggestions([]);
      return;
    }

    // include matching history entries first
    const historyMatches = (searchHistory || []).filter((h) => h.toLowerCase().includes(t));
    const computed = computeSuggestions(q);
    setSearchSuggestions(dedupe([...historyMatches, ...computed]));
  }, [searchQuery, suggestionPool, searchHistory]);
  useEffect(() => { setFilterSuggestions(computeSuggestions(filters.name)); }, [filters.name, suggestionPool]);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("searchHistory");
      const arr = raw ? JSON.parse(raw) : [];
      setSearchHistory(Array.isArray(arr) ? arr : []);
    } catch (e) {
      setSearchHistory([]);
    }
  }, []);

  const saveHistory = (q) => {
    if (!q) return;
    try {
      const cleaned = q.toString().trim();
      if (!cleaned) return;
      const next = [cleaned, ...(searchHistory.filter((h) => h.toLowerCase() !== cleaned.toLowerCase()))].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(next));
      setSearchHistory(next);
    } catch (e) {
      // ignore
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem("searchHistory");
    } catch (e) {
      // ignore
    }
    setSearchHistory([]);
  };

  const renderHighlighted = (text, q) => {
    if (!q) return text;
    const t = text?.toString() || "";
    const qi = q.toString().toLowerCase();
    const idx = t.toLowerCase().indexOf(qi);
    if (idx === -1) return t;
    const before = t.slice(0, idx);
    const match = t.slice(idx, idx + qi.length);
    const after = t.slice(idx + qi.length);
    return (
      <>
        {before}
        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-0.5 rounded">{match}</span>
        {after}
      </>
    );
  };

  const fetchStudentDetails = async (id) => {
    if (!id) return;
    try {
      setDetailsLoading(true);
      const res = await axios.get(`http://localhost:5000/api/students/${id}/details`);
      const data = res.data;
      if (data?.success) {
        const payload = data.data || {};
        const profile = payload.profile || {};
        setStudentDetails({
          // profile fields
          ...profile,
          full_name: profile.profile_full_name || profile.full_name || profile.student_name || "",
          student_id: profile.id || profile.student_id || id,
          contact_number: profile.contact_number || profile.phone || profile.phone_number,
          linkedin_url: profile.linkedin_url,
          github_url: profile.github_url,
          ai_skill_summary: profile.ai_skill_summary || profile.ai_skills || "",
          domainsOfInterest: profile.domains_of_interest || profile.domainsOfInterest || [],
          othersDomain: profile.others_domain || profile.othersDomain || "",
          // collections
          projects: Array.isArray(payload.projects) ? payload.projects : [],
          badges: Array.isArray(payload.badges) ? payload.badges : [],
          enrollments: Array.isArray(payload.enrollments) ? payload.enrollments : [],
          attendance: Array.isArray(payload.attendance) ? payload.attendance : [],
          stats: payload.stats || {},
        });
        setSelectedStudent(id);
        // If a consumer provided a selection callback, don't auto-open; leave it to consumer
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleBackToList = () => { setSelectedStudent(null); setStudentDetails(null); };
  const onFilterChange = (k, v) => setFilters((p) => ({ ...p, [k]: v }));
  const onClearFilters = () => setFilters({ name: "", domain: "All Domains" });
  const handleSearchSuggestionSelect = (v) => { setSearchQuery(v); saveHistory(v); setShowSearchSuggestions(false); };
  const handleFilterSuggestionSelect = (v) => { setFilters((p) => ({ ...p, name: v })); setShowFilterSuggestions(false); };

  // Details view
  if (selectedStudent && studentDetails) {
    return (
      <div className={`p-6 min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto">
          <button onClick={handleBackToList} className={`flex items-center gap-2 mb-6 text-lg hover:text-gray-700 transition-colors ${darkMode ? "text-gray-100" : "text-gray-900"}`}><ArrowLeft className="w-5 h-5"/><b>Back to Students List</b></button>
          <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            {detailsLoading ? (
              <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 animate-spin text-primary"/></div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full"><User className="w-8 h-8 text-white"/></div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">{studentDetails.full_name}</h1>
                      <p className="text-white/80">Student ID: {studentDetails.student_id}</p>
                    </div>
                  </div>
                </div>
                <div className={`p-6 space-y-6 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {studentDetails.contact_number && (<div className="flex items-center gap-3"><Phone className={`w-5 h-5 ${darkMode ? "text-gray-300" : "text-gray-400"}`}/><span>{studentDetails.contact_number}</span></div>)}
                      {studentDetails.linkedin_url && (<div className="flex items-center gap-3"><Linkedin className="w-5 h-5 text-blue-600"/><a href={studentDetails.linkedin_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">LinkedIn Profile</a></div>)}
                      {studentDetails.github_url && (<div className="flex items-center gap-3"><Github className={`w-5 h-5 ${darkMode ? "text-white" : "text-gray-800"}`}/><a href={studentDetails.github_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">GitHub Profile</a></div>)}
                    </div>
                  </div>
                  {(studentDetails.domainsOfInterest || studentDetails.othersDomain) && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Domains of Interest</h2>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(studentDetails.domainsOfInterest) ? studentDetails.domainsOfInterest.map((d,i)=>(<span key={i} className="dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">{d}</span>)) : (studentDetails.domainsOfInterest||"").toString().split(",").map((d,i)=> d.trim()? <span key={i} className="dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">{d}</span>: null)}
                        {studentDetails.othersDomain && (<span className="dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">{studentDetails.othersDomain}</span>)}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {studentDetails.projects && studentDetails.projects.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Projects</h2>
                      <div className="space-y-3">
                        {studentDetails.projects.map((p) => (
                          <div key={p.id || p.title} className="p-3 border border-border rounded-md bg-card">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium">{p.title}</div>
                                <div className="text-sm text-muted-foreground">{p.tech_stack ? (Array.isArray(p.tech_stack) ? p.tech_stack.join(", ") : p.tech_stack) : "Tech stack not set"}</div>
                              </div>
                              <div className="text-xs text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleDateString() : null}</div>
                            </div>
                            {p.description && <div className="mt-2 text-sm text-muted-foreground">{p.description}</div>}
                            {p.github_pr_link && <a className="mt-2 inline-block text-sm text-primary underline" href={p.github_pr_link} target="_blank" rel="noreferrer">PR / Repo</a>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  {studentDetails.badges && studentDetails.badges.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Skill Badges</h2>
                      <div className="flex flex-wrap gap-2">
                        {studentDetails.badges.map((b) => (
                          <span key={b.id || b.name || JSON.stringify(b)} className="px-3 py-1 rounded-full bg-card text-sm">{b.name || b}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enrollments */}
                  {studentDetails.enrollments && studentDetails.enrollments.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Enrollments</h2>
                      <div className="space-y-2">
                        {studentDetails.enrollments.map((en) => (
                          <div key={en.id || en.course_name} className="p-3 border border-border rounded-md bg-card flex items-center justify-between">
                            <div>
                              <div className="font-medium">{en.course_name}</div>
                              {en.course_description && <div className="text-sm text-muted-foreground">{en.course_description}</div>}
                            </div>
                            <div className="text-sm text-muted-foreground">{(en.status || 'active').toString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attendance */}
                  {studentDetails.attendance && studentDetails.attendance.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Recent Attendance</h2>
                      <div className="flex flex-col gap-2 text-sm">
                        {studentDetails.attendance.slice(0, 10).map((a, i) => (
                          <div key={`${a.date || i}`} className="flex items-center justify-between p-2 border border-border rounded-md bg-card">
                            <div>{a.date ? new Date(a.date).toLocaleDateString() : a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</div>
                            <div className="text-muted-foreground">{a.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button onClick={() => {
                    try {
                      const payload = studentDetails;
                      window.dispatchEvent(new CustomEvent('candidate:selected', { detail: payload }));
                    } catch (e) {
                      console.error('candidate select dispatch failed', e);
                    }
                  }}>Select Candidate</Button>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  // List view
  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-300" : "text-gray-400"}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const v = e.target.value;
                setSearchQuery(v);
                // only show suggestions when user has typed at least 1 character
                if (v && v.trim().length >= 1) setShowSearchSuggestions(true);
                else setShowSearchSuggestions(false);
              }}
              onFocus={() => { if (searchQuery && searchQuery.trim().length >= 1) setShowSearchSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 120)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (searchQuery || "").toString().trim();
                  if (q) saveHistory(q);
                  setShowSearchSuggestions(false);
                }
              }}
              placeholder="Search by name or skill/domain (try: react, ai, frontend)..."
              className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${darkMode ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300 bg-white text-gray-900"}`}
            />

            <button ref={filterToggleRef} type="button" aria-label="Toggle filters" onClick={() => setShowFiltersPanel((s)=>!s)} className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
              <Filter className="w-5 h-5" />
            </button>

            {showSearchSuggestions && (searchQuery && searchQuery.trim().length >= 1) && (
              <div className={`absolute z-50 mt-2 w-full rounded-xl border shadow-xl max-h-72 overflow-auto text-left ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                {/* header removed as requested; Clear button moved into Recent section */}

                {/* Recent history matches */}
                {(searchHistory || []).filter(h => h.toLowerCase().includes((searchQuery||"").toLowerCase())).length > 0 && (
                  <div className="py-2">
                    <div className="flex items-center justify-between px-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Recent</div>
                      {(searchHistory && searchHistory.length > 0) && (
                        <button type="button" onClick={clearHistory} className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"><Trash2 className="w-4 h-4"/> Clear</button>
                      )}
                    </div>
                    {(searchHistory || []).filter(h => h.toLowerCase().includes((searchQuery||"").toLowerCase())).map((h) => (
                      <button key={`hist-${h}`} type="button" onMouseDown={(e)=>{e.preventDefault(); handleSearchSuggestionSelect(h);}} className={`w-full px-4 py-2 text-sm flex items-center gap-3 ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}>
                        <Clock className="w-4 h-4 text-gray-400"/>
                        <div className="truncate">{renderHighlighted(h, searchQuery)}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Computed suggestions (exclude ones present in history to avoid duplicates) */}
                <div className="py-2">
                  {(searchSuggestions || []).filter(s => !(searchHistory || []).some(h => h.toLowerCase() === s.toLowerCase())).map((sug) => (
                    <button key={sug} type="button" onMouseDown={(e)=>{e.preventDefault(); handleSearchSuggestionSelect(sug);}} className={`w-full px-4 py-2 text-sm flex items-center gap-3 ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}>
                      <Search className="w-4 h-4 text-gray-400"/>
                      <div className="truncate">{renderHighlighted(sug, searchQuery)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showFiltersPanel && (
                // Filters panel dropdown
              <div ref={filtersPanelRef} className="absolute right-0 mt-3 w-full sm:w-80 z-30">
                <div className={`rounded-lg p-4 shadow-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <div className="flex items-center gap-2 mb-2"><Filter className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-primary"}`}/><h4 className={`font-semibold text-sm ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Filters</h4></div>
                  <div className="mb-3">
                    <label className={`text-sm font-medium mb-1 block ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Domain:</label>
                    <select value={filters.domain} onChange={(e)=>onFilterChange('domain', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                      {DOMAINS.map((d)=>(<option key={d} value={d}>{d}</option>))}
                    </select>
                  </div>
                  <div className="flex justify-end"><button type="button" onClick={()=>{onClearFilters(); setShowFiltersPanel(false);}} className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}><RotateCcw className="w-4 h-4"/>Clear Filters</button></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className={`px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}><h2 className={`text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Candidates ({filteredStudents.length})</h2></div>

          {loading ? (
            <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 animate-spin text-primary"/></div>
          ) : filteredStudents.length > 0 ? (
            // Candidates grid
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {(() => {
                  const seen = new Set();
                  const nodes = [];
                  for (let idx = 0; idx < filteredStudents.length; idx++) {
                    const s = filteredStudents[idx];
                      const email = (s.email || s.email_address || s.contact_email || "").toString().trim().toLowerCase();
                      const phone = (s.contact_number || s.phone || s.phone_number || "").toString().trim().toLowerCase();
                      const primaryId = s.user_detail_id || s.id || s.student_id || null;
                      const nameKey = (s.full_name || s.student_name || s.profile_full_name || s.name || "").toString().trim().toLowerCase();
                      const dedupeKey = email ? `email:${email}` : (phone ? `phone:${phone}` : (primaryId ? `id:${String(primaryId)}` : `name:${nameKey}`));
                      if (!dedupeKey || seen.has(dedupeKey)) continue;
                      seen.add(dedupeKey);
                      const id = primaryId || `student-${idx}`;
                      const doms = (()=>{ try{ if (Array.isArray(s.domains_of_interest)) return s.domains_of_interest; if (typeof s.domains_of_interest === 'string'){ const t = s.domains_of_interest.trim(); if (!t) return []; if (t.startsWith('[')) return JSON.parse(t); return t.split(/[,|]/).map(d=>d.trim()); } return []; } catch { return []; } })();

                    const inferredDomain = (Array.isArray(doms) && doms[0]) || s.domain || s.domains || s.track || s.course || s.ai_skill_summary || '';
                    // Format student data to pass to StudentCard
                    const formatted = {
                      id,
                      full_name: s.full_name || s.student_name || s.profile_full_name || s.name || 'Unknown',
                      domain: inferredDomain || 'Not specified',
                      skillLevel: s.skill_level || 'Intermediate',
                      badges: doms.slice ? doms.slice(0, 4) : ['Profile'],
                      location: s.location || 'Unknown',
                      experience: s.experience || '1 year',
                      rating: s.rating ?? null,
                      lastActive: s.last_active || s.updated_at || 'Recently active',
                      ai_skill_summary: s.ai_skill_summary || s.ai_skills || '',
                      created_at: s.created_at,
                      __raw: s,
                    };
                      // Push StudentCard component for this student
                    nodes.push(
                      <StudentCard key={id} student={formatted} interviews={interviews} onViewProfile={()=>fetchStudentDetails(id)} onContact={()=>fetchStudentDetails(id)} delay={nodes.length*0.06} />
                    );
                  }
                  return nodes;
                })()}
              </div>
            </div>
          ) : (
            //No studnets Message
            <div className="text-center py-12 text-gray-600 dark:text-gray-300">{searchQuery?"No students found matching your search":"No students available"}</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
