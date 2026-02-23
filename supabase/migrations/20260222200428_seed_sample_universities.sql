/*
  # Seed Sample Universities

  Inserts 12 placeholder Nigerian universities with sample routing emails.
  ICT teams should replace these emails with actual institutional addresses.

  Each university has:
  - Full official name
  - Short code (used in Tracking IDs)
  - Two placeholder routing emails (Gender Center / designated authority)
*/

INSERT INTO universities (name, short_code, routing_email_1, routing_email_2, is_active, mode) VALUES
  ('University of Lagos', 'UNILAG', 'gendercenter@unilag.edu.ng', 'sgbv@unilag.edu.ng', true, 'centralized'),
  ('University of Ibadan', 'UI', 'gendercenter@ui.edu.ng', 'sgbv@ui.edu.ng', true, 'centralized'),
  ('Ahmadu Bello University, Zaria', 'ABU', 'gendercenter@abu.edu.ng', 'sgbv@abu.edu.ng', true, 'centralized'),
  ('University of Nigeria, Nsukka', 'UNN', 'gendercenter@unn.edu.ng', 'sgbv@unn.edu.ng', true, 'centralized'),
  ('Obafemi Awolowo University, Ile-Ife', 'OAU', 'gendercenter@oauife.edu.ng', 'sgbv@oauife.edu.ng', true, 'centralized'),
  ('University of Benin', 'UNIBEN', 'gendercenter@uniben.edu.ng', 'sgbv@uniben.edu.ng', true, 'centralized'),
  ('Bayero University, Kano', 'BUK', 'gendercenter@buk.edu.ng', 'sgbv@buk.edu.ng', true, 'centralized'),
  ('Federal University of Technology, Akure', 'FUTA', 'gendercenter@futa.edu.ng', 'sgbv@futa.edu.ng', true, 'centralized'),
  ('Lagos State University', 'LASU', 'gendercenter@lasu.edu.ng', 'sgbv@lasu.edu.ng', true, 'centralized'),
  ('Rivers State University', 'RSU', 'gendercenter@rsu.edu.ng', 'sgbv@rsu.edu.ng', true, 'centralized'),
  ('University of Port Harcourt', 'UNIPORT', 'gendercenter@uniport.edu.ng', 'sgbv@uniport.edu.ng', true, 'centralized'),
  ('Nnamdi Azikiwe University, Awka', 'NAU', 'gendercenter@nau.edu.ng', 'sgbv@nau.edu.ng', true, 'centralized')
ON CONFLICT (short_code) DO NOTHING;
