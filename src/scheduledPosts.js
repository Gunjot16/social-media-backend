const cron = require("node-cron");
const { query } = require("./utils/database");

const publishScheduledPosts = async () => {
  try {
    const result = await query(
      `UPDATE posts
       SET is_deleted = false
       WHERE scheduled_at IS NOT NULL
         AND scheduled_at <= NOW()
         AND is_deleted = true
       RETURNING id`
    );
    if (result.rowCount > 0) {
      console.log(`[Scheduled] Published ${result.rowCount} post(s)`);
    }
  } catch (error) {
    console.error("Scheduled publishing error:", error);
  }
};

cron.schedule("* * * * *", publishScheduledPosts);
