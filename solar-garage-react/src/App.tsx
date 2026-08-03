import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useClients } from './hooks/useClients';
import { useClientDetail } from './hooks/useClientDetail';
import { useToast } from './hooks/useToast';
import { sb, DEMO, BUCKET } from './lib/supabase';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import ClientList from './components/ClientList';
import DetailPanel from './components/DetailPanel';
import ClientFormModal, { type ClientFormValues } from './components/modals/ClientFormModal';
import FollowUpModal from './components/modals/FollowUpModal';
import OMTaskModal from './components/modals/OMTaskModal';
import DocumentUploadModal from './components/modals/DocumentUploadModal';
import Icon from './components/icons/Icon';
import type { Client, ClientDocument, DocCategory, FollowupIcon, OMState } from './types';

type ModalKind = 'client' | 'followup' | 'omtask' | 'doc' | null;

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { filtered, loading: listLoading, filter, setFilter, search, setSearch, counts, reload } = useClients();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const toast = useToast();

  const selectedClient = filtered.find((c) => c.id === selectedId) || null;
  const { data: detail, reload: reloadDetail } = useClientDetail(selectedId);

  if (authLoading) {
    return <div className="app-loading"><span className="spinner" /></div>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  // ── Client CRUD ──────────────────────────────────────────
  async function handleSaveClient(values: ClientFormValues) {
    const payload = {
      name: values.name,
      phone: values.phone || null,
      email: values.email || null,
      location: values.location || null,
      status: values.status,
      project_ref: values.project_ref || null,
      notes: values.notes || null,
    };
    const specPayload = values.status === 'installed' ? {
      system_size: values.size || null,
      panels: values.panels || null,
      inverter: values.inverter || null,
      battery: values.battery || null,
      mount_type: values.mount || null,
      grid_config: values.grid || null,
      install_date: values.installDate || null,
    } : null;

    if (DEMO || !sb) {
      toast(editingClient ? 'Updated (demo mode — not persisted)' : 'Added (demo mode — not persisted)', 'success');
      setModal(null);
      return;
    }

    try {
      let clientId = editingClient?.id;
      if (editingClient) {
        const { error } = await sb.from('clients').update(payload).eq('id', editingClient.id);
        if (error) throw error;
      } else {
        const { data, error } = await sb.from('clients').insert(payload).select().single();
        if (error) throw error;
        clientId = data.id;
      }
      if (specPayload && clientId) {
        const { error } = await sb.from('system_specs').upsert({ ...specPayload, client_id: clientId }, { onConflict: 'client_id' });
        if (error) throw error;
      }
      toast(editingClient ? 'Client updated' : 'Client added', 'success');
      setModal(null);
      await reload();
      if (clientId) setSelectedId(clientId);
      if (clientId === selectedId) reloadDetail();
    } catch (e) {
      toast('Error: ' + (e as Error).message, 'error');
    }
  }

  async function handleDeleteClient() {
    if (!selectedClient) return;
    if (!confirm('Delete this client and all their data? This cannot be undone.')) return;
    if (DEMO || !sb) { toast('Deleted (demo mode)', 'success'); setSelectedId(null); return; }

    const { error } = await sb.from('clients').delete().eq('id', selectedClient.id);
    if (error) { toast('Delete failed: ' + error.message, 'error'); return; }
    toast('Client deleted', 'success');
    setSelectedId(null);
    await reload();
  }

  // ── Follow-ups ───────────────────────────────────────────
  async function handleSaveFollowup(note: string, icon: FollowupIcon, date: string) {
    if (DEMO || !sb || !selectedId) { toast('Logged (demo mode — not persisted)', 'success'); setModal(null); return; }
    const { error } = await sb.from('followups').insert({ client_id: selectedId, note, icon, logged_at: date });
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    toast('Follow-up logged', 'success');
    setModal(null);
    reloadDetail();
  }

  // ── O&M tasks ────────────────────────────────────────────
  async function handleSaveOmTask(label: string, dueDate: string, state: OMState) {
    if (DEMO || !sb || !selectedId) { toast('Task added (demo mode — not persisted)', 'success'); setModal(null); return; }
    const { error } = await sb.from('om_tasks').insert({ client_id: selectedId, label, due_date: dueDate, state });
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    toast('O&M task added', 'success');
    setModal(null);
    reloadDetail();
  }

  async function handleMarkOmDone(taskId: string) {
    if (DEMO || !sb) { toast('Marked done (demo mode)', 'success'); return; }
    const { error } = await sb.from('om_tasks').update({ state: 'done' }).eq('id', taskId);
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    toast('Task marked done', 'success');
    reloadDetail();
    reload();
  }

  // ── Documents ────────────────────────────────────────────
  async function handleUploadDocument(file: File, category: DocCategory, uploadedBy: string) {
    if (DEMO || !sb || !selectedId) { toast('Upload works once Supabase is connected', 'error'); return; }

    const safeName = file.name.replace(/[^a-zA-Z0-9._\-() ]/g, '_');
    const storagePath = `${selectedId}/${Date.now()}_${safeName}`;

    const { error: uploadError } = await sb.storage.from(BUCKET).upload(storagePath, file, { upsert: false, contentType: file.type });
    if (uploadError) throw uploadError;

    const { error: metaError } = await sb.from('client_documents').insert({
      client_id: selectedId,
      file_name: file.name,
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.type,
      category,
      uploaded_by: uploadedBy || null,
    });
    if (metaError) throw metaError;

    toast('Document uploaded', 'success');
    reloadDetail();
  }

  async function handleDownloadDoc(doc: ClientDocument) {
    if (DEMO || !sb) { toast('Download available once Supabase is connected', 'error'); return; }
    const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(doc.storage_path, 60);
    if (error) { toast('Could not create download link', 'error'); return; }
    const a = document.createElement('a');
    a.href = data.signedUrl;
    a.download = doc.file_name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function handleDeleteDoc(doc: ClientDocument) {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    if (DEMO || !sb) { toast('Delete available once Supabase is connected', 'error'); return; }

    const { error: stErr } = await sb.storage.from(BUCKET).remove([doc.storage_path]);
    if (stErr) { toast('Could not remove file: ' + stErr.message, 'error'); return; }

    const { error: dbErr } = await sb.from('client_documents').delete().eq('id', doc.id);
    if (dbErr) { toast('File removed but metadata error: ' + dbErr.message, 'error'); return; }

    toast('Document deleted', 'success');
    reloadDetail();
  }

  const viewTitles: Record<string, string> = {
    all: 'All clients',
    installed: 'Installed clients',
    prospect: 'Prospects',
    overdue: 'Overdue O&M',
  };

  return (
    <div className="app">
      {DEMO && <div id="demo-banner">Demo mode — add VITE_SUPABASE_URL &amp; VITE_SUPABASE_KEY to your .env to connect live data</div>}

      <Sidebar
        filter={filter}
        onFilterChange={setFilter}
        counts={counts}
        userEmail={user.email ?? null}
        onSignOut={signOut}
        onAddClient={() => { setEditingClient(null); setModal('client'); }}
      />

      <main className="main">
        <div className="main-hdr">
          <h2>{viewTitles[filter]}</h2>
          <div className="search-box">
            <Icon name="search" />
            <input type="text" placeholder="Search clients…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search clients" />
          </div>
        </div>

        <div className="main-body">
          {listLoading ? (
            <div className="client-list"><div className="list-msg"><span className="spinner" /></div></div>
          ) : (
            <ClientList clients={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          )}

          {selectedClient ? (
            <DetailPanel
              client={selectedClient}
              detail={detail}
              onEdit={() => { setEditingClient(selectedClient); setModal('client'); }}
              onDelete={handleDeleteClient}
              onLogFollowup={() => setModal('followup')}
              onAddOmTask={() => setModal('omtask')}
              onMarkOmDone={handleMarkOmDone}
              onUploadDoc={() => setModal('doc')}
              onDownloadDoc={handleDownloadDoc}
              onDeleteDoc={handleDeleteDoc}
            />
          ) : (
            <div className="detail-panel">
              <div className="empty-state">
                <Icon name="panel" size={48} />
                <p>Select a client to view details</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {modal === 'client' && (
        <ClientFormModal
          client={editingClient}
          existingSpec={editingClient?.id === selectedId ? detail.spec : null}
          onClose={() => setModal(null)}
          onSave={handleSaveClient}
        />
      )}
      {modal === 'followup' && <FollowUpModal onClose={() => setModal(null)} onSave={handleSaveFollowup} />}
      {modal === 'omtask' && <OMTaskModal onClose={() => setModal(null)} onSave={handleSaveOmTask} />}
      {modal === 'doc' && <DocumentUploadModal onClose={() => setModal(null)} onUpload={handleUploadDocument} />}
    </div>
  );
}
