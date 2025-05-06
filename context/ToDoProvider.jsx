import React, { useEffect, useState, createContext } from "react";
import TodoService from "../service/todo_service";

// Crear el contexto con valores por defecto
export const TodoContext = createContext({
  todos: [], // Lista de tareas
  loading: false, // Indicador de carga
  error: null, // Estado de error
  refreshTodos: () => {}, // Función para recargar las tareas
  createTodo: async () => {}, // Función para crear una tarea
  updateTodo: async () => {}, // Función para actualizar una tarea
  deleteTodo: async () => {} // Función para eliminar una tarea
});

// Componente proveedor que envuelve a los hijos con el contexto
export const TodoProvider = ({ children }) => {
  // Estados locales para manejar las tareas, carga y errores
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener las tareas desde el servicio
  const fetchTodos = async () => {
    setLoading(true); // Se inicia la carga
    try {
      const data = await TodoService.getTodos(); // Llamada a la API
      setTodos(data); // Se actualiza el estado con las tareas recibidas
    } catch (err) {
      setError("Failed to fetch todos."); // Se maneja el error
      console.error("Fetch todos failed:", err);
    } finally {
      setLoading(false); // Se finaliza la carga
    }
  };

  // Cargar tareas una vez al montar el componente
  useEffect(() => {
    fetchTodos();
  }, []);

  // Función para crear una nueva tarea
  const createTodo = async (todoData) => {
    setLoading(true);
    try {
      await TodoService.addTodo(todoData); // Se crea la tarea
      await fetchTodos(); // Se recargan las tareas
    } catch (err) {
      setError("Failed to create todo."); // Manejo de error
      console.error("Create todo failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar una tarea existente
  const updateTodo = async (todo) => {
    setLoading(true);
    try {
      await TodoService.updateTodo(todo); // Se actualiza la tarea
      await fetchTodos(); // Se recargan las tareas
    } catch (err) {
      setError("Failed to update todo."); // Manejo de error
      console.error("Update todo failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una tarea por su ID
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const success = await TodoService.deleteTodo(id); // Se elimina la tarea
      if (success) {
        // Se actualiza la lista local eliminando la tarea
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Delete todo failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Se devuelve el proveedor con los valores y funciones compartidas
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
