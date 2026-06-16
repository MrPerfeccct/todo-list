import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogoff() {
    logout();
    navigate('/login');
  }

  return (
    <button type="button" onClick={handleLogoff}>
      Log Off
    </button>
  );
}