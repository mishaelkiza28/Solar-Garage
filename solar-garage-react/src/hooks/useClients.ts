import { useCallback, useEffect, useMemo, useState } from 'react';
import { sb, DEMO } from '../lib/supabase';
import { DEMO_CLIENTS } from '../lib/demoData';
import type { Client, NavFilter } from '../types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NavFilter>('all');
  const [search, setSearch] = useState('');
  const [overdueCount, setOverdueCount] = useState(0);

  const loadClients = useCallback(async () => {
    setLoading(true);
    if (DEMO || !sb) {
      setClients(DEMO_CLIENTS);
      setOverdueCount(1); // matches Ssebulime Patrick's overdue firmware task in demo data
      setLoading(false);
      return;
    }

    const { data, error } = await sb
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setClients(data as Client[]);

    const { count } = await sb
      .from('om_tasks')
      .select('id', { count: 'exact', head: true })
      .eq('state', 'overdue');
    setOverdueCount(count || 0);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchesFilter = filter === 'all' || filter === 'overdue' || c.status === filter;
      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        (c.location || '').toLowerCase().includes(term) ||
        (c.project_ref || '').toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [clients, filter, search]);

  const counts = useMemo(
    () => ({
      all: clients.length,
      installed: clients.filter((c) => c.status === 'installed').length,
      prospect: clients.filter((c) => c.status === 'prospect').length,
      overdue: overdueCount,
    }),
    [clients, overdueCount]
  );

  return {
    clients,
    filtered,
    loading,
    filter,
    setFilter,
    search,
    setSearch,
    counts,
    reload: loadClients,
  };
}
