import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProfilePage() {
  const { email, token } = useAuth();

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();

        const todos = data.tasks ?? data;

        const total = todos.length;
        const completed = todos.filter(
          (todo) => todo.isCompleted
        ).length;
        const active = total - completed;

        setTodoStats({
          total,
          completed,
          active,
        });
      } catch (err) {
        setError(
          `Error loading statistics: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionRate =
    todoStats.total > 0
      ? Math.round(
          (todoStats.completed / todoStats.total) * 100
        )
      : 0;

  return (
    <div>
      <h2>Profile</h2>

      <p>Email: {email}</p>
      <p>Status: Authenticated</p>

      {loading && <p>Loading statistics...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <h3>Todo Statistics</h3>

          <p>Total: {todoStats.total}</p>
          <p>Completed: {todoStats.completed}</p>
          <p>Active: {todoStats.active}</p>

          <p>Completion Rate: {completionRate}%</p>
        </>
      )}
    </div>
  );
}

export default ProfilePage;