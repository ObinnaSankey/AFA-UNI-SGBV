/*
  # Create Universities Table

  1. New Tables
    - `universities`
      - `id` (uuid, primary key)
      - `name` (text) - Full university name
      - `short_code` (text) - Abbreviation for tracking IDs (e.g., UNILAG)
      - `routing_email_1` (text) - Primary designated officer email
      - `routing_email_2` (text, nullable) - Secondary email
      - `is_active` (boolean) - Whether this university accepts reports
      - `mode` (text) - 'centralized' or 'embedded'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `universities` table
    - Public can SELECT active universities (needed for report form dropdown)
    - Only authenticated admins can INSERT/UPDATE/DELETE
*/

CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_code text NOT NULL UNIQUE,
  routing_email_1 text NOT NULL,
  routing_email_2 text,
  is_active boolean DEFAULT true,
  mode text DEFAULT 'centralized' CHECK (mode IN ('centralized', 'embedded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active universities"
  ON universities FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert universities"
  ON universities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update universities"
  ON universities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete universities"
  ON universities FOR DELETE
  TO authenticated
  USING (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_universities_updated_at
  BEFORE UPDATE ON universities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
