import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type AppAuthError = {
  message: string;
};

type AppUser = {
  id: string;
  email: string;
};

type AppSession = {
  user: AppUser;
};

type AuthResult = {
  error: AppAuthError | null;
};

type AuthContextType = {
  user: AppUser | null;
  session: AppSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'department_manager_demo_auth';

function generateUser(email: string): AppUser {
  const cleanEmail = email.trim() || `guest_${Date.now()}@department.local`;

  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),
    email: cleanEmail,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsedUser: AppUser = JSON.parse(saved);
        setUser(parsedUser);
        setSession({ user: parsedUser });
      }
    } catch (error) {
      console.error('Failed to load auth from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, _password: string): Promise<AuthResult> => {
    const demoUser = generateUser(email);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setSession({ user: demoUser });

    return { error: null };
  };

  const signUp = async (email: string, _password: string): Promise<AuthResult> => {
    const demoUser = generateUser(email);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setSession({ user: demoUser });

    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}