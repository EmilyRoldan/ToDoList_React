import React, { useEffect, useState, createContext } from "react";
import TodoService from "../service/todo_service";

// Crear el contexto
export const TodoContext = createContext({
  todos: [],
  loading: false,
  error: null,
  refreshTodos: () => {},
  createTodo: async () => {},
  updateTodo: async () => {},
  deleteTodo: async () => {}
});

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await TodoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch todos.");
      console.error("Fetch todos failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async (todoData) => {
    setLoading(true);
    try {
      await TodoService.addTodo(todoData);
      await fetchTodos();
    } catch (err) {
      setError("Failed to create todo.");
      console.error("Create todo failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (todo) => {
    setLoading(true);
    try {
      await TodoService.updateTodo(todo);
      await fetchTodos();
    } catch (err) {
      setError("Failed to update todo.");
      console.error("Update todo failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const success = await TodoService.deleteTodo(id);
      if (success) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Delete todo failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        refreshTodos: fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
