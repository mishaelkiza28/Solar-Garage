import { useCallback, useEffect, useState } from 'react';
import { sb, DEMO } from '../lib/supabase';
import { DEMO_DETAIL } from '../lib/demoData';
import type { ClientDetailData } from '../types';

const EMPTY: ClientDetailData = { spec: null, omTasks: [], followups: [], documents: [] };

export function useClientDetail(clientId: string | null) {
  const [data, setData] = useState<ClientDetailData>(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!clientId) {
      setData(EMPTY);
      return;
    }
    setLoading(true);

    if (DEMO || !sb) {
      setData(DEMO_DETAIL[clientId] || EMPTY);
      setLoading(false);
      return;
    }

    const [specRes, omRes, fuRes, docRes] = await Promise.all([
      sb.from('system_specs').select('*').eq('client_id', clientId).maybeSingle(),
      sb.from('om_tasks').select('*').eq('client_id', clientId).order('due_date'),
      sb.from('followups').select('*').eq('client_id', clientId).order('logged_at', { ascending: false }),
      sb.from('client_documents').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
    ]);

    setData({
      spec: specRes.data ?? null,
      omTasks: omRes.data ?? [],
      followups: fuRes.data ?? [],
      documents: docRes.data ?? [],
    });
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, reload: load };
}
