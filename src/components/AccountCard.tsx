import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, addMonths, startOfDay, isAfter, isBefore, parseISO, set } from 'date-fns';
import type { Account } from '../types';

interface AccountCardProps {
  account: Account;
  handleStartSession: (accountId: string) => void;
  handleDeleteSession: (accountId: string, sessionId: string) => void;
}

const AccountCard = ({ account, handleStartSession, handleDeleteSession }: AccountCardProps) => {
  const [sessionsVisible, setSessionsVisible] = useState(false);
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
      <Link to={`/account/${account.id}`} className="card-link">
        <h3>{account.name}</h3>
        <p>Precio: ${account.price} USD | Ciclo: {format(start, 'dd MMM')} - {format(end, 'dd MMM')}</p>

        <div className="session-counter">
          <p>{sessionsUsed} / {SESSIONS_LIMIT} sesiones usadas</p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${usagePercentage}%` }}></div>
          </div>
          <p>{sessionsRemaining} restantes</p>
        </div>
      </Link>
      <div className="card-actions">
        <button onClick={() => handleStartSession(account.id)} disabled={sessionsUsed >= SESSIONS_LIMIT}>
          {sessionsUsed >= SESSIONS_LIMIT ? 'Límite Alcanzado' : 'Iniciar Sesión'}
        </button>
        <button className="toggle-sessions" onClick={() => setSessionsVisible(!sessionsVisible)}>
          {sessionsVisible ? 'Ocultar Sesiones' : `Ver (${allSessions.length}) Sesiones`}
        </button>
      </div>

      {sessionsVisible && (
        <div className="session-list">
          <h4>Todas las Sesiones (más recientes primero):</h4>
          <ul>
            {allSessions.sort((a, b) => isBefore(parseISO(a.startTime), parseISO(b.startTime)) ? 1 : -1).map((session) => (
              <li key={session.id} className='session-item'>
                <div>
                  <strong>Inicio:</strong> {format(parseISO(session.startTime), 'dd MMM yyyy, HH:mm:ss')} <br />
                  <strong>Fin:</strong> {format(parseISO(session.endTime), 'dd MMM yyyy, HH:mm:ss')}
                </div>
                <button className="delete-session-btn" onClick={() => handleDeleteSession(account.id, session.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default AccountCard;