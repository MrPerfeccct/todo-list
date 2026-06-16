import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

export default function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  dataVersion,
  statusFilter = 'active',
}) {
  const filteredTodoList = useMemo(() => {
    let filteredTodos;

    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter(
          (todo) => todo.isCompleted
        );
        break;

      case 'active':
        filteredTodos = todoList.filter(
          (todo) => !todo.isCompleted
        );
        break;

      case 'all':
      default:
        filteredTodos = todoList;
        break;
    }

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No completed todos yet.';

      case 'active':
        return 'No active todos. Add a todo above to get started.';

      case 'all':
      default:
        return 'Add a todo above to get started.';
    }
  };

  if (filteredTodoList.todos.length === 0) {
    return <p>{getEmptyMessage()}</p>;
  }

  if (filteredTodoList.todos.length === 0) {
    return <p>Add a todo above to get started</p>;
  }

  return (
    <ul>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}