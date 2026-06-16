import { useAuth } from '../contexts/AuthContext.jsx';
import Logoff from '../features/Logoff.jsx';
import Navigation from './Navigation.jsx';

export default function Header() {
  const { email, isAuthenticated } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      <Navigation />

      {isAuthenticated && (
        <>
          <p>Logged in as {email}</p>
          <Logoff />
        </>
      )}
    </header>
  );
}