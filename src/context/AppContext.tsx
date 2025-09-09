import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { ref, onValue, push, remove } from 'firebase/database';
import { addHours } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { Account, Session } from '../types';

interface AppContextType {
  user: User | null;
  loadingAuth: boolean;
  accounts: Account[];
  loadingData: boolean;
  handleStartSession: (accountId: string) => void;
  handleDeleteSession: (accountId: string, sessionId: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const timeZone = 'America/Mexico_City';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    const accountsRef = ref(db, `users/${user.uid}/accounts`);
    const unsubscribe = onValue(accountsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedAccounts: Account[] = [];
      for (const id in data) {
        loadedAccounts.push({ id, ...data[id] });
      }
      setAccounts(loadedAccounts);
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleStartSession = (accountId: string) => {
    if (!user) return;
    if (!window.confirm('¿Estás seguro de que deseas iniciar una nueva sesión? Esto consumirá un crédito de tu licencia.')) {
      return;
    }
    const sessionRef = ref(db, `users/${user.uid}/accounts/${accountId}/sessions`);
    const now = new Date();
    const zonedStartTime = toZonedTime(now, timeZone);
    const zonedEndTime = addHours(zonedStartTime, 5);
    const newSession: Omit<Session, 'id'> = {
      startTime: zonedStartTime.toISOString(),
      endTime: zonedEndTime.toISOString(),
    };
    push(sessionRef, newSession);
  };

  const handleDeleteSession = (accountId: string, sessionId: string) => {
    if (!user) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer.')) {
      return;
    }
    const sessionRef = ref(db, `users/${user.uid}/accounts/${accountId}/sessions/${sessionId}`);
    remove(sessionRef);
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <AppContext.Provider value={{ user, loadingAuth, accounts, loadingData, handleStartSession, handleDeleteSession, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return { user: context.user, loading: context.loadingAuth, logout: context.logout };
};

export const useData = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useData must be used within an AppProvider');
  }
  return { accounts: context.accounts, loading: context.loadingData, handleStartSession: context.handleStartSession, handleDeleteSession: context.handleDeleteSession };
};
