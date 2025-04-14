import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  deleteNotification,
  deleteNotifications,
  getNotifications,
} from "../contollers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.get("/:id", protectRoute, deleteNotification);

export default router;
