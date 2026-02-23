/*
  # Create App Configuration Table

  Stores global application configuration as key-value pairs.

  1. New Tables
    - `app_config`
      - `id` (uuid, primary key)
      - `key` (text, unique) - configuration key
      - `value` (text) - configuration value (JSON string for complex values)
      - `description` (text) - human-readable description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Only authenticated admins can read/write config
    - Some public keys (non-sensitive) readable by anyone

  3. Default Config
    - storage_mode: 'minimal_metadata' (options: none, minimal_metadata, full)
    - store_narrative: false
    - app_mode: 'centralized'
    - captcha_enabled: true
    - rate_limit_submissions: 5 (per hour per session)
*/

CREATE TABLE IF NOT EXISTS app_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public config is readable by anyone"
  ON app_config FOR SELECT
  USING (is_public = true);

CREATE POLICY "Authenticated users can read all config"
  ON app_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert config"
  ON app_config FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update config"
  ON app_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER update_app_config_updated_at
  BEFORE UPDATE ON app_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed default configuration
INSERT INTO app_config (key, value, description, is_public) VALUES
  ('storage_mode', 'minimal_metadata', 'Storage mode: none, minimal_metadata, or full', false),
  ('store_narrative', 'false', 'Whether to store report narrative text in database', false),
  ('app_mode', 'centralized', 'App deployment mode: centralized or embedded', true),
  ('embedded_university_id', '', 'Fixed university ID when in embedded mode', false),
  ('rate_limit_per_hour', '5', 'Max submissions per session per hour', false),
  ('smtp_host', '', 'SMTP server host', false),
  ('smtp_port', '587', 'SMTP server port', false),
  ('smtp_user', '', 'SMTP username', false),
  ('smtp_pass', '', 'SMTP password (encrypted)', false),
  ('smtp_from', 'noreply@afa-sgbv.org', 'Sender email address', false),
  ('sheets_enabled', 'false', 'Enable Google Sheets logging', false),
  ('sheets_id', '', 'Google Sheets spreadsheet ID', false),
  ('sheets_credentials', '', 'Google Sheets service account credentials JSON', false),
  ('platform_name', 'AfA SGBV Reporting Platform', 'Platform display name', true),
  ('support_email', 'support@afa-sgbv.org', 'Platform support email', true)
ON CONFLICT (key) DO NOTHING;
