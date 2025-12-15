import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../Company_Dashboard/ui/card";
import { Button } from "../Company_Dashboard/ui/button";
import { Badge } from "../Company_Dashboard/ui/badge";
import { Input } from "../Company_Dashboard/ui/input";
import { Label } from "../Company_Dashboard/ui/label";
import { Calendar, Clock, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../Company_Dashboard/ui/dialog";
import Footer from "../AboutPage/Footer";
import { useTheme } from "../../context/ThemeContext";

const statusColors = {
  scheduled: "bg-primary text-primary-foreground",
  completed: "bg-green-500 text-white",
  cancelled: "bg-red-600 text-white",
};

export default function InterviewGallery() {
  const { darkMode } = useTheme();
  const [interviews, setInterviews] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editInterview, setEditInterview] = useState({
    id: "",
    date: "",
    time: "",
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchInterviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/interviews`);
      const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];

      const data = raw.map((r) => ({
        id: r.id ?? r._id ?? r.interview_id ?? r.interviewId ?? null,
        candidate_name: r.candidate_name ?? r.candidateName ?? r.name ?? "",
        role: r.role ?? r.position ?? r.job ?? "",
        date: r.date ?? r.scheduled_date ?? null,
        time: r.time ?? r.scheduled_time ?? null,
        status: r.status ?? r.state ?? "Scheduled",
        raw: r,
      }));

      const ts = (it) => {
        if (!it.date) return 0;
        const time = it.time || "00:00:00";
        const iso = `${it.date}T${time}`;
        const d = new Date(iso);
        return isNaN(d.getTime()) ? 0 : d.getTime();
      };

      data.sort((a, b) => ts(a) - ts(b));
      setInterviews(data);
    } catch (err) {
      console.error("Error loading interviews:", err);
      setInterviews([]);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const initials = (name = "?") =>
    name
      .toString()
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/interviews/${id}`);
      fetchInterviews();
      toast.success("Interview deleted");
    } catch (err) {
      toast.error("Failed to delete interview");
    }
  };

  const confirmDelete = (id) => {
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const performConfirmedDelete = async () => {
    if (!pendingDeleteId) return;
    await handleDelete(pendingDeleteId);
    setPendingDeleteId(null);
    setIsConfirmOpen(false);
  };

  const openEdit = (it) => {
    setEditInterview({
      id: it.id,
      date: it.date?.split("T")[0] || it.date,
      time: it.time || "",
    });
    setIsEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editInterview.date || !editInterview.time)
      return alert("Select date and time");

    try {
      await axios.put(`${API_BASE}/api/interviews/${editInterview.id}`, {
        date: editInterview.date,
        time: editInterview.time,
      });

      setIsEditOpen(false);
      fetchInterviews();
    } catch (err) {
      console.error("Error updating interview:", err);
    }
  };

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="pt-20 px-4 pb-10 max-w-[1200px] mx-auto">
          <h1
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Upcoming Interviews ({interviews.length})
          </h1>

          <div className="grid gap-4">
            {interviews.length === 0 && (
              <div className={darkMode ? "text-gray-400" : "text-gray-500"}>
                No interviews scheduled.
              </div>
            )}

            {interviews.map((interview) => (
              <Card
                key={interview.id}
                className={`p-4 flex flex-col rounded-2xl ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {initials(interview.candidate_name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {interview.candidate_name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {interview.role || "Candidate"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {interview.date &&
                            new Date(interview.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{interview.time}</span>
                      </div>
                    </div>

                    <Badge
                      className={`${
                        statusColors[
                          (interview.status || "scheduled").toLowerCase()
                        ]
                      } capitalize`}
                    >
                      {interview.status}
                    </Badge>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(interview)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        onClick={() => confirmDelete(interview.id)}
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
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reschedule Interview</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">Date</Label>
                  <Input
                    type="date"
                    value={editInterview.date}
                    onChange={(e) =>
                      setEditInterview({
                        ...editInterview,
                        date: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">Time</Label>
                  <Input
                    type="time"
                    value={editInterview.time}
                    onChange={(e) =>
                      setEditInterview({
                        ...editInterview,
                        time: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Interview</DialogTitle>
              </DialogHeader>

              <p>Are you sure you want to delete this interview?</p>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 text-white"
                  onClick={performConfirmedDelete}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Footer */}
        <footer
          className={`w-full text-center py-4 text-sm transition-colors duration-300 border-t ${
            darkMode
              ? "bg-gray-900 text-gray-300 border-gray-700"
              : "bg-gray-100 text-gray-700 border-gray-300"
          }`}
        >
          <p>© 2025 Uptoskills. Built by learners.</p>
        </footer>
      </div>
    </>
  );
}
