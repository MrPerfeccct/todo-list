import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

export default function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  dataVersion,
}) {
  const filteredTodoList = useMemo(() => {
    return {
      version: dataVersion,
      todos: todoList.filter((todo) => !todo.isCompleted),
    };
  }, [todoList, dataVersion]);

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