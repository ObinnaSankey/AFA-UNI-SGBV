export type IncidentType =
  | 'sexual_harassment'
  | 'attempted_assault'
  | 'assault'
  | 'intimidation_retaliation'
  | 'other';

export type LocationType = 'on_campus' | 'off_campus' | 'online' | 'other';

export interface ReportFormData {
  incidentType: IncidentType | '';
  locationType: LocationType | '';
  locationDetail: string;
  incidentDate: string;
  narrative: string;
  peopleInvolved: string;
  isAnonymous: boolean;
  wantsFollowup: boolean;
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  consentGiven: boolean;
  files: File[];
  skipEvidence: boolean;
}

export interface AppConfig {
  storage_mode: 'none' | 'minimal_metadata' | 'full';
  store_narrative: boolean;
  rate_limit_per_hour: number;
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
  smtp_from: string;
  sheets_enabled: boolean;
  sheets_id: string;
  sheets_credentials: string;
  platform_name: string;
  support_email: string;
  routing_email_1: string;
  routing_email_2: string;
  institution_name: string;
}
