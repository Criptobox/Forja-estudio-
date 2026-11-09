CREATE TABLE IF NOT EXISTS providers (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, endpoint TEXT NOT NULL,
 models_path TEXT NOT NULL, chat_path TEXT NOT NULL,
 auth_mode TEXT NOT NULL CHECK (auth_mode IN ('bearer','x-api-key','api-key')),
 key_iv TEXT NOT NULL, key_ciphertext TEXT NOT NULL,
 working_models TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS providers_updated_at_idx ON providers(updated_at);
CREATE TABLE IF NOT EXISTS login_attempts (
 id INTEGER PRIMARY KEY AUTOINCREMENT, ip_hash TEXT NOT NULL, attempted_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS login_attempts_ip_time_idx ON login_attempts(ip_hash,attempted_at);
