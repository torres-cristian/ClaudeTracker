import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { ref, push, onValue } from 'firebase/database';
import { format, addHours, addMonths, startOfDay, isAfter, isBefore, parseISO, set } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import './App.css';

// --- Interfaces de Datos ---
interface Session {
  id: string;
  startTime: string;
  endTime: string;
}

interface Account {
  id: string;
  name: string;
  price: number;
  startDate: string;
  sessions: Record<string, Omit<Session, 'id'>>;
}

// --- Componente de Cuenta Individual ---
const AccountCard = ({ account }: { account: Account }) => {
  const [sessionsVisible, setSessionsVisible] = useState(false);
  const timeZone = 'America/Mexico_City';
  const SESSIONS_LIMIT = 50;

  const getBillingCycle = (startDate: string) => {
    const today = new Date();
    const start = parseISO(startDate);
    let cycleStart = set(today, { date: start.getDate() });

    if (isBefore(today, cycleStart)) {
        cycleStart = addMonths(cycleStart, -1);
    }
    
    const cycleEnd = addMonths(cycleStart, 1);
    return { start: startOfDay(cycleStart), end: startOfDay(cycleEnd) };
  };

  const handleStartSession = (accountId: string) => {
    const now = new Date();
    const zonedStartTime = toZonedTime(now, timeZone);
    const zonedEndTime = addHours(zonedStartTime, 5);

    const newSession: Omit<Session, 'id'> = {
      startTime: zonedStartTime.toISOString(),
      endTime: zonedEndTime.toISOString(),
    };

    const sessionRef = ref(db, `accounts/${accountId}/sessions`);
    push(sessionRef, newSession);
  };

  const { start, end } = getBillingCycle(account.startDate);
  const allSessions = account.sessions ? Object.entries(account.sessions).map(([id, s]) => ({ id, ...s })) : [];
  
  const sessionsInCycle = allSessions.filter(s => {
      const sessionDate = parseISO(s.startTime);
      return isAfter(sessionDate, start) && isBefore(sessionDate, end);
  });

  const sessionsUsed = sessionsInCycle.length;
  const sessionsRemaining = SESSIONS_LIMIT - sessionsUsed;
  const usagePercentage = (sessionsUsed / SESSIONS_LIMIT) * 100;

  return (
    <li className="account-item">
      <h3>{account.name}</h3>
      <p>Precio: ${account.price} USD | Ciclo de facturación: {format(start, 'dd MMM')} - {format(addMonths(start, 1), 'dd MMM')}</p>
      
      <div className="session-counter">
        <p>{sessionsUsed} / {SESSIONS_LIMIT} sesiones usadas</p>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${usagePercentage}%` }}></div>
        </div>
        <p>{sessionsRemaining} restantes</p>
      </div>

      <button onClick={() => handleStartSession(account.id)} disabled={sessionsUsed >= SESSIONS_LIMIT}>
        {sessionsUsed >= SESSIONS_LIMIT ? 'Límite Alcanzado' : 'Iniciar Sesión'}
      </button>

      <button className="toggle-sessions" onClick={() => setSessionsVisible(!sessionsVisible)}>
        {sessionsVisible ? 'Ocultar Sesiones' : `Ver (${allSessions.length}) Sesiones`}
      </button>

      {sessionsVisible && (
        <div className="session-list">
          <h4>Todas las Sesiones (más recientes primero):</h4>
          <ul>
            {allSessions.sort((a, b) => isBefore(parseISO(a.startTime), parseISO(b.startTime)) ? 1 : -1).map((session) => (
              <li key={session.id} className='session-item'>
                <strong>Inicio:</strong> {format(parseISO(session.startTime), 'dd MMM yyyy, HH:mm:ss')} <br />
                <strong>Fin:</strong> {format(parseISO(session.endTime), 'dd MMM yyyy, HH:mm:ss')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};


// --- Componente Principal ---
function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountPrice, setNewAccountPrice] = useState('');
  const [newAccountStartDate, setNewAccountStartDate] = useState('');

  useEffect(() => {
    const accountsRef = ref(db, 'accounts/');
    onValue(accountsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedAccounts: Account[] = [];
      for (const id in data) {
        loadedAccounts.push({ id, ...data[id] });
      }
      setAccounts(loadedAccounts);
    });
  }, []);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName || !newAccountPrice || !newAccountStartDate) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const accountData = {
      name: newAccountName,
      price: parseFloat(newAccountPrice),
      startDate: newAccountStartDate,
      sessions: {},
    };

    push(ref(db, 'accounts/'), accountData);

    setNewAccountName('');
    setNewAccountPrice('');
    setNewAccountStartDate('');
  };

  return (
    <>
      <header className="app-header">
        <h1>Claude Session Tracker</h1>
      </header>

      <div className="container">
        <h2>Agregar Nueva Cuenta</h2>
        <form onSubmit={handleAddAccount}>
          <div className="form-group">
            <label>Nombre de la Licencia</label>
            <input type="text" value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} placeholder="Ej: Licencia Personal" />
          </div>
          <div className="form-group">
            <label>Precio (USD)</label>
            <input type="number" value={newAccountPrice} onChange={(e) => setNewAccountPrice(e.target.value)} placeholder="Ej: 20" />
          </div>
          <div className="form-group">
            <label>Fecha de Inicio de Licencia</label>
            <input type="date" value={newAccountStartDate} onChange={(e) => setNewAccountStartDate(e.target.value)} />
          </div>
          <button type="submit">Agregar Cuenta</button>
        </form>
      </div>

      <div className="container account-list">
        <h2>Mis Cuentas</h2>
        {accounts.length === 0 ? (
          <p>No hay cuentas registradas. Agrega una para comenzar.</p>
        ) : (
          <ul>
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
