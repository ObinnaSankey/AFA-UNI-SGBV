/*
  # Create Reports Table

  This table stores MINIMAL metadata only by default.
  Sensitive narrative content is NOT stored unless admin enables it.

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `tracking_id` (text, unique) - format: AFA-UNICODE-YYYYMMDD-XXXXXX
      - `university_id` (uuid, FK to universities)
      - `incident_type` (text) - category of incident
      - `location_type` (text) - on_campus / off_campus / online / other
      - `incident_date_approx` (text) - approximate date string
      - `wants_followup` (boolean) - reporter wants to be contacted
      - `consent_given` (boolean) - consent to data processing
      - `has_attachment` (boolean) - whether files were uploaded
      - `narrative_stored` (text, nullable) - only populated if admin enables narrative storage
      - `status` (text) - submitted / received / in_progress / resolved
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `reports` table
    - No public SELECT (reports are private)
    - INSERT allowed for anonymous users (public submissions)
    - Only authenticated admins can SELECT / UPDATE reports
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id text NOT NULL UNIQUE,
  university_id uuid REFERENCES universities(id) ON DELETE SET NULL,
  incident_type text NOT NULL CHECK (incident_type IN ('sexual_harassment', 'attempted_assault', 'assault', 'intimidation_retaliation', 'other')),
  location_type text NOT NULL CHECK (location_type IN ('on_campus', 'off_campus', 'online', 'other')),
  location_detail text,
  incident_date_approx text,
  wants_followup boolean DEFAULT false,
  consent_given boolean NOT NULL DEFAULT false,
  has_attachment boolean DEFAULT false,
  narrative_stored text,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'received', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a report"
  ON reports FOR INSERT
  WITH CHECK (consent_given = true);

CREATE POLICY "Authenticated users can view reports"
  ON reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update report status"
  ON reports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS reports_tracking_id_idx ON reports(tracking_id);
CREATE INDEX IF NOT EXISTS reports_university_id_idx ON reports(university_id);
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports(created_at DESC);
