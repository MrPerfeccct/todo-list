import { useAuth } from '../contexts/AuthContext.jsx';

export default function Header() {
  const { email, isAuthenticated } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      {isAuthenticated && <p>Logged in as {email}</p>}
    </header>
  );
}