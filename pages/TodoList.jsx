import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Appbar,
  ActivityIndicator
} from "react-native-paper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { TodoContext } from "../context/TodoContext";

export default function TodoList() {
  const {
    todos,
    loading,
    createTodo,
    updateTodo,
    deleteTodo
  } = useContext(TodoContext);

  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const openAddModal = () => {
    setCurrentItem(null);
    setInputValue("");
    setVisible(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setInputValue(item.name);
    setVisible(true);
  };

  const handleSave = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (currentItem) {
      await updateTodo({ ...currentItem, name: trimmed });
    } else {
      await createTodo({ name: trimmed });
    }

    setVisible(false);
    setCurrentItem(null);
    setInputValue("");
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
  };

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <View style={styles.rightAction}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </View>
    );

    return (
      <Swipeable
        friction={2}
        overshootRight={false}
        renderRightActions={renderRightActions}
        rightThreshold={80}
        onSwipeableOpen={() => handleDelete(item.id)}
      >
        <View style={styles.item}>
          <Text>{item.name}</Text>
          <Button
            icon="pencil"
            mode="contained-tonal"
            onPress={() => openEditModal(item)}
            style={styles.optionButton}
          >
            Editar
          </Button>
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="📋 Lista de Tareas" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator animating size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 8 }}
        />
      )}

      <FAB style={styles.fab} icon="plus" color="white" onPress={openAddModal} />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          animationType="slide"
          contentContainerStyle={styles.bottomSheetStyle}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <TextInput
                label="Nombre de la tarea"
                mode="outlined"
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleSave}
                style={styles.input}
              />
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <Button
                  icon="content-save"
                  mode="contained"
                  onPress={handleSave}
                  style={styles.optionButton}
                >
                  Guardar
                </Button>

                <Button
                  icon="cancel"
                  mode="outlined"
                  onPress={() => setVisible(false)}
                  style={styles.optionButton}
                >
                  Cancelar
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee"
  },
  optionButton: {
    marginTop: 10,
    width: "45%"
  },
  bottomSheetStyle: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  input: {
    marginBottom: 10
  },
  rightAction: {
    width: 80,
    backgroundColor: "#b00020",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 16
  },
  deleteText: {
    color: "white",
    fontWeight: "bold"
  }
});
