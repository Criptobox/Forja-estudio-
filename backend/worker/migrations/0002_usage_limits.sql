-- Límites por proveedor y contabilidad agregada de uso.
ALTER TABLE providers ADD COLUMN requests_per_day INTEGER NOT NULL DEFAULT 300;
ALTER TABLE providers ADD COLUMN requests_per_minute INTEGER NOT NULL DEFAULT 60;

CREATE TABLE IF NOT EXISTS provider_usage_daily (
  provider_id TEXT NOT NULL,
  usage_date TEXT NOT NULL,
  requests INTEGER NOT NULL DEFAULT 0,
  successes INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  minute_bucket TEXT NOT NULL DEFAULT '',
  requests_minute INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (provider_id, usage_date)
);
CREATE INDEX IF NOT EXISTS provider_usage_daily_date_idx ON provider_usage_daily(usage_date);

CREATE TABLE IF NOT EXISTS provider_usage_models (
  provider_id TEXT NOT NULL,
  usage_date TEXT NOT NULL,
  model TEXT NOT NULL,
  action TEXT NOT NULL,
  requests INTEGER NOT NULL DEFAULT 0,
  successes INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (provider_id, usage_date, model, action)
);
CREATE INDEX IF NOT EXISTS provider_usage_models_date_idx ON provider_usage_models(usage_date);
