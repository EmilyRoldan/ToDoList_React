// LocalPreferences.js
import AsyncStorage from "@react-native-async-storage/async-storage";

class LocalPreferences {
  /**
   * Retrieves data from AsyncStorage.
   * @param {string} key - The key for the stored data.
   * @param {'bool' | 'int' | 'double' | 'number' | 'string' | 'stringArray'} type - The expected type.
   * @returns {Promise<any>} The retrieved value, or null if not found.
   */
  async retrieveData(key, type) {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      if (storedValue === null) {
        // No value found for the key.
        return null;
      }

      // Parse the value based on the expected type.
      if (type === "bool") {
        return JSON.parse(storedValue);
      } else if (type === "int" || type === "double" || type === "number") {
        return JSON.parse(storedValue);
      } else if (type === "string") {
        return storedValue;
      } else if (type === "stringArray") {
        return JSON.parse(storedValue);
      } else {
        throw new Error("Unsupported type");
      }
    } catch (error) {
      console.error(`Error retrieving data for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Stores data in AsyncStorage.
   * @param {string} key - The key under which to store the data.
   * @param {any} value - The value to store. Supported types are boolean, number, string, and array of strings.
   * @returns {Promise<void>}
   */
  async storeData(key, value) {
    try {
      let valueToStore;

      // Determine how to store based on the value's type.
      if (
        typeof value === "boolean" ||
        typeof value === "number" ||
        Array.isArray(value)
      ) {
        // For booleans, numbers, and arrays, store as JSON.
        //console.log("Value to store:", value, "Type:", typeof value);
        valueToStore = JSON.stringify(value);
      } else if (typeof value === "string") {
        // Strings can be stored directly.
        //console.log("String value to store:", value);
        valueToStore = value;
      } else {
        throw new Error("Unsupported type");
      }

      await AsyncStorage.setItem(key, valueToStore);
      console.info(`LocalPreferences: Stored key "${key}" with value:`, value);
    } catch (error) {
      console.error(
        `Failed to store key "${key}" with value "${value}":`,
        error
      );
    }
  }
}

// Export as a singleton instance to match the Dart pattern.
export default new LocalPreferences();
