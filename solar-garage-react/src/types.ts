export type ClientStatus = 'installed' | 'prospect' | 'inactive';

export interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  location: string | null;
  status: ClientStatus;
  project_ref: string | null;
  notes: string | null;
  created_at?: string;
}

export interface SystemSpec {
  client_id: string;
  system_size: string | null;
  panels: string | null;
  inverter: string | null;
  battery: string | null;
  mount_type: string | null;
  grid_config: string | null;
  install_date: string | null;
}

export type OMState = 'upcoming' | 'done' | 'overdue';

export interface OMTask {
  id: string;
  client_id: string;
  label: string;
  due_date: string;
  state: OMState;
}

export type FollowupIcon = 'phone' | 'mail' | 'file' | 'user' | 'clock';

export interface Followup {
  id: string;
  client_id: string;
  note: string;
  icon: FollowupIcon;
  logged_at: string;
}

export type DocCategory =
  | 'proposal'
  | 'contract'
  | 'invoice'
  | 'site_survey'
  | 'warranty'
  | 'permit'
  | 'other';

export interface ClientDocument {
  id: string;
  client_id: string;
  file_name: string;
  storage_path: string;
  file_size: number | null;
  mime_type: string | null;
  category: DocCategory;
  uploaded_by: string | null;
  created_at: string;
}

export interface ClientDetailData {
  spec: SystemSpec | null;
  omTasks: OMTask[];
  followups: Followup[];
  documents: ClientDocument[];
}

export type NavFilter = 'all' | 'installed' | 'prospect' | 'overdue';
