// src/components/Company_Dashboard/StudentProfileModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  ExternalLink,
  Link as LinkIcon,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import StatCard from "./StatCard";

/**
 * StudentProfileModal
 *
 * Expects backend SELECT to return fields (from your SQL):
 *  s.id,
 *  s.full_name,
 *  s.email,
 *  s.phone,
 *  s.created_at,
 *  u.id AS user_detail_id,
 *  u.full_name AS profile_full_name,
 *  u.contact_number,
 *  u.linkedin_url,
 *  u.github_url,
 *  u.why_hire_me,
 *  u.profile_completed,
 *  u.ai_skill_summary,
 *  u.domains_of_interest,
 *  u.others_domain,
 *  u.created_at AS profile_created_at,
 *  u.updated_at AS profile_updated_at
 */
export default function StudentProfileModal({
  open,
  onClose,
  student: initialStudent = null,
  fetchFresh = false,
}) {
  // State: student data and loading status
  const [student, setStudent] = useState(initialStudent);
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Helper: normalize domains_of_interest into array of strings
  const normalizeDomains = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      // JSON array string
      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
        } catch {
          // fallback to comma split
        }
      }
      // comma separated
      if (trimmed.includes(",")) {
        return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
      }
      // single value
      if (trimmed.length) return [trimmed];
    }
    // fallback
    return [String(raw)];
  };

  /**
   * Fetch fresh student data if requested
   * Merges backend details with initial student object
   * Dispatches a global event 'student:updated' with key info
   */
  useEffect(() => {
    setStudent(initialStudent);

    if (fetchFresh && (initialStudent?.id || initialStudent?.student_id)) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${API_BASE}/api/students/${initialStudent.id}/details`, {
            withCredentials: true,
            headers: { Accept: "application/json" },
          });
          const payload = res.data?.data ?? res.data;

          // payload expected shape: { profile, projects, badges, enrollments, attendance, stats }
          const profile = payload.profile || {};

          const mapped = {
            id: profile.id ?? initialStudent.id,
            full_name: profile.profile_full_name || profile.full_name || profile.student_name || initialStudent.full_name || initialStudent.name,
            email: profile.email || initialStudent.email,
            phone: profile.phone || initialStudent.phone || profile.contact_number,
            contact_number: profile.contact_number || initialStudent.contact_number,
            linkedin_url: profile.linkedin_url || null,
            github_url: profile.github_url || null,
            why_hire_me: profile.why_hire_me || profile.why_hire || "",
            profile_completed: profile.profile_completed === true || profile.profile_completed === 't' || profile.profile_completed === 1,
            ai_skill_summary: profile.ai_skill_summary || initialStudent.ai_skill_summary || initialStudent.ai_skills || "",
            domains_of_interest: normalizeDomains(profile.domains_of_interest || initialStudent.domains_of_interest || profile.others_domain),
            created_at: profile.profile_created_at || profile.created_at || initialStudent.created_at,
            updated_at: profile.profile_updated_at || profile.updated_at || initialStudent.updated_at,
            // additional collections
            projects: Array.isArray(payload.projects) ? payload.projects : [],
            badges: Array.isArray(payload.badges) ? payload.badges : [],
            enrollments: Array.isArray(payload.enrollments) ? payload.enrollments : [],
            attendance: Array.isArray(payload.attendance) ? payload.attendance : [],
            stats: payload.stats || {},
            __raw: payload,
          };

          setStudent((prev) => {
            const merged = { ...(prev || {}), ...mapped };
            // dispatch global event for any listener components
            try {
              window.dispatchEvent(new CustomEvent('student:updated', { detail: {
                id: merged.id,
                studentId: merged.id,
                domains_of_interest: merged.domains_of_interest,
                domain: merged.domain,
                domains: merged.domains,
                track: merged.track,
                course: merged.course,
                full_name: merged.full_name,
              }}));
            } catch (e) {}
            return merged;
          });
        } catch (err) {
          console.error("StudentProfileModal fetch error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [initialStudent, fetchFresh, API_BASE]);

  // Safe guard: ensure student object exists
  const s = student || {};

  // Generate initials from full name
  const initials = (s.full_name || "US")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedDate = s.created_at ? new Date(s.created_at).toLocaleDateString() : "—";
  const updatedDate = s.updated_at ? new Date(s.updated_at).toLocaleDateString() : null;

  /**
   * Prevent background scrolling while modal is open
   * Also handles scrollbar compensation to avoid layout shift
   */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";

    const scrollBarComp = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarComp > 0) {
      document.body.style.paddingRight = `${scrollBarComp}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow || "";
      document.body.style.paddingRight = prevPaddingRight || "";
    };
  }, [open]);

  // Modal JSX structure
  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-5xl mx-6 bg-card rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 16, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
      >
        <div className="p-6 max-h-[calc(90vh-64px)] overflow-auto">
          {/* Header: initials, name, domain, joined/updated dates */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold text-xl">
                {initials}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-xl truncate">{s.full_name}</h3>
                <p className="text-sm text-muted-foreground truncate">{(s.domains_of_interest && s.domains_of_interest[0]) || "Domain not set"}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-xs text-muted-foreground">Joined: {joinedDate}</span>
                  {updatedDate && (
                    <span className="text-xs text-muted-foreground ml-2">Updated: {updatedDate}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Close button */}
            <div className="flex items-start gap-2">
              <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats, badges, enrollments, attendance */}
          <div className="mt-6">
            {/* Stats row */}
            <div className="flex items-center gap-4 mb-4">
              <div className="text-sm text-muted-foreground">Projects:</div>
              <div className="font-medium">{(s.stats && s.stats.totalProjects) ?? (s.projects ? s.projects.length : 0)}</div>
              <div className="text-sm text-muted-foreground ml-4">Badges:</div>
              <div className="font-medium">{(s.stats && s.stats.totalBadges) ?? (s.badges ? s.badges.length : 0)}</div>
              <div className="text-sm text-muted-foreground ml-4">Enrollments:</div>
              <div className="font-medium">{(s.stats && s.stats.totalEnrollments) ?? (s.enrollments ? s.enrollments.length : 0)}</div>
              {/* Attendance intentionally commented out */}
            </div>

            {/* Badges section */}
            {Array.isArray(s.badges) && s.badges.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Skill Badges</div>
                <div className="flex flex-wrap gap-2">
                  {s.badges.map((b) => (
                    <Badge key={b.id || b.name || JSON.stringify(b)} className="text-xs" variant={b.is_verified ? 'secondary' : 'outline'}>{b.name || b}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Enrollments */}
            {Array.isArray(s.enrollments) && s.enrollments.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Enrollments</div>
                <div className="space-y-2">
                  {s.enrollments.map((en) => (
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

            {/* Attendance (recent) */}
            {Array.isArray(s.attendance) && s.attendance.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Recent Attendance</div>
                <div className="flex flex-col gap-2 text-sm">
                  {s.attendance.slice(0, 10).map((a, i) => (
                    <div key={`${a.date || i}`} className="flex items-center justify-between p-2 border border-border rounded-md bg-card">
                      <div>{a.date ? new Date(a.date).toLocaleDateString() : a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</div>
                      <div className="text-muted-foreground">{a.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main body: left (contact/metadata) and right (AI summary, why hire, links) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
            {/* LEFT: basic contact and metadata */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Email</div>
                  <div className="text-sm">
                    {s.email ? (
                      <a href={`mailto:${s.email}`} className="underline">{s.email}</a>
                    ) : (
                      "Not available"
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Phone</div>
                  <div className="text-sm">
                    {s.phone || s.contact_number ? (
                      <a href={`tel:${s.phone || s.contact_number}`} className="underline">{s.phone || s.contact_number}</a>
                    ) : (
                      "Not available"
                    )}
                  </div>
                </div>
              </div>

              {/* Domains / badges */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Domains / Badges</div>
                <div className="flex flex-wrap gap-2">
                  {(s.domains_of_interest || []).length === 0 ? (
                    <Badge variant="outline">No domains</Badge>
                  ) : (
                    (s.domains_of_interest || []).map((d, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Profile status */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Profile status</div>
                <div className="text-sm">{s.profile_completed ? "Completed" : "Incomplete"}</div>
              </div>
            </div>

            {/* RIGHT: AI summary, why hire, links */}
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">AI Summary</div>
                <div className="text-sm whitespace-pre-line">{s.ai_skill_summary || "No AI summary provided."}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Why hire me</div>
                <div className="text-sm whitespace-pre-line">{s.why_hire_me || "Not provided."}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Links</div>
                <div className="flex flex-col gap-2 text-sm">
                  {s.linkedin_url ? (
                    <a href={s.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                      <LinkIcon className="w-4 h-4" /> LinkedIn
                    </a>
                  ) : (
                    <span className="text-muted-foreground">LinkedIn: N/A</span>
                  )}

                  {s.github_url ? (
                    <a href={s.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                      <ExternalLink className="w-4 h-4" /> GitHub
                    </a>
                  ) : (
                    <span className="text-muted-foreground">GitHub: N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Loading fresh data…
            </div>
          )}

          {/* Projects section displayed after main details */}
          {Array.isArray(s.projects) && s.projects.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-semibold text-muted-foreground mb-3">Projects</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {s.projects.map((p, i) => (
                  <StatCard
                    key={p.id || p.title || i}
                    title={p.title || `Project ${i + 1}`}
                    value={p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}
                    subtitle={p.tech_stack ? (Array.isArray(p.tech_stack) ? p.tech_stack.join(", ") : p.tech_stack) : ""}
                    color="secondary"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  // Render via portal only if modal is open
  return open ? createPortal(modal, document.body) : null;
}
