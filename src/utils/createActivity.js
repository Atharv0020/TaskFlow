const Activity = require("../models/Activity");

const createActivity = async ({
  taskId,
  userId,
  action,
  description,
  oldValue = null,
  newValue = null,
}) => {
  try {
    if (!taskId || !userId || !action || !description) {
      console.error("Missing required activity fields");

      return null;
    }

    const activity = await Activity.create({
      taskId,
      userId,
      action,
      description,
      oldValue,
      newValue,
    });

    return activity;
  } catch (error) {
    console.error("Activity creation error:", error);

    // Activity fail झाली तरी main operation fail करू नये
    return null;
  }
};

module.exports = createActivity;