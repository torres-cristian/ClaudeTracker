import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { ref, push } from 'firebase/database';
import { useAuth } from '../context/AppContext';

const AddAccount = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para agregar una cuenta.');
      return;
    }

    if (!name || !price || !startDate) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const accountData = {
      name,
      price: parseFloat(price),
      startDate,
      sessions: {},
    };

    const accountsRef = ref(db, `users/${user.uid}/accounts`);
    push(accountsRef, accountData)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        alert('Error al agregar la cuenta: ' + error.message);
      });
  };

  return (
    <div className="container">
      <h2>Agregar Nueva Cuenta</h2>
      <form onSubmit={handleAddAccount}>
        <div className="form-group">
          <label>Nombre de la Licencia</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Licencia Personal"
          />
        </div>
        <div className="form-group">
          <label>Precio (USD)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej: 20"
          />
        </div>
        <div className="form-group">
          <label>Fecha de Inicio de Licencia</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <button type="submit">Agregar Cuenta</button>
      </form>
    </div>
  );
};

export default AddAccount;