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

export type AppUser = {
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

const STORAGE_KEY = 'department_manager_static_auth';

export const STATIC_LOGIN_EMAIL = 'test@gmail.com';
export const STATIC_LOGIN_PASSWORD = 'test1234';

const STATIC_USER: AppUser = {
  id: 'demo-user-1',
  email: STATIC_LOGIN_EMAIL,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as AppUser;

        if (parsed?.email === STATIC_LOGIN_EMAIL) {
          setUser(STATIC_USER);
          setSession({ user: STATIC_USER });
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load auth from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (
      cleanEmail !== STATIC_LOGIN_EMAIL ||
      cleanPassword !== STATIC_LOGIN_PASSWORD
    ) {
      return {
        error: {
          message: 'Invalid email or password. Use test@gmail.com / test1234',
        },
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATIC_USER));
    setUser(STATIC_USER);
    setSession({ user: STATIC_USER });

    return { error: null };
  };

  const signUp = async (): Promise<AuthResult> => {
    return {
      error: {
        message: 'Signup is disabled. Please login with the static credentials.',
      },
    };
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