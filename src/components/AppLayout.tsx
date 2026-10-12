import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getUserProfile, type SupabaseProfile } from '@/lib/supabaseService';
import { AppNavbar } from '@/components/AppNavbar';

const AppLayout = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((data) => setProfile(data as SupabaseProfile | null));
  }, [user]);

  const initials = (profile?.full_name || user?.email || '??').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const displayName = profile?.full_name || user?.email || '';

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-50/50">
      <AppNavbar initials={initials} displayName={displayName} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
