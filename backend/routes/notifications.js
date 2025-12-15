const express = require("express");
const router = express.Router();
const {
  listNotifications,
  countNotifications,
  createNotification,
  markNotificationRead,
  markAllRead,
  deleteNotification,
} = require("../controllers/notificationsController");

router.get("/", listNotifications);
router.get("/count", countNotifications);
router.post("/", createNotification);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllRead);
router.delete("/:id", deleteNotification);

module.exports = router;
