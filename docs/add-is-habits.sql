-- 1) Tambah field baru is_habits di tabel tasks
ALTER TABLE tasks
  ADD COLUMN is_habits ENUM('yes','no') NOT NULL DEFAULT 'no' AFTER deadline;

-- 2) Optional: index untuk mempercepat query tab task/habits per user
CREATE INDEX idx_tasks_user_habits ON tasks(user_id, is_habits);
