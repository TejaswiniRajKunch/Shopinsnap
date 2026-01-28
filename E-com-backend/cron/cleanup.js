// cron/cleanup.js
const cron = require('node-cron');
const db = require('../db');

function startCleanupJobs() {
  // Run daily at 03:00 AM
  cron.schedule('0 3 * * *', async () => {
    try {
      // 1) Permanently delete accounts soft-deleted > 15 days ago
      const res1 = await db.query(`
        DELETE FROM users
        WHERE is_deleted = true
          AND deleted_at < NOW() - INTERVAL '15 days'
        RETURNING user_id
      `);
      if (res1.rowCount) console.log('[cleanup] permanently deleted soft-deleted users:', res1.rowCount);

      // 2) Delete accounts that were never logged in within 15 days of creation
      const res2 = await db.query(`
        DELETE FROM users
        WHERE last_login IS NULL
          AND created_at < NOW() - INTERVAL '15 days'
        RETURNING user_id
      `);
      if (res2.rowCount) console.log('[cleanup] deleted never-logged-in users:', res2.rowCount);
    } catch (err) {
      console.error('[cleanup] error', err);
    }
  });

  console.log('Cleanup cron jobs scheduled.');
}

module.exports = { startCleanupJobs };
