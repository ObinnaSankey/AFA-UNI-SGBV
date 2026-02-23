/*
  # Add Routing Emails to App Config

  Adds institution-level routing email keys to app_config so reports
  can be delivered without a faculty/university selector step.
*/

INSERT INTO app_config (key, value, description, is_public) VALUES
  ('routing_email_1', '', 'Primary report routing email (designated officer)', false),
  ('routing_email_2', '', 'Secondary report routing email (optional backup)', false),
  ('institution_name', 'Your Institution', 'Institution name shown in emails and UI', true)
ON CONFLICT (key) DO NOTHING;
