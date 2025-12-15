//interviews.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const verifyToken = require("../middleware/auth");
const { pushNotification, notifyAdmins } = require("../utils/notificationService");

const formatInterviewSlot = (date, time) => {
  try {
    const slot = new Date(`${date}T${time}`);
    if (!Number.isNaN(slot.getTime())) {
      return slot.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  } catch (err) {
    // ignore formatting errors
  }
  return `${date} ${time}`;
};

// ✅ GET upcoming interviews count for a specific student
router.get('/count/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    // Get current date and time to filter only upcoming interviews
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    // Count upcoming interviews where status is 'Scheduled' and date/time is in the future
    const result = await pool.query(
      `SELECT COUNT(*) as count 
       FROM interviews 
       WHERE candidate_id = $1 
       AND status = 'Scheduled'
       AND (
         date > $2 
         OR (date = $2 AND time >= $3)
       )`,
      [studentId, currentDate, currentTime]
    );

    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    console.error('Error fetching upcoming interviews count:', error);
    res.status(500).json({ error: 'Server error while fetching upcoming interviews count' });
  }
});

// ✅ GET all interviews (sorted by date & time)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM interviews ORDER BY date, time ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ error: "Server error while fetching interviews" });
  }
});

// ✅ POST - Add new interview
router.post("/", verifyToken, async (req, res) => {
  try {
    const { candidateName, position, date, time, candidateId } = req.body;

    if (!candidateName || !position || !date || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert candidate_id as nullable column (value may be null)
    const result = await pool.query(
      `INSERT INTO interviews (candidate_name, role, date, time, status, candidate_id)
       VALUES ($1, $2, $3, $4, 'Scheduled', $5)
       RETURNING *`,
      [candidateName, position, date, time, candidateId ?? null]
    );

    const createdInterview = result.rows[0];
      const slotLabel = formatInterviewSlot(createdInterview.date, createdInterview.time);
      // also provide explicit readable date and time to avoid ambiguous concatenation in messages
      let readableDate = String(createdInterview.date);
      let readableTime = String(createdInterview.time);
      try {
        const dt = new Date(`${createdInterview.date}T${createdInterview.time}`);
        if (!Number.isNaN(dt.getTime())) {
          readableDate = dt.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
          readableTime = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        }
      } catch (err) {
        // fall back to raw strings
      }
    const ioInstance = req.app.get("io");

    // Notify the company/user who scheduled this interview (if authenticated)
    let schedulingCompanyName = null;
    try {
      const actor = req.user || null;
      if (actor && actor.id) {
        // derive a friendly company name from the actor payload
        schedulingCompanyName = actor.company_name || actor.name || actor.full_name || actor.username || null;
        await pushNotification({
          role: "company",
          recipientRole: "company",
          recipientId: actor.id,
          type: "interview",
          title: "Interview scheduled",
          message: `You scheduled an interview for ${candidateName} on ${readableDate} at ${readableTime}.`,
          metadata: {
            interviewId: createdInterview.id,
            candidateName,
            position,
            date: createdInterview.date,
            time: createdInterview.time,
          },
          io: ioInstance,
        });
      }
    } catch (companyNotifyError) {
      console.error("Company notification error (interview)", companyNotifyError);
    }

    try {
      // If caller supplied a candidateId, prefer it for notifications instead of name matching
      if (candidateId) {
        // Verify student exists
        const studentRow = await pool.query("SELECT id FROM students WHERE id = $1 LIMIT 1", [candidateId]);
        if (studentRow.rows.length) {
            const studentIdToNotify = studentRow.rows[0].id;
            const companyPart = schedulingCompanyName ? ` by ${schedulingCompanyName}` : "";
            await pushNotification({
              role: "student",
              recipientRole: "student",
              recipientId: studentIdToNotify,
              type: "interview",
              title: "Interview scheduled",
              message: `Your interview for ${position}${companyPart} is scheduled for ${readableDate} at ${readableTime}.`,
              metadata: {
                interviewId: createdInterview.id,
                candidateName: candidateName?.trim(),
                position,
                date: createdInterview.date,
                time: createdInterview.time,
              },
              io: ioInstance,
            });
          }
      } else {
        const trimmedCandidate = candidateName?.trim();
        if (trimmedCandidate) {
          const studentMatch = await pool.query(
            "SELECT id, full_name FROM students WHERE TRIM(full_name) ILIKE $1 LIMIT 1",
            [trimmedCandidate]
          );

          if (studentMatch.rows.length) {
            const companyPart = schedulingCompanyName ? ` by ${schedulingCompanyName}` : "";
            await pushNotification({
              role: "student",
              recipientRole: "student",
              recipientId: studentMatch.rows[0].id,
              type: "interview",
              title: "Interview scheduled",
              message: `Your interview for ${position}${companyPart} is scheduled for ${readableDate} at ${readableTime}.`,
              metadata: {
                interviewId: createdInterview.id,
                candidateName: trimmedCandidate,
                position,
                date: createdInterview.date,
                time: createdInterview.time,
              },
              io: ioInstance,
            });
          }
        }
      }
    } catch (studentNotifyError) {
      console.error("Student interview notification error", studentNotifyError);
    }

    try {
      const companyPart = schedulingCompanyName ? ` by ${schedulingCompanyName}` : "";
      await notifyAdmins({
        title: "Interview scheduled",
        message: `${candidateName} has an interview for ${position}${companyPart} on ${readableDate} at ${readableTime}.`,
        type: "interview",
        metadata: {
          interviewId: createdInterview.id,
          candidateName,
          position,
        },
        io: ioInstance,
      });
    } catch (adminInterviewError) {
      console.error("Admin notification error (interview)", adminInterviewError);
    }

    res.status(201).json(createdInterview);
  } catch (error) {
    console.error("Error adding interview:", error);
    res.status(500).json({ error: "Server error while adding interview" });
  }
});

// ✅ PUT - Update (Reschedule) interview
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: "Date and time are required" });
    }

    const result = await pool.query(
      "UPDATE interviews SET date = $1, time = $2 WHERE id = $3 RETURNING *",
      [date, time, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Interview not found" });
    }

    const updated = result.rows[0];

    // Friendly readable date/time
    let readableDate = String(updated.date);
    let readableTime = String(updated.time);
    try {
      const dt = new Date(`${updated.date}T${updated.time}`);
      if (!Number.isNaN(dt.getTime())) {
        readableDate = dt.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
        readableTime = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      }
    } catch (e) {}

    const ioInstance = req.app.get("io");

    // Notify admins
    try {
      await notifyAdmins({
        title: "Interview rescheduled",
        message: `${updated.candidate_name} interview rescheduled to ${readableDate} at ${readableTime}.`,
        type: "interview:reschedule",
        metadata: { interviewId: updated.id, date: updated.date, time: updated.time },
        io: ioInstance,
      });
    } catch (adminErr) {
      console.error("Admin notify error (reschedule):", adminErr);
    }

    // Notify student (if candidate_id present)
    try {
      const candidateId = updated.candidate_id || updated.candidateId || null;
      if (candidateId) {
        await pushNotification({
          role: "student",
          recipientRole: "student",
          recipientId: candidateId,
          type: "interview:reschedule",
          title: "Interview rescheduled",
          message: `Your interview for ${updated.role || 'the role'} has been rescheduled to ${readableDate} at ${readableTime}.`,
          metadata: { interviewId: updated.id },
          io: ioInstance,
        });
      } else if (updated.candidate_name) {
        // Try to match by name as a fallback
        try {
          const trimmed = String(updated.candidate_name).trim();
          const match = await pool.query("SELECT id FROM students WHERE TRIM(full_name) ILIKE $1 LIMIT 1", [trimmed]);
          if (match.rows.length) {
            await pushNotification({
              role: "student",
              recipientRole: "student",
              recipientId: match.rows[0].id,
              type: "interview:reschedule",
              title: "Interview rescheduled",
              message: `Your interview for ${updated.role || 'the role'} has been rescheduled to ${readableDate} at ${readableTime}.`,
              metadata: { interviewId: updated.id },
              io: ioInstance,
            });
          }
        } catch (e) {
          console.error('Student lookup error (reschedule):', e);
        }
      }
    } catch (studentErr) {
      console.error("Student notify error (reschedule):", studentErr);
    }

    // Notify company if we can identify a company or actor
    try {
      // If interview row contains a company_id or company field, prefer that
      const companyId = updated.company_id || updated.companyId || updated.created_by || null;
      if (companyId) {
        await pushNotification({
          role: "company",
          recipientRole: "company",
          recipientId: companyId,
          type: "interview:reschedule",
          title: "Interview rescheduled",
          message: `Interview for ${updated.candidate_name || 'candidate'} has been rescheduled to ${readableDate} at ${readableTime}.`,
          metadata: { interviewId: updated.id },
          io: ioInstance,
        });
      } else if (req.user && req.user.id && String(req.user.role).toLowerCase() === 'company') {
        // If the requester is an authenticated company, notify them
        await pushNotification({
          role: 'company',
          recipientRole: 'company',
          recipientId: req.user.id,
          type: 'interview:reschedule',
          title: 'Interview rescheduled',
          message: `You rescheduled the interview for ${updated.candidate_name || 'candidate'} to ${readableDate} at ${readableTime}.`,
          metadata: { interviewId: updated.id },
          io: ioInstance,
        });
      }
    } catch (companyErr) {
      console.error("Company notify error (reschedule):", companyErr);
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ error: "Server error while updating interview" });
  }
});

// ✅ DELETE - Remove interview
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM interviews WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Interview not found" });
    }

    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ error: "Server error while deleting interview" });
  }
});

module.exports = router;
