import { useState, useEffect, createContext, useContext } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { isMESEmail } from '@/lib/authUtils';

interface UserData {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'core' | 'volunteer';
  skills: string[];
  profile_photo: string;
  xp: number;
  joined_at: Date;
  event_history: string[];
  total_tasks_completed: number;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signInAsDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);

  // Demo user state
  const demoUser = {
    uid: 'demo-volunteer',
    name: 'Demo Volunteer',
    email: 'demo@demo.com',
    role: 'volunteer',
    skills: ['demo'],
    profile_photo: '',
    xp: 0,
    joined_at: new Date(),
    event_history: [],
    total_tasks_completed: 0
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Get user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        } else {
          // Create new user document
          const newUserData: UserData = {
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            role: 'volunteer',
            skills: [],
            profile_photo: user.photoURL || '',
            xp: 0,
            joined_at: new Date(),
            event_history: [],
            total_tasks_completed: 0
          };
          
          await setDoc(userDocRef, newUserData);
          setUserData(newUserData);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setSignInLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user's email is from the allowed domain
      if (user.email && !isMESEmail(user.email)) {
        // Sign out the user immediately if email domain is not allowed
        await signOut(auth);
        throw new Error('Access denied. Only @student.mes.ac.in and @mes.ac.in email addresses are allowed.');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Re-throw the error so it can be handled by the UI
      throw error;
    } finally {
      setSignInLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signInAsDemoUser = () => {
    // Create a minimal mock User object
    const fakeUser = {
      uid: 'demo-volunteer',
      displayName: 'Demo Volunteer',
      email: 'demo@demo.com',
      photoURL: '',
      emailVerified: true,
      isAnonymous: true,
      providerData: [],
      getIdToken: async () => 'demo-token',
      getIdTokenResult: async () => ({ token: 'demo-token' }),
      reload: async () => {},
      delete: async () => {},
      metadata: {},
      phoneNumber: null,
      providerId: 'demo',
      refreshToken: '',
      tenantId: null,
      toJSON: () => ({}),
      // @ts-ignore
    } as User;
    setUser(fakeUser);
    setUserData(demoUser);
    setLoading(false);
  };

  const value = {
    user,
    userData,
    loading: loading || signInLoading,
    signInWithGoogle,
    logout,
    signInAsDemoUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
