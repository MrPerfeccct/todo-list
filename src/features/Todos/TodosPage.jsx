import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

export default function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] =
    useState(false);

  const [sortBy, setSortBy] =
    useState('creationDate');

  const [sortDirection, setSortDirection] =
    useState('desc');

  const [filterTerm, setFilterTerm] =
    useState('');

  const debouncedFilterTerm =
    useDebounce(filterTerm, 300);

  const [dataVersion, setDataVersion] =
    useState(0);

  const invalidateCache = useCallback(() => {
    setDataVersion((prev) => prev + 1);
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      setIsTodoListLoading(true);
      setError('');

      const paramsObject = {
        sortBy,
        sortDirection,
      };

      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }

      const params = new URLSearchParams(
        paramsObject
      );

      const response = await fetch(
        `/api/tasks?${params}`,
        {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        }
      );

      if (response.status === 401) {
        throw new Error('unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await response.json();

      setTodoList(data.tasks);
      setFilterError('');
    } catch (error) {
      if (
        debouncedFilterTerm ||
        sortBy !== 'creationDate' ||
        sortDirection !== 'desc'
      ) {
        setFilterError(
          `Error filtering/sorting todos: ${error.message}`
        );
      } else {
        setError(
          `Error fetching todos: ${error.message}`
        );
      }
    } finally {
      setIsTodoListLoading(false);
    }
  }, [
    token,
    sortBy,
    sortDirection,
    debouncedFilterTerm,
  ]);

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token, fetchTodos]);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((previous) => [
      newTodo,
      ...previous,
    ]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: todoTitle,
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const data = await response.json();

      const savedTodo = data.task ?? data;

      setTodoList((previous) =>
        previous.map((todo) => {
          if (todo.id === newTodo.id) {
            return savedTodo;
          }

          return todo;
        })
      );

      invalidateCache();
    } catch (error) {
      setTodoList((previous) =>
        previous.filter(
          (todo) => todo.id !== newTodo.id
        )
      );

      setError(error.message);
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find(
      (todo) => todo.id === id
    );

    setTodoList((previous) =>
      previous.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isCompleted: true,
          };
        }

        return todo;
      })
    );

    try {
      const response = await fetch(
        `/api/tasks/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            isCompleted: true,
            createdAt: originalTodo.createdAt,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to complete todo'
        );
      }

      invalidateCache();
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) => {
          if (todo.id === id) {
            return originalTodo;
          }

          return todo;
        })
      );

      setError(error.message);
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    setTodoList((previous) =>
      previous.map((todo) => {
        if (todo.id === editedTodo.id) {
          return { ...editedTodo };
        }

        return todo;
      })
    );

    try {
      const response = await fetch(
        `/api/tasks/${editedTodo.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: editedTodo.title,
            isCompleted:
              editedTodo.isCompleted,
            createdAt: originalTodo.createdAt,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to update todo'
        );
      }

      invalidateCache();
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) => {
          if (todo.id === editedTodo.id) {
            return originalTodo;
          }

          return todo;
        })
      );

      setError(error.message);
    }
  }

  return (
    <>
      {error && (
        <div>
          <p>{error}</p>

          <button
            onClick={() => setError('')}
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>

          <button
            onClick={() =>
              setFilterError('')
            }
          >
            Clear Filter Error
          </button>

          <button
            onClick={() => {
              setFilterTerm('');
              setSortBy('creationDate');
              setSortDirection('desc');
              setFilterError('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && (
        <p>Loading todos...</p>
      )}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={
          setSortDirection
        }
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={
          handleFilterChange
        }
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </>
  );
}