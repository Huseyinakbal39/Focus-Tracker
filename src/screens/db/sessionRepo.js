import { initDb } from './db';

export async function insertSession({ startedAt, endedAt, durationMinutes, category, distractions }) {
  const db = await initDb();

  await db.runAsync(
    `INSERT INTO focus_sessions (started_at, ended_at, duration_minutes, category, distractions)
     VALUES (?, ?, ?, ?, ?)`,
    startedAt,
    endedAt,
    durationMinutes,
    category,
    distractions
  );
}

export async function getAllSessions() {
  const db = await initDb();

  return await db.getAllAsync(
    `SELECT id, started_at, ended_at, duration_minutes, category, distractions
     FROM focus_sessions
     ORDER BY id DESC`
  );
}

export async function clearSessions() {
  const db = await initDb();
  await db.execAsync(`DELETE FROM focus_sessions;`);
}
