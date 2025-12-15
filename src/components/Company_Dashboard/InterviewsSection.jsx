import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card } from "../Company_Dashboard/ui/card";
import { Button } from "../Company_Dashboard/ui/button";
import { Badge } from "../Company_Dashboard/ui/badge";
import { Input } from "../Company_Dashboard/ui/input";
import { Label } from "../Company_Dashboard/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Company_Dashboard/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Company_Dashboard/ui/dialog";
import StudentProfileModal from "./StudentProfileModal";
import SearchStudents from "./SearchStudents";

import { Calendar, Clock, Video, Phone, Trash } from "lucide-react";
import { toast } from "sonner";

const statusColors = {
  scheduled: "bg-primary text-primary-foreground",
  completed: "bg-green-500 text-white",
  cancelled: "bg-red-600 text-white",
};

const typeIcons = {
  video: Video,
  phone: Phone,
  "in-person": Calendar,
};

function InterviewsSection() {
  const [interviews, setInterviews] = useState([]);
  const [interviewCount, setInterviewCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileStudent, setProfileStudent] = useState(null);
  const [viewInterview, setViewInterview] = useState(null);
  const [newInterview, setNewInterview] = useState({
    candidateName: "",
    position: "",
    date: "",
    time: "",
    type: "",
  });

  const [editInterview, setEditInterview] = useState({
    id: "",
    date: "",
    time: "",
  });

  // Autocomplete states
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const fetchInterviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/interviews");
      const data = res.data || [];
      // sort by date + time (ascending)
      const sorted = Array.isArray(data)
        ? data.slice().sort((a, b) => {
            try {
              const ta = new Date(a.date).getTime() + (a.time ? new Date('1970-01-01T' + a.time).getTime() : 0);
              const tb = new Date(b.date).getTime() + (b.time ? new Date('1970-01-01T' + b.time).getTime() : 0);
              return ta - tb;
            } catch (e) {
              return 0;
            }
          })
        : data;

      setInterviews(sorted);
      setInterviewCount(sorted.length);
    } catch (err) {
      console.error("Error fetching interviews:", err);
    }
  };

  // Fetch all candidates/students
  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students/autocomplete");
      setCandidates(res.data || []);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  useEffect(() => {
    fetchInterviews();
    const onCandidateSelected = (e) => {
      try {
        const s = e?.detail;
        if (!s) return;
        // set candidate name and id in the newInterview draft
        setNewInterview((prev) => ({ ...prev, candidateName: s.full_name || s.profile_full_name || s.student_name || s.name || prev.candidateName, candidateId: s.id || s.student_id || s.studentId || null }));
        setIsFindOpen(false);
        // keep schedule modal open for convenience
      } catch (err) {
        console.error('candidate:selected handler error', err);
      }
    };

    window.addEventListener('candidate:selected', onCandidateSelected);
    const onInterviewCreatedGlobal = (e) => {
      try {
        // when another component schedules an interview, refresh list
        fetchInterviews();
        const d = e?.detail || {};
        const name = d.candidate_name || d.candidateName || d.name || null;
        // Avoid duplicating toasts here; originator should show success toast.
        // Optionally, we could show a muted notification if desired.
      } catch (err) {
        console.error('interview:created handler error', err);
      }
    };

    window.addEventListener('interview:created', onInterviewCreatedGlobal);
    return () => {
      try { window.removeEventListener('candidate:selected', onCandidateSelected); } catch (e) {}
      try { window.removeEventListener('interview:created', onInterviewCreatedGlobal); } catch (e) {}
    };
  }, []);

  // Filter candidates based on input
  useEffect(() => {
    if (newInterview.candidateName.trim() === "") {
      setFilteredCandidates([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = candidates.filter((candidate) =>
      candidate.name?.toLowerCase().includes(newInterview.candidateName.toLowerCase())
    );

    setFilteredCandidates(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [newInterview.candidateName, candidates]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredCandidates.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCandidates.length - 1 ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case "Tab":
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredCandidates[selectedIndex]) {
          selectCandidate(filteredCandidates[selectedIndex]);
        } else if (filteredCandidates.length > 0) {
          selectCandidate(filteredCandidates[0]);
        }
        break;

      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;

      default:
        break;
    }
  };

  const selectCandidate = (candidate) => {
    setNewInterview({
      ...newInterview,
      candidateName: candidate.name,
    });
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleScheduleInterview = async () => {
    if (!newInterview.candidateName || !newInterview.position || !newInterview.date || !newInterview.time || !newInterview.type) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/interviews", newInterview);
      setInterviews([...interviews, res.data]);
      setInterviewCount(prev => prev + 1);
      setIsModalOpen(false);
      setNewInterview({
        candidateName: "",
        position: "",
        date: "",
        time: "",
        type: "",
      });
    } catch (err) {
      console.error("Error scheduling interview:", err);
    }
  };

  const handleDeleteInterview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/interviews/${id}`);
      fetchInterviews();
      // show a red/danger toast on successful deletion
      try { toast.error("Interview deleted"); } catch (e) { /* ignore toast errors */ }
    } catch (err) {
      console.error("Error deleting interview:", err);
      try { toast.error("Failed to delete interview"); } catch (e) { }
    }
  };

  const confirmDeleteInterview = (id) => {
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const performConfirmedDelete = async () => {
    if (!pendingDeleteId) return;
    setIsConfirmOpen(false);
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    await handleDeleteInterview(id);
  };

  const handleEditSave = async () => {
    if (!editInterview.date || !editInterview.time) {
      alert("Please select new date and time.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/interviews/${editInterview.id}`, {
        date: editInterview.date,
        time: editInterview.time,
      });

      setIsEditModalOpen(false);
      setEditInterview({ id: "", date: "", time: "" });
      fetchInterviews();
    } catch (err) {
      console.error("Error updating interview:", err);
    }
  };

  return (
    <motion.div
      id="upcoming-interviews"
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">
          Upcoming Interviews ({interviewCount})
        </h2>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule New Interview
            </Button>
          </DialogTrigger>

          <DialogContent aria-describedby="schedule-desc">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
            </DialogHeader>
            <p id="schedule-desc" className="sr-only">Schedule a new interview by providing candidate, position, date, time and type.</p>

            <div className="grid gap-4 py-4">
              {/* Candidate Name with Autocomplete */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Candidate Name</Label>
                <div className="col-span-3 relative">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={newInterview.candidateName}
                    onChange={(e) =>
                      setNewInterview({ ...newInterview, candidateName: e.target.value })
                    }
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (filteredCandidates.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    placeholder="Enter Canditate Name"
                    autoComplete="off"
                  />

                  {/* Autocomplete Dropdown */}
                  {showSuggestions && filteredCandidates.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      {filteredCandidates.map((candidate, index) => (
                        <div
                          key={candidate.id}
                          className={`px-4 py-2 cursor-pointer transition-colors ${
                            index === selectedIndex
                              ? "bg-blue-100 dark:bg-blue-900"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => selectCandidate(candidate)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="font-medium">{candidate.name}</div>
                          {candidate.email && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {candidate.email}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Other Fields */}
              {["position", "date", "time", "type"].map((field) => (
                <div key={field} className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right capitalize">{field}</Label>
                  {field === "type" ? (
                    <Select
                      value={newInterview.type}
                      onValueChange={(value) =>
                        setNewInterview({ ...newInterview, type: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="in-person">In-person</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    field === "candidateName" ? (
                      <div className="col-span-3 flex items-center gap-2">
                        <Input
                          type="text"
                          value={newInterview.candidateName}
                          onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                          className="flex-1"
                        />
                        <Button size="sm" variant="outline" onClick={() => setIsFindOpen(true)}>Find</Button>
                      </div>
                    ) : (
                      <Input
                        type={field === "date" ? "date" : field === "time" ? "time" : "text"}
                        value={newInterview[field]}
                        onChange={(e) =>
                          setNewInterview({ ...newInterview, [field]: e.target.value })
                        }
                        className="col-span-3"
                      />
                    )
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleScheduleInterview}>Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Find candidate dialog (embedded search) */}
        <Dialog open={isFindOpen} onOpenChange={setIsFindOpen}>
          <DialogContent aria-describedby="find-desc">
            <DialogHeader>
              <DialogTitle>Find Candidate</DialogTitle>
            </DialogHeader>
            <p id="find-desc" className="sr-only">Search and select a candidate from existing students.</p>
            <div style={{ minHeight: 400 }} className="py-2">
              <SearchStudents />
            </div>
            <div className="flex justify-end mt-2"><Button variant="outline" onClick={() => setIsFindOpen(false)}>Close</Button></div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
  {/* Map through all interviews and render a card for each */}
  {interviews.map((interview, index) => {
    // Select an icon based on interview type or fallback to Calendar
    const TypeIcon = typeIcons[interview.type] || Calendar;

    return (
      <motion.div
        key={interview.id}
        initial={{ opacity: 0, x: -20 }} // animation initial state
        animate={{ opacity: 1, x: 0 }}  // animation final state
        transition={{ delay: index * 0.1 }} // staggered animation
      >
        {/* Individual interview card */}
        <Card className="p-4 flex flex-col bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            {/* Candidate info: avatar, name, role */}
            <div className="flex items-center gap-2">
              {/* Avatar with initials */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                {(interview.candidate_name || interview.candidateName).split(" ").map(n => n[0]).join("")}
              </div>

              {/* Candidate name and role */}
              <div>
                <h3 className="font-semibold text-lg">
                  {interview.candidate_name || interview.candidateName}
                </h3>
                <p className="text-sm text-gray-400">
                  {interview.role || interview.position}
                </p>
              </div>
            </div>

            {/* Right side: date, time, type, status, action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Date and time */}
              <div className="text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(interview.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{interview.time}</span>
                </div>
              </div>

              {/* Interview type and status */}
              <div className="flex items-center gap-2">
                <TypeIcon className="w-5 h-5 text-primary" />
                <Badge className={`${statusColors[interview.status?.toLowerCase()] || ""} capitalize`}>
                  {interview.status}
                </Badge>
              </div>

              {/* Action buttons: Details, Reschedule, Delete */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewInterview(interview); // Open details modal
                  }}
                >
                  Details
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Open edit modal and prefill data
                    setEditInterview({
                      id: interview.id,
                      date: interview.date.split("T")[0],
                      time: interview.time,
                    });
                    setIsEditModalOpen(true);
                  }}
                >
                  Reschedule
                </Button>

                <Button
                  onClick={() => confirmDeleteInterview(interview.id)} // Confirm deletion
                  variant="ghost"
                  size="icon"
                  className="bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  })}
</div>

{/* Dialog for viewing interview details */}
<Dialog open={!!viewInterview} onOpenChange={(open) => { if (!open) setViewInterview(null); }}>
  <DialogContent aria-describedby="details-desc">
    <DialogHeader>
      <DialogTitle>Interview Details</DialogTitle>
    </DialogHeader>
    <p id="details-desc" className="sr-only">View detailed information about the selected interview.</p>

    {/* Grid displaying interview info */}
    <div className="grid gap-4 py-2">
      {/* Candidate Name */}
      <div className="grid grid-cols-4 gap-4 items-center">
        <Label className="text-right">Candidate</Label>
        <div className="col-span-3 font-semibold">{viewInterview?.candidate_name || viewInterview?.candidateName}</div>
      </div>

      {/* Position/Role */}
      <div className="grid grid-cols-4 gap-4 items-center">
        <Label className="text-right">Position</Label>
        <div className="col-span-3">{viewInterview?.role || viewInterview?.position}</div>
      </div>

      {/* Date */}
      <div className="grid grid-cols-4 gap-4 items-center">
        <Label className="text-right">Date</Label>
        <div className="col-span-3">{viewInterview?.date ? new Date(viewInterview.date).toLocaleDateString() : ""}</div>
      </div>

      {/* Time */}
      <div className="grid grid-cols-4 gap-4 items-center">
        <Label className="text-right">Time</Label>
        <div className="col-span-3">{viewInterview?.time}</div>
      </div>

      {/* Type */}
      <div className="grid grid-cols-4 gap-4 items-center">
        <Label className="text-right">Type</Label>
        <div className="col-span-3">{viewInterview?.type}</div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-4 gap-4 items-center">
        <Label className="text-right">Status</Label>
        <div className="col-span-3 capitalize">{viewInterview?.status}</div>
      </div>

      {/* Raw JSON data (if available) */}
      {viewInterview?.raw && (
        <div className="col-span-4">
          <Label>Raw</Label>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-auto">{JSON.stringify(viewInterview.raw, null, 2)}</pre>
        </div>
      )}
    </div>

    {/* Footer actions: Close & View Candidate Profile */}
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setViewInterview(null)}>Close</Button>
      <Button onClick={async () => {
        // Logic to open candidate profile modal
        try {
          const iv = viewInterview || {};
          const candidateId = iv.candidate_student_id || iv.student_id || iv.candidateId || iv.candidate_id || iv.raw?.student_id || null;
          if (candidateId) {
            setProfileStudent({ id: candidateId });
            setIsProfileOpen(true);
            return;
          }

          // Fallback: search by name if no ID
          const name = (iv.candidate_name || iv.candidateName || "").toString().trim();
          if (!name) {
            alert('No candidate id or name available to view profile');
            return;
          }
          const res = await axios.get(`http://localhost:5000/api/students/search?q=${encodeURIComponent(name)}`);
          const json = res.data;
          const rows = json?.data ?? [];
          if (Array.isArray(rows) && rows.length > 0) {
            const first = rows[0];
            const id = first.id || first.student_id || first.user_detail_id || null;
            if (id) {
              setProfileStudent({ id });
              setIsProfileOpen(true);
              return;
            }
          }
          alert('Could not locate candidate profile');
        } catch (err) {
          console.error('Error opening candidate profile', err);
          alert('Error opening candidate profile');
        }
      }}>View Candidate Profile</Button>
    </div>
  </DialogContent>
</Dialog>

{/* Student Profile Modal */}
<StudentProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} student={profileStudent} fetchFresh />

{/* Reschedule Interview Modal */}
<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
  <DialogContent aria-describedby="edit-desc">
    <DialogHeader>
      <DialogTitle>Reschedule Interview</DialogTitle>
    </DialogHeader>
    <p id="edit-desc" className="sr-only">Reschedule the selected interview by choosing a new date and time.</p>

    {/* Inputs for date and time */}
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 gap-4">
        <Label className="text-right">Date</Label>
        <Input
          type="date"
          value={editInterview.date}
          onChange={(e) => setEditInterview({ ...editInterview, date: e.target.value })}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Label className="text-right">Time</Label>
        <Input
          type="time"
          value={editInterview.time}
          onChange={(e) => setEditInterview({ ...editInterview, time: e.target.value })}
          className="col-span-3"
        />
      </div>
    </div>

    {/* Modal actions */}
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
      <Button onClick={handleEditSave}>Save</Button>
    </div>
  </DialogContent>
</Dialog>

{/* Confirm Delete Dialog */}
<Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
  <DialogContent aria-describedby="confirm-delete-desc">
    <DialogHeader>
      <DialogTitle>Delete Interview</DialogTitle>
    </DialogHeader>
    <p id="confirm-delete-desc" className="sr-only">Confirm deletion of the scheduled interview.</p>
    <p>Are you sure you want to delete this scheduled interview? This action cannot be undone.</p>

    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
      <Button className="bg-red-600 text-white" onClick={performConfirmedDelete}>Delete</Button>
    </div>
  </DialogContent>
</Dialog>
</motion.div>
  );
}
export default InterviewsSection;
