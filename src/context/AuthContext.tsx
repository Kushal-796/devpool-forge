import React, { createContext, useContext, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useAuth, useSignUp, useLogin, useLogout, useUserProfile } from '@/hooks/useAuth';
import { User } from '@/types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string, role?: 'developer' | 'learner' | 'owner') => Promise<FirebaseUser>;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  signUpLoading: boolean;
  loginLoading: boolean;
  logoutLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  try {
    const { user, loading: authLoading, error: authError } = useAuth();
    const { signUp, loading: signUpLoading, error: signUpError } = useSignUp();
    const { login, loading: loginLoading, error: loginError } = useLogin();
    const { logout, loading: logoutLoading, error: logoutError } = useLogout();
    const { profile, loading: profileLoading } = useUserProfile(user?.uid || null);

    const error = authError || signUpError || loginError || logoutError;
    const loading = authLoading || profileLoading;

    const value: AuthContextType = {
      firebaseUser: user,
      userProfile: profile,
      loading,
      error,
      signUp,
      login,
      logout,
      signUpLoading,
      loginLoading,
      logoutLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  } catch (error) {
    console.error('AuthProvider error:', error);
    // Fallback provider with empty values
    const fallbackValue: AuthContextType = {
      firebaseUser: null,
      userProfile: null,
      loading: false,
      error: 'Authentication service unavailable',
      signUp: async () => { throw new Error('Auth unavailable'); },
      login: async () => { throw new Error('Auth unavailable'); },
      logout: async () => {},
      signUpLoading: false,
      loginLoading: false,
      logoutLoading: false,
    };

    return <AuthContext.Provider value={fallbackValue}>{children}</AuthContext.Provider>;
  }
}

/**
 * Hook to use auth context
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // HMR and tests sometimes call this hook outside the provider which
    // would crash the app. Log a warning and return a harmless fallback
    // so the UI can continue rendering without blowing up.
    //
    // Note: this should never happen in production if the provider is
    // correctly placed; the fallback is purely for developer ergonomics.
    console.warn('useAuthContext called without AuthProvider – returning empty default');
    const stub: AuthContextType = {
      firebaseUser: null,
      userProfile: null,
      loading: false,
      error: null,
      signUp: async () => {
        throw new Error('AuthProvider not available');
      },
      login: async () => {
        throw new Error('AuthProvider not available');
      },
      logout: async () => {
        throw new Error('AuthProvider not available');
      },
      signUpLoading: false,
      loginLoading: false,
      logoutLoading: false,
    };
    return stub;
  }
  return context;
}

export default AuthContext;
