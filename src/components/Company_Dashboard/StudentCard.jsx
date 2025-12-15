// src/components/Company_Dashboard/StudentCard.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { createPortal } from 'react-dom';
import { motion } from "framer-motion";
import { Badge } from "../Company_Dashboard/ui/badge";
import { Button } from "../Company_Dashboard/ui/button";
import { Card } from "../Company_Dashboard/ui/card";
import { Input } from "../Company_Dashboard/ui/input";
import { Label } from "../Company_Dashboard/ui/label";
import { toast } from "sonner";
import StudentProfileModal from "./StudentProfileModal";
import { useTheme } from "../../context/ThemeContext";

/* --------- Utility for badge colours by skill level -------- */
const skillLevelColors = {
  Beginner: "bg-warning text-warning-foreground",
  Intermediate: "bg-primary text-primary-foreground",
  Advanced: "bg-success text-success-foreground",
};

export default function StudentCard({
  student: initialStudent = null,
  studentId = null,
  onViewProfile = () => {},
  onContact = () => {},
  delay = 0,
  interviews: parentInterviews = null,
}) {
  const { darkMode } = useTheme();
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [student, setStudent] = useState(initialStudent);
  const [interviewScheduled, setInterviewScheduled] = useState(false);

  useEffect(() => {
    const onInterviewCreated = (e) => {
      try {
        const d = e?.detail || {};
        const cid = d.candidate_id ?? d.candidateId ?? d.candidate_id ?? null;
        const cname = (d.candidate_name || d.candidateName || d.name || "").toString().trim();
        // If candidate id matches or name matches, mark scheduled
        if (cid && (cid === student.id || cid === student.student_id)) {
          setInterviewScheduled(true);
          setStudent((s) => ({ ...s, interviewScheduled: true }));
          return;
        }
        if (cname) {
          const localName = (student && (student.full_name || student.name || student.student_name || student.profile_full_name || "")).toString().trim();
          if (localName && cname.toLowerCase() === localName.toLowerCase()) {
            setInterviewScheduled(true);
            setStudent((s) => ({ ...s, interviewScheduled: true }));
          }
        }
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('interview:created', onInterviewCreated);
    return () => window.removeEventListener('interview:created', onInterviewCreated);
  }, [student]);

  // Listen for external updates to the student (e.g., student dashboard edited their profile)
  // When a matching `student:updated` event is dispatched with { id, ...fields }
  // merge the incoming fields into the local `student` state so badges and lastActive update live.
  useEffect(() => {
    const onStudentUpdated = (e) => {
      try {
        const d = e?.detail || {};
        const id = d.id ?? d.studentId ?? d.student_id;
        if (!id) return;

        setStudent((prev) => {
          if (!prev) return prev;
          const prevId = prev.id ?? prev.student_id ?? null;
          if (!prevId) return prev;
          if (String(prevId) !== String(id)) return prev;

          return {
            ...prev,
            // merge common fields, prefer incoming values when present
            skillLevel: d.skillLevel ?? d.skill_level ?? prev.skillLevel,
            experience: d.experience ?? prev.experience ?? prev.experience,
            lastActive: d.last_active ?? d.updated_at ?? prev.lastActive,
            domain: d.domain ?? prev.domain,
            ai_skill_summary: d.ai_skill_summary ?? prev.ai_skill_summary,
            // also spread any other incoming fields
            ...d,
          };
        });
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('student:updated', onStudentUpdated);
    return () => window.removeEventListener('student:updated', onStudentUpdated);
  }, []);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState({ position: "", date: "", time: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileStudent, setProfileStudent] = useState(null);

  // Prevent background scrolling when schedule modal is open
  useEffect(() => {
    if (!isScheduleOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    const scrollBarComp = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarComp > 0) document.body.style.paddingRight = `${scrollBarComp}px`;
    return () => {
      document.body.style.overflow = prevOverflow || '';
      document.body.style.paddingRight = prevPaddingRight || '';
    };
  }, [isScheduleOpen]);

  useEffect(() => {
    if (initialStudent) {
      setStudent(initialStudent);
      return;
    }

    // If no student object passed, but a studentId is provided, fetch that student's profile.
    // If neither provided, skip fetching (keeps behavior minimal and predictable).
    const url = studentId ? `/api/profile/${studentId}` : null;
    if (!url) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(url, { withCredentials: true });
        const data = res.data;
        const found = data?.data ?? data?.student ?? data;
        if (!found) throw new Error("No student data returned");

        setStudent({
          id: found.student_id ?? found.id ?? studentId,
          name:
            found.student_name ??
            [found.first_name, found.last_name].filter(Boolean).join(" ") ??
            "Unknown",
          domain: found.domains_of_interest
            ? (() => {
                try {
                  const parsed = JSON.parse(found.domains_of_interest);
                  return Array.isArray(parsed) ? parsed.join(", ") : String(parsed);
                } catch {
                  return String(found.domains_of_interest);
                }
              })()
            : found.domain ?? "Not specified",
          rating: found.rating ?? null,
          skillLevel: found.skillLevel ?? "Intermediate",
          experience: found.experience ?? "1 year",
          location: found.location ?? "Unknown",
          lastActive: found.updated_at
            ? new Date(found.updated_at).toLocaleDateString()
            : found.last_active ?? "Recently active",
          badges: found.badges ?? ["Team Player", "Fast Learner"],
        });
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    fetchProfile();
  }, [initialStudent, studentId]);

  // On mount (or when student loads), check existing interviews to persist scheduled state across refreshes
  useEffect(() => {
    let cancelled = false;
    const processList = (list) => {
      try {
        const normalize = (s = "") => s.toString().replace(/\s+/g, " ").trim().toLowerCase();
        const displayNameLocal = normalize(student.full_name || student.name || student.student_name || student.profile_full_name || "");

        const match = list.find((iv) => {
          if (!iv) return false;
          const cid = iv.candidate_id ?? iv.candidateId ?? iv.candidate_student_id ?? iv.student_id ?? null;
          if (cid && (String(cid) === String(student.id) || String(cid) === String(student.student_id))) return iv;

          const iname = normalize(iv.candidate_name || iv.candidateName || iv.name || "");
          if (!displayNameLocal || !iname) return false;
          if (displayNameLocal === iname) return iv;
          if (iname.includes(displayNameLocal) || displayNameLocal.includes(iname)) return iv;
          const dTokens = displayNameLocal.split(" ").filter(Boolean);
          const iTokens = iname.split(" ").filter(Boolean);
          if (dTokens.length && iTokens.length) {
            const common = dTokens.filter(t => iTokens.includes(t));
            if (common.length >= Math.min(1, dTokens.length)) return iv;
          }
          return false;
        });

        if (match && !cancelled) {
          const status = (match.status || match.state || "Scheduled").toString().toLowerCase();
          if (status !== "completed" && status !== "cancelled") {
            // Only update state if it would actually change to avoid update loops
            setInterviewScheduled((prev) => {
              if (prev) return prev;
              return true;
            });

            setStudent((s) => {
              if (!s) return s;
              const alreadyScheduled = Boolean(s.interviewScheduled || s.interviewDate || s.interviewTime);
              const sameDate = String(s.interviewDate) === String(match.date);
              const sameTime = String(s.interviewTime) === String(match.time);
              if (alreadyScheduled && sameDate && sameTime) return s;
              return { ...s, interviewScheduled: true, interviewDate: match.date, interviewTime: match.time };
            });
          }
        }
      } catch (err) { /* ignore */ }
    };

    // If parent passed interviews, use them (faster)
    if (Array.isArray(parentInterviews) && parentInterviews.length > 0) {
      processList(parentInterviews);
      return () => { cancelled = true; };
    }

    // Otherwise fetch interviews as before
    const checkScheduled = async () => {
      try {
        if (!student) return;
        const res = await axios.get(`${API_BASE}/api/interviews`);
        const data = res.data;
        const list = Array.isArray(data) ? data : (data?.data || []);
        processList(list);
      } catch (err) { /* ignore */ }
    };

    checkScheduled();
    return () => { cancelled = true; };
  }, [student]);

  if (!student) {
    return (
      <div className="p-6 border rounded shadow bg-muted text-muted-foreground">
        Loading student...
      </div>
    );
  }

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition((prev) => ({
      x: prev.x + (e.clientX - rect.left - prev.x) * 0.2,
      y: prev.y + (e.clientY - rect.top - prev.y) * 0.2,
    }));
  };

  // ====== only changed: robust display name + initials derived from it ======
  const displayName =
    student.full_name ||
    student.name ||
    student.student_name ||
    student.profile_full_name ||
    "Unknown Student";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  // derive a friendly domain string from multiple possible fields
  const getDisplayDomain = (s) => {
    if (!s) return "";
    if (s.domain && String(s.domain).trim()) return String(s.domain).trim();
    if (s.domains_of_interest) {
      try {
        const parsed = typeof s.domains_of_interest === 'string' ? JSON.parse(s.domains_of_interest) : s.domains_of_interest;
        if (Array.isArray(parsed)) return parsed.join(', ');
        return String(parsed || s.domains_of_interest).trim();
      } catch {
        return String(s.domains_of_interest).trim();
      }
    }
    if (s.domains) return Array.isArray(s.domains) ? s.domains.join(', ') : String(s.domains).trim();
    if (s.track) return String(s.track).trim();
    if (s.course) return String(s.course).trim();
    return "";
  };

  const displayDomain = getDisplayDomain(student);
  // derive a list of domains (for rendering badges / select)
  const getDomainList = (s) => {
    if (!s) return [];
    const out = [];
    const pushVal = (v) => {
      if (!v && v !== 0) return;
      if (Array.isArray(v)) return v.forEach(pushVal);
      const str = String(v || "").trim();
      if (!str) return;
      // split common separators
      if (str.includes(",")) return str.split(",").map((t) => t.trim()).forEach(pushVal);
      if (str.includes("/")) return str.split("/").map((t) => t.trim()).forEach(pushVal);
      out.push(str);
    };

    if (s.domains_of_interest) {
      try {
        const parsed = typeof s.domains_of_interest === 'string' ? JSON.parse(s.domains_of_interest) : s.domains_of_interest;
        pushVal(parsed);
      } catch {
        pushVal(s.domains_of_interest);
      }
    }
    if (s.domains) pushVal(s.domains);
    if (s.domain && String(s.domain).trim() && String(s.domain).toLowerCase() !== 'not specified') pushVal(s.domain);
    if (s.track) pushVal(s.track);
    if (s.course) pushVal(s.course);

    // dedupe
    const cleaned = Array.from(new Set(out.map((t) => String(t).trim()))).filter(Boolean);
    return cleaned;
  };

  const domainList = getDomainList(student);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <Card
        ref={divRef}
        className={`relative p-5 h-full flex flex-col hover:shadow-md transition-all duration-200 overflow-hidden border rounded-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setOpacity(0.6)}
        onMouseLeave={() => setOpacity(0)}
      >
        {/* spotlight (subtle) */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-in-out rounded-lg"
          style={{
            opacity: opacity * 0.4,
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(0,102,255,0.06), transparent 60%)`,
          }}
        />

        {/* Compact header: avatar, name, domain */}
        <div className="relative z-10 flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ring-1 ${darkMode ? "bg-gray-700 text-gray-200 ring-gray-600" : "bg-slate-100 text-slate-700 ring-slate-100"}`}>{initials}</div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h3 className={`text-lg font-semibold truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{displayName}</h3>
              {(interviewScheduled || student.interviewScheduled) && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-green-900 text-green-300" : "bg-green-50 text-green-700"}`}>Scheduled</span>
              )}
            </div>
            <p className={`text-sm mt-1 truncate ${darkMode ? "text-gray-400" : "text-slate-500"}`}>{displayDomain || 'Not specified'}</p>

            {/* skill level and experience removed from compact card per request */}
          </div>
        </div>

        {/* meta row removed (AI summary / last active) — compact card simplified */}

        {/* actions */}
        <div className={`relative z-10 mt-4 border-t pt-4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-full"
              onClick={() => {
                try {
                  setProfileStudent(student);
                  setIsProfileOpen(true);
                } catch (e) {
                  console.error('open profile failed', e);
                }
              }}
            >
              View Profile
            </Button>

            {(interviewScheduled || student.interviewScheduled) ? (
              <Button
                size="sm"
                disabled
                aria-disabled
                className="flex-1 rounded-full bg-green-600 text-white cursor-default"
              >
                Scheduled
              </Button>
            ) : (
                <Button
                  size="sm"
                  className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setSchedule((s) => ({ ...s, position: displayDomain || (student.domain || ""), date: "", time: "" }));
                    setIsScheduleOpen(true);
                  }}
                >
                  Schedule Interview
                </Button>
            )}
          </div>

          {isScheduleOpen && createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsScheduleOpen(false)} />
                <div className={`relative z-10 w-full max-w-sm rounded-xl p-6 shadow-2xl ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                  <h3 className="text-xl font-semibold mb-4">Schedule Interview</h3>
                  <div className="grid gap-3 py-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className={`text-right text-sm ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Candidate</Label>
                      <div className="col-span-3 font-medium text-sm">{displayName}</div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className={`text-right text-sm ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Position</Label>
                      <Input className={`col-span-3 rounded-lg border px-3 py-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-slate-200"}`} value={schedule.position} onChange={(e) => setSchedule({ ...schedule, position: e.target.value })} placeholder={displayDomain || 'Position / Domain'} />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className={`text-right text-sm ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Date</Label>
                      <Input type="date" className={`col-span-3 rounded-lg border px-3 py-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-slate-200"}`} value={schedule.date} onChange={(e) => setSchedule({ ...schedule, date: e.target.value })} placeholder="dd-mm-yyyy" />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className={`text-right text-sm ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Time</Label>
                      <Input type="time" className={`col-span-3 rounded-lg border px-3 py-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-slate-200"}`} value={schedule.time} onChange={(e) => setSchedule({ ...schedule, time: e.target.value })} placeholder="--:--" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-5">
                    <Button variant="outline" className={`rounded-full px-4 py-2 ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-blue-300 text-blue-600"}`} onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
                    <Button disabled={isSaving} className="rounded-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow" onClick={async () => {
                        if (!schedule.position || !schedule.date || !schedule.time) { toast.error('Please fill all fields'); return; }
                        try {
                          setIsSaving(true);
                          const token = localStorage.getItem('token');
                          const headers = { 'Content-Type': 'application/json' };
                          if (token) headers['Authorization'] = `Bearer ${token}`;
                          const res = await axios.post(`${API_BASE}/api/interviews`, {
                            candidateId: student.id || student.student_id || studentId || null,
                            candidateName: displayName,
                            position: schedule.position,
                            date: schedule.date,
                            time: schedule.time
                          }, { headers });

                          const created = res.data;
                          console.debug('Interview created response:', created);
                          toast.success(`Interview scheduled — ${displayName}`);
                          // mark card as scheduled so UI reflects state immediately
                          setInterviewScheduled(true);
                          setStudent((s) => ({ ...s, interviewScheduled: true, interviewDate: schedule.date, interviewTime: schedule.time }));
                          try {
                            const normalized = {
                              id: created.id ?? created._id ?? created.interview_id ?? created.interviewId ?? null,
                              candidate_name: created.candidate_name ?? created.candidateName ?? created.name ?? displayName,
                              candidate_id: created.candidateId ?? created.candidate_id ?? (student.id || student.student_id || studentId || null),
                              role: created.role ?? created.position ?? created.job ?? schedule.position,
                              date: created.date ?? created.scheduled_date ?? created.slot_date ?? schedule.date,
                              time: created.time ?? created.scheduled_time ?? created.slot_time ?? schedule.time,
                              status: created.status ?? (created.state || 'Scheduled'),
                              raw: created,
                            };
                            window.dispatchEvent(new CustomEvent('interview:created', { detail: normalized }));
                          } catch (e) {}

                          setIsScheduleOpen(false);
                        } catch (err) {
                          console.error(err);
                          toast.error('Error scheduling interview');
                        } finally {
                          setIsSaving(false);
                        }
                      }}>{isSaving ? 'Scheduling…' : 'Schedule'}</Button>
                  </div>
                </div>
            </div>, document.body)
          }
        </div>
      </Card>

      {/* Student profile modal (shared detailed view) - rendered outside the Card to avoid JSX nesting issues */}
      <StudentProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} student={profileStudent} fetchFresh={true} />

    </motion.div>
  );
}
