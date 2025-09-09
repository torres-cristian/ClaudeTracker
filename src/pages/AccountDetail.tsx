import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/AppContext';
import { format, parseISO, isBefore } from 'date-fns';

const AccountDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { accounts, loading, handleDeleteSession } = useData();

  if (loading) {
    return <div>Cargando...</div>;
  }

  const account = accounts.find(acc => acc.id === id);

  if (!account) {
    return (
      <div className="container">
        <h2>Cuenta no encontrada</h2>
        <Link to="/">Volver al Dashboard</Link>
      </div>
    );
  }

  const allSessions = account.sessions ? Object.entries(account.sessions).map(([id, s]) => ({ id, ...s })) : [];

  return (
    <div className="container">
      <h2>{account.name}</h2>
      <p><strong>Precio:</strong> ${account.price} USD</p>
      <p><strong>Fecha de inicio de la licencia:</strong> {format(parseISO(account.startDate), 'dd MMM yyyy')}</p>

      <div className="session-list" style={{ marginTop: '2rem' }}>
        <h3>Historial de Sesiones ({allSessions.length})</h3>
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

      <Link to="/">← Volver al Dashboard</Link>
    </div>
  );
};

export default AccountDetail;