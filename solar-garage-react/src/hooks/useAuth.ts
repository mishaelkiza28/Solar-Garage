import { useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { sb, DEMO } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: !DEMO,
    error: null,
  });

  useEffect(() => {
    if (DEMO || !sb) {
      // In demo mode, drop straight into the app as a stand-in user.
      setState({ user: { id: 'demo', email: 'demo@solargarage.ug' } as User, loading: false, error: null });
      return;
    }

    sb.auth.getSession().then(({ data }) => {
      setState((s) => ({ ...s, user: data.session?.user ?? null, loading: false }));
    });

    const { data: listener } = sb.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({ ...s, user: session?.user ?? null, loading: false }));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!sb) return { error: 'Demo mode — connect Supabase to sign in.' };
    setState((s) => ({ ...s, error: null }));
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setState((s) => ({ ...s, error: error.message }));
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!sb) return { error: 'Demo mode — connect Supabase to create an account.' };
    setState((s) => ({ ...s, error: null }));
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) setState((s) => ({ ...s, error: error.message }));
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    if (!sb) return;
    await sb.auth.signOut();
  }, []);

  return { ...state, signIn, signUp, signOut };
}
