import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert('Hubo un error al iniciar sesión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Claude Session Tracker</h1>
        <p>Por favor, inicia sesión para continuar</p>
        <button onClick={handleGoogleSignIn} className="google-signin-btn">
          Iniciar Sesión con Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
