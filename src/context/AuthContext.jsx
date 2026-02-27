import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true until session check completes

  // ----------------------------------------------------------
  // On mount: check for an existing session, then fetch patient
  // ----------------------------------------------------------
  useEffect(() => {
    // Get current session (handles page refresh / returning users)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchPatientAndSetUser(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for login / logout / token refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchPatientAndSetUser(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ----------------------------------------------------------
  // Fetch the patient record for the logged-in user
  // ----------------------------------------------------------
  const fetchPatientAndSetUser = async (authUser) => {
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', authUser.id)
      .single();

    if (error) {
      console.error('Could not load patient record:', error.message);
      // Auth succeeded but no patient row found — still set basic user
      setUser({ id: authUser.id, email: authUser.email, role: 'patient', patient: null });
    } else {
      setUser({ id: authUser.id, email: authUser.email, role: 'patient', patient });
    }

    setLoading(false);
  };

  // ----------------------------------------------------------
  // Login — real Supabase auth
  // ----------------------------------------------------------
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      // Map Supabase error messages to plain language
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('That email or password doesn\'t match our records. Please try again.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link before signing in.');
      }
      if (error.message.includes('Too many requests')) {
        throw new Error('Too many sign-in attempts. Please wait a few minutes and try again.');
      }
      throw new Error(error.message);
    }

    return { success: true, user: data.user };
  };

  // ----------------------------------------------------------
  // Logout
  // ----------------------------------------------------------
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
