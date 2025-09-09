import { useData } from '../context/AppContext';
import AccountCard from '../components/AccountCard';

const Dashboard = () => {
  const { accounts, loading, handleStartSession, handleDeleteSession } = useData();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {accounts.length === 0 ? (
        <p>No hay cuentas registradas. Agrega una para comenzar.</p>
      ) : (
        <ul className="account-list">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} handleStartSession={handleStartSession} handleDeleteSession={handleDeleteSession} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
