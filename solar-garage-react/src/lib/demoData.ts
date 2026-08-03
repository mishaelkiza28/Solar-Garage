import type { Client, ClientDetailData } from '../types';

export const DEMO_CLIENTS: Client[] = [
  { id: '1', name: 'Brenda Nekyesa Ouma', phone: '+256 772 123 456', email: 'brenda.ouma@gmail.com', location: 'Kampala, Uganda', status: 'installed', project_ref: 'Project 219', notes: 'Client satisfied with installation. Follow up on portal login.' },
  { id: '2', name: 'Ssebulime Patrick', phone: '+256 700 987 654', email: 'patrick.ssebulime@yahoo.com', location: 'Wakiso, Uganda', status: 'installed', project_ref: 'Project 218', notes: 'Inverter firmware update still pending — priority before next inspection.' },
  { id: '3', name: 'GIA – Golden Investment Assoc.', phone: '+256 414 000 111', email: 'info@giauganda.org', location: 'Kampala, Uganda', status: 'installed', project_ref: 'Project 215', notes: 'Institutional client — coordinate with site manager before visits.' },
  { id: '4', name: 'Akello Grace', phone: '+256 753 456 789', email: 'grace.akello@outlook.com', location: 'Gulu, Uganda', status: 'prospect', project_ref: null, notes: 'Hot lead. Site in northern Uganda — Oyam area. Referred by Patrick.' },
  { id: '5', name: 'Kavuma Moses Enterprises', phone: '+256 781 222 333', email: 'moses@kavuma.ug', location: 'Entebbe, Uganda', status: 'prospect', project_ref: null, notes: 'Commercial. Decision pending board approval. Follow up first week of August.' },
];

export const DEMO_DETAIL: Record<string, ClientDetailData> = {
  '1': {
    spec: { client_id: '1', system_size: '6.15 kWp', panels: 'JA Solar 410W × 15', inverter: 'Deye 5kW Hybrid', battery: 'Deye LFP 100Ah × 2 (parallel)', mount_type: 'Roof-mounted', grid_config: 'Hybrid', install_date: '2026-06-15' },
    omTasks: [
      { id: 'o1', client_id: '1', label: 'Commissioning check', due_date: '2026-06-15', state: 'done' },
      { id: 'o2', client_id: '1', label: 'Panel cleaning', due_date: '2026-09-15', state: 'upcoming' },
      { id: 'o3', client_id: '1', label: '6-month inspection', due_date: '2026-12-15', state: 'upcoming' },
    ],
    followups: [],
    documents: [
      { id: 'd1', client_id: '1', file_name: 'Project_219_Proposal_v2.pdf', storage_path: '1/Project_219_Proposal_v2.pdf', file_size: 284210, mime_type: 'application/pdf', category: 'proposal', uploaded_by: 'Mishael', created_at: '2026-05-10T09:00:00Z' },
      { id: 'd2', client_id: '1', file_name: 'Project_219_Contract_Signed.pdf', storage_path: '1/Project_219_Contract_Signed.pdf', file_size: 192340, mime_type: 'application/pdf', category: 'contract', uploaded_by: 'Mishael', created_at: '2026-05-20T14:00:00Z' },
      { id: 'd3', client_id: '1', file_name: 'Site_Survey_Brenda.jpg', storage_path: '1/Site_Survey_Brenda.jpg', file_size: 841020, mime_type: 'image/jpeg', category: 'site_survey', uploaded_by: 'Mishael', created_at: '2026-04-28T11:00:00Z' },
    ],
  },
  '2': {
    spec: { client_id: '2', system_size: '3.075 kWp', panels: 'JA Solar 410W × 7', inverter: 'Deye 3kW Hybrid', battery: 'Deye LFP 100Ah × 1', mount_type: 'Roof-mounted', grid_config: 'Hybrid', install_date: '2026-05-10' },
    omTasks: [
      { id: 'o4', client_id: '2', label: 'Commissioning check', due_date: '2026-05-10', state: 'done' },
      { id: 'o5', client_id: '2', label: 'Inverter firmware update', due_date: '2026-07-10', state: 'overdue' },
      { id: 'o6', client_id: '2', label: '6-month inspection', due_date: '2026-11-10', state: 'upcoming' },
    ],
    followups: [],
    documents: [
      { id: 'd4', client_id: '2', file_name: 'Project_218_BOQ_Final.xlsx', storage_path: '2/Project_218_BOQ_Final.xlsx', file_size: 54120, mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', category: 'invoice', uploaded_by: 'Mishael', created_at: '2026-04-15T10:00:00Z' },
    ],
  },
  '3': {
    spec: { client_id: '3', system_size: '4.5 kWp', panels: 'JA Solar 410W × 11', inverter: 'Deye 5kW Hybrid', battery: 'Deye LFP 100Ah × 2 (series)', mount_type: 'Ground-mounted', grid_config: 'Off-grid', install_date: '2026-02-20' },
    omTasks: [
      { id: 'o7', client_id: '3', label: '6-month inspection', due_date: '2026-08-20', state: 'upcoming' },
      { id: 'o8', client_id: '3', label: 'Battery health check', due_date: '2026-08-20', state: 'upcoming' },
      { id: 'o9', client_id: '3', label: 'Annual service', due_date: '2027-02-20', state: 'upcoming' },
    ],
    followups: [],
    documents: [],
  },
  '4': {
    spec: null,
    omTasks: [],
    followups: [
      { id: 'f1', client_id: '4', note: 'Sent site survey questionnaire — awaiting response.', icon: 'phone', logged_at: '2026-07-20T10:00:00Z' },
      { id: 'f2', client_id: '4', note: 'Client interested in 3–5 kWp off-grid system for rural home in Oyam area.', icon: 'file', logged_at: '2026-07-15T14:30:00Z' },
      { id: 'f3', client_id: '4', note: 'Initial call — referred by Ssebulime Patrick.', icon: 'user', logged_at: '2026-07-10T09:00:00Z' },
    ],
    documents: [],
  },
  '5': {
    spec: null,
    omTasks: [],
    followups: [
      { id: 'f4', client_id: '5', note: 'Sent revised proposal — 10 kWp commercial system.', icon: 'mail', logged_at: '2026-07-25T11:00:00Z' },
      { id: 'f5', client_id: '5', note: 'Client requested time to review proposal with board.', icon: 'clock', logged_at: '2026-07-18T16:00:00Z' },
      { id: 'f6', client_id: '5', note: 'Site survey completed. Load audit shows 8–12 kWp requirement.', icon: 'file', logged_at: '2026-07-05T09:30:00Z' },
    ],
    documents: [],
  },
};
