import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-layout">
      <nav className="sidebar">
        <div>
          <h1 className="sidebar-header">Claude Tracker</h1>
          <ul>
            <li>
              <NavLink to="/" end>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/add-account">Añadir Cuenta</NavLink>
            </li>
          </ul>
        </div>
        <div className="user-info">
          {user && <p>{user.email}</p>}
          <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;