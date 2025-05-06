// URL base del backend (servidor Uninorte)
const BASE_URL = "https://unidb.openlab.uninorte.edu.co";

// Clave de contrato para identificar el acceso a la base de datos
const CONTRACT_KEY = "e83b7ac8-bdad-4bb8-a532-6aaa5fddefa4";

// Nombre de la tabla donde se almacenan los todos
const TABLE = "todos";

// Objeto que agrupa todos los métodos relacionados con operaciones CRUD sobre los todos
const TodoService = {
  /**
   * Obtiene todos los todos desde la base de datos remota.
   * @returns {Promise<Array<Object>>}
   */
  async getTodos() {
    // Construcción de la URL con formato JSON
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/all?format=json`;
    try {
      // Llamada GET a la API
      const response = await fetch(url, { method: "GET" });

      // Si el estado de respuesta no es 200, se lanza un error
      if (response.status !== 200) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }

      // Decodifica el JSON recibido
      const decoded = await response.json();
      const rawData = decoded.data || [];

      // Convierte cada entrada a un objeto de todo con su id
      const todos = rawData.map(({ entry_id, data }) => ({
        id: entry_id,
        ...data,
      }));

      // Log para depuración
      console.log("TodoService getTodos ok");
      return todos;
    } catch (err) {
      // Captura y muestra errores
      console.error("getTodos error:", err);
      throw err;
    }
  },

  /**
   * Agrega un nuevo todo a la base de datos.
   * @param {Object} todo - Objeto con los datos del todo
   * @returns {Promise<boolean>}
   */
  async addTodo(todo) {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;

    try {
      // Envío del todo por POST
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          table_name: TABLE,
          data: todo,
        }),
      });

      // Si la respuesta es exitosa, retorna true
      if (res.status === 200) {
        return true;
      } else {
        // Si falla, muestra el texto del error
        const text = await res.text();
        console.error(`addTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      // Captura errores de red u otros
      console.error("addTodo error:", err);
      return false;
    }
  },

  /**
   * Actualiza un todo existente.
   * @param {Object} todo – Debe contener un campo `id`
   * @returns {Promise<boolean>}
   */
  async updateTodo(todo) {
    // Validación: debe tener ID
    if (!todo.id) throw new Error("todo.id is required");

    // Separar ID de los demás campos
    const { id, ...fields } = todo;

    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/update/${id}`;

    try {
      // Envío de los datos actualizados por PUT
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ data: fields }),
      });

      // Verifica si la actualización fue exitosa
      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`updateTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      // Captura errores
      console.error("updateTodo error:", err);
      return false;
    }
  },

  /**
   * Elimina un todo por su id.
   * @param {{ id: string } | string} todoOrId - Puede ser un string o un objeto con id
   * @returns {Promise<boolean>}
   */
  async deleteTodo(todoOrId) {
    // Extraer el ID si se pasa un objeto
    const id = typeof todoOrId === "string" ? todoOrId : todoOrId.id;
    if (!id) throw new Error("todo.id is required");

    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/delete/${id}`;

    try {
      // Petición DELETE
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      });

      // Verifica si fue exitoso
      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`deleteTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      // Captura errores
      console.error("deleteTodo error:", err);
      return false;
    }
  },

  /**
   * Elimina todos los todos de la base de datos.
   * @returns {Promise<boolean>}
   */
  async deleteAllTodos() {
    try {
      // Obtiene todos los todos
      const all = await this.getTodos();

      // Elimina uno por uno
      for (const todo of all) {
        await this.deleteTodo(todo.id);
      }
      return true;
    } catch (err) {
      // Captura errores generales
      console.error("deleteAllTodos error:", err);
      return false;
    }
  },
};

// Exporta el objeto TodoService para que pueda ser usado en otros archivos
export default TodoService;
