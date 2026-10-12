import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { signOutUser, subscribeToAuthState, signInWithEmail, signUpWithEmail, type AuthUser } from '@/lib/supabaseAuth';

interface AuthContext {
  user: AuthUser | null;
  session: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((nextUser) => {
      setSession(nextUser);
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const u = await signInWithEmail(email, password);
    setUser(u);
    setSession(u);
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    const u = await signUpWithEmail(email, password, fullName, role);
    setUser(u);
    setSession(u);
  };

  const signOut = async () => {
    await signOutUser();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthCtx.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
