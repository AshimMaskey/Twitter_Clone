import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const notifications = await Notification.find({
      to: req.user._id,
    }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: req.user._id }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const deleteNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await Notification.deleteMany({ to: req.user._id });
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;
    const notification = await findById(notificationId);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });

    if (notification.to.toString() !== userId.toString())
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this!" });
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotification controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
