import pg from "pg";
import config from "../config/index.js";

const { Pool } = pg;

class Database {
  constructor() {
    if (!config.database.enabled) {
      console.log("⚠️  PostgreSQL disabled (using Redis only)");
      this.pool = null;
      return;
    }

    if (config.database.type === "postgres") {
      this.pool = new Pool({
        host: config.database.host,
        port: config.database.port,
        database: config.database.database,
        user: config.database.user,
        password: config.database.password,
      });
    }
  }

  async initialize() {
    if (!this.pool) return;

    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
        )
      `);

      console.log("✅ PostgreSQL tables initialized");
    } catch (error) {
      console.error("❌ PostgreSQL initialization error:", error.message);
    }
  }

  async saveSession(sessionId) {
    if (!this.pool) return;

    await this.pool.query(
      `INSERT INTO chat_sessions (session_id) VALUES ($1) ON CONFLICT (session_id) DO NOTHING`,
      [sessionId]
    );
  }

  async saveMessage(sessionId, role, content) {
    if (!this.pool) return;

    await this.saveSession(sessionId);
    await this.pool.query(
      `INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)`,
      [sessionId, role, content]
    );
  }

  async getSessionHistory(sessionId) {
    if (!this.pool) return [];

    const result = await this.pool.query(
      `SELECT role, content, timestamp FROM chat_messages WHERE session_id = $1 ORDER BY timestamp ASC`,
      [sessionId]
    );

    return result.rows;
  }

  async deleteSession(sessionId) {
    if (!this.pool) return;

    await this.pool.query(`DELETE FROM chat_sessions WHERE session_id = $1`, [
      sessionId,
    ]);
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

export default new Database();
