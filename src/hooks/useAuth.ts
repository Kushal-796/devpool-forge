import { useEffect, useState, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '@/types';

/**
 * Hook for managing authentication state
 */
export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('useAuth error:', error);
      setError('Authentication service unavailable');
      setLoading(false);
      return () => {};
    }
  }, []);

  return { user, loading, error, setError };
}

/**
 * Hook for user signup
 */
export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      role: 'developer' | 'learner' | 'owner' = 'developer'
    ) => {
      try {
        setLoading(true);
        setError(null);

        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Update display name
        await updateProfile(firebaseUser, {
          displayName: displayName,
        });

        // Create user document in Firestore
        // build user data; don't include undefined fields since Firestore
        // rejects them.
        const userData: User = {
          id: firebaseUser.uid,
          name: displayName,
          email: firebaseUser.email!,
          bio: '',
          role,
          reputationScore: 0,
          createdAt: new Date(),
        } as User;
        if (firebaseUser.photoURL) {
          (userData as any).avatarUrl = firebaseUser.photoURL;
        }

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);

        return firebaseUser;
      } catch (err: any) {
        // handle some common codes manually
        let message = err.message || 'Error signing up';
        if (err.code === 'auth/network-request-failed') {
          message = 'Network error. Please check your connection.';
        } else if (err.code === 'auth/email-already-in-use') {
          message = 'That email address is already registered.';
        }
        setError(message);
        console.error('Sign up error:', err);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { signUp, loading, error };
}

/**
 * Hook for user login
 */
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err: any) {
      let message = err.message || 'Error logging in';
      if (err.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your connection.';
      }
      setError(message);
      console.error('Login error:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      const message = err.message || 'Error logging out';
      setError(message);
      console.error('Logout error:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { logout, loading, error };
}

/**
 * Hook for fetching user profile from Firestore
 */
export function useUserProfile(userId: string | null) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as User);
        } else {
          setError('User profile not found');
        }
      } catch (err: any) {
        // when network issues or rules deny access we frequently see
        // permission-denied / unavailable errors. Log as warning instead of
        // spamming the console and only set the error state for unexpected
        // conditions.
        if (err.code === 'permission-denied' || err.code === 'unavailable') {
          console.warn('Profile fetch skipped due to', err.code, err.message);
          // don't overwrite existing profile or loading state
        } else {
          setError(err.message || 'Error fetching profile');
          console.error('Error fetching profile:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}
