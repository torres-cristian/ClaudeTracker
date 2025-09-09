import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AddAccount from './pages/AddAccount';
import AccountDetail from './pages/AccountDetail';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-account" element={<AddAccount />} />
            <Route path="/account/:id" element={<AccountDetail />} />
          </Route>
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
