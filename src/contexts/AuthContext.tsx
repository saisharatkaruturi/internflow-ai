import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  university?: string;
  major?: string;
  graduationYear?: string;
  joinedAt: string;
}

interface StoredAccount extends AuthUser {
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signUp: (data: SignUpPayload) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  university?: string;
  major?: string;
  graduationYear?: string;
}

const USERS_KEY = "internguard.users";
const SESSION_KEY = "internguard.session";

const readUsers = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredAccount[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const readSession = (): string | null => {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};

const writeSession = (userId: string | null) => {
  if (userId) {
    localStorage.setItem(SESSION_KEY, userId);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

const sanitize = (account: StoredAccount): AuthUser => {
  // strip password before exposing to the app
  const { password: _password, ...rest } = account;
  return rest;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sessionId = readSession();
    if (sessionId) {
      const users = readUsers();
      const account = users.find((u) => u.id === sessionId);
      if (account) setUser(sanitize(account));
    }
    setIsReady(true);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password) {
      return { ok: false as const, error: "Please enter your email and password." };
    }
    const users = readUsers();
    const account = users.find((u) => u.email.toLowerCase() === normalized);
    if (!account || account.password !== password) {
      return { ok: false as const, error: "Invalid email or password." };
    }
    writeSession(account.id);
    setUser(sanitize(account));
    return { ok: true as const };
  }, []);

  const signUp = useCallback(async (data: SignUpPayload) => {
    const normalized = data.email.trim().toLowerCase();
    if (!data.name.trim()) return { ok: false as const, error: "Please enter your full name." };
    if (!normalized || !data.password) {
      return { ok: false as const, error: "Email and password are required." };
    }
    if (data.password.length < 6) {
      return { ok: false as const, error: "Password must be at least 6 characters." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return { ok: false as const, error: "Please enter a valid email address." };
    }

    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return { ok: false as const, error: "An account with this email already exists." };
    }

    const account: StoredAccount = {
      id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      name: data.name.trim(),
      email: normalized,
      password: data.password,
      university: data.university?.trim() || undefined,
      major: data.major?.trim() || undefined,
      graduationYear: data.graduationYear?.trim() || undefined,
      joinedAt: new Date().toISOString(),
    };

    const next = [...users, account];
    writeUsers(next);
    writeSession(account.id);
    setUser(sanitize(account));
    return { ok: true as const };
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback((patch: Partial<AuthUser>) => {
    setUser((current) => {
      if (!current) return current;
      const users = readUsers();
      const next = users.map((u) =>
        u.id === current.id ? { ...u, ...patch } : u,
      );
      writeUsers(next);
      return { ...current, ...patch };
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isReady,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, isReady, signIn, signUp, signOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
