const BASE_URL = "https://unidb.openlab.uninorte.edu.co";
const CONTRACT_KEY = "e83b7ac8-bdad-4bb8-a532-6aaa5fddefa4";
const TABLE = "todos";

const TodoService = {
  /**
   * Fetches all todos.
   * @returns {Promise<Array<Object>>}
   */
  async getTodos() {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/all?format=json`;
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.status !== 200) {
        throw new Error(`Error code ${response.status}`);
      }

      const decoded = await response.json();
      const rawData = decoded.data || [];

      const todos = rawData.map(({ entry_id, data }) => ({
        id: entry_id,
        ...data,
      }));

      console.log("TodoService getTodos ok");
      return todos;
    } catch (err) {
      console.error("getTodos error:", err);
      throw err;
    }
  },

  /**
   * Adds a new todo.
   * @param {Object} todo 
   * @returns {Promise<boolean>}
   */
  async addTodo(todo) {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          table_name: TABLE,
          data: todo,
        }),
      });

      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`addTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("addTodo error:", err);
      return false;
    }
  },

  /**
   * Updates a todo by id.
   * @param {Object} todo – must include `id` field
   * @returns {Promise<boolean>}
   */
  async updateTodo(todo) {
    if (!todo.id) throw new Error("todo.id is required");

    const { id, ...fields } = todo;
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/update/${id}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ data: fields }),
      });

      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`updateTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("updateTodo error:", err);
      return false;
    }
  },

  /**
   * Deletes a todo by id.
   * @param {{ id: string } | string} todoOrId
   * @returns {Promise<boolean>}
   */
  async deleteTodo(todoOrId) {
    const id = typeof todoOrId === "string" ? todoOrId : todoOrId.id;
    if (!id) throw new Error("todo.id is required");

    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/delete/${id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      });

      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`deleteTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("deleteTodo error:", err);
      return false;
    }
  },

  /**
   * Deletes all todos.
   * @returns {Promise<boolean>}
   */
  async deleteAllTodos() {
    try {
      const all = await this.getTodos();
      for (const todo of all) {
        await this.deleteTodo(todo.id);
      }
      return true;
    } catch (err) {
      console.error("deleteAllTodos error:", err);
      return false;
    }
  },
};

export default TodoService;
