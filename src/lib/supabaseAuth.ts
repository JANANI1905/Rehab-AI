import { supabase } from '@/integrations/supabase/client';

export interface AuthUser {
  uid: string;
  email: string | undefined;
}

export function subscribeToAuthState(callback: (user: AuthUser | null) => void) {
  let finished = false;

  const timeoutId = setTimeout(() => {
    if (!finished) {
      finished = true;
      // Check if we have an active session in local storage (e.g. offline admin)
      const stored = localStorage.getItem('rehabai_offline_user');
      if (stored) {
        try {
          callback(JSON.parse(stored));
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    }
  }, 2500);

  // Get initial session
  supabase.auth.getSession()
    .then(({ data: { session } }) => {
      if (finished) return;
      clearTimeout(timeoutId);
      finished = true;
      if (session?.user) {
        const u = {
          uid: session.user.id,
          email: session.user.email,
        };
        localStorage.setItem('rehabai_offline_user', JSON.stringify(u));
        callback(u);
      } else {
        const stored = localStorage.getItem('rehabai_offline_user');
        if (stored) {
          try {
            callback(JSON.parse(stored));
            return;
          } catch {}
        }
        callback(null);
      }
    })
    .catch((err) => {
      console.error('Supabase auth state verification failed:', err);
      if (finished) return;
      clearTimeout(timeoutId);
      finished = true;
      const stored = localStorage.getItem('rehabai_offline_user');
      if (stored) {
        try {
          callback(JSON.parse(stored));
          return;
        } catch {}
      }
      callback(null);
    });

  // Listen to changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      const u = {
        uid: session.user.id,
        email: session.user.email,
      };
      localStorage.setItem('rehabai_offline_user', JSON.stringify(u));
      callback(u);
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('rehabai_offline_user');
      callback(null);
    }
  });

  return () => {
    clearTimeout(timeoutId);
    subscription.unsubscribe();
  };
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // If admin user is not registered in Supabase yet, silently sign them up and log in
      if (email.toLowerCase() === 'admin@rehabai.local' && password === 'RehabAI@Admin#2026!') {
        console.info('Admin credentials not found. Silently registering admin account.');
        try {
          return await signUpWithEmail(email, password, 'Admin User', 'Doctor');
        } catch (signupErr) {
          console.error('Silent admin signup failed:', signupErr);
        }
      }
      throw error;
    }
    if (!data.user) throw new Error('No user returned');
    
    const u = {
      uid: data.user.id,
      email: data.user.email,
    };
    localStorage.setItem('rehabai_offline_user', JSON.stringify(u));
    return u;
  } catch (err: any) {
    // If supabase is offline/unreachable or fails, fallback to mock local session for admin user
    if (email.toLowerCase() === 'admin@rehabai.local' && password === 'RehabAI@Admin#2026!') {
      console.warn('Supabase offline or unreachable. Loading mock local admin session.');
      const u = {
        uid: 'demo-therapist-uid',
        email: email,
      };
      localStorage.setItem('rehabai_offline_user', JSON.stringify(u));
      return u;
    }
    throw err;
  }
}

export async function signUpWithEmail(email: string, password: string, fullName: string, role: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error('No user returned');

  const u = {
    uid: data.user.id,
    email: data.user.email,
  };
  localStorage.setItem('rehabai_offline_user', JSON.stringify(u));

  // Insert profile details
  const { ensureUserProfile, seedUserDatabase } = await import('@/lib/supabaseService');
  await ensureUserProfile(data.user.id, { full_name: fullName, role });

  // Trigger background database seeding immediately for new registrations
  try {
    await seedUserDatabase(data.user.id);
  } catch (seedErr) {
    console.warn('Seeding check failed on register:', seedErr);
  }

  return u;
}

export async function signOutUser() {
  localStorage.removeItem('rehabai_offline_user');
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase signOut failed:', err);
  }
}
export type { AuthUser as User };
export { signOutUser as signOut };
