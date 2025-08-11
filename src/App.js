import React, { useState, useEffect } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "./components/api";

function App() {
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("To Do");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getTodos();
        const formattedTodos = todos.map((todo) => ({
          id: todo.id,
          name: todo.title,
          status: todo.completed ? "Done" : "To Do"
        }));

        const toDoInitial = formattedTodos
          .filter((t) => t.status === "To Do")
          .slice(0, 2);
        const doneInitial = formattedTodos
          .filter((t) => t.status === "Done")
          .slice(0, 1);
        setTasks([...toDoInitial, ...doneInitial]);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleSubmit = async () => {
    if (taskName.trim() === "") return;

    try {
      if (editId !== null) {
        const updatedTodo = await updateTodo(editId, {
          name: taskName,
          status
        });
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editId
              ? { ...task, name: updatedTodo.title, status }
              : task
          )
        );
        setEditId(null);
      } else {
        const newTodo = await addTodo({ name: taskName, status });
        setTasks((prev) => [
          ...prev,
          { id: newTodo.id, name: newTodo.title, status }
        ]);
      }
      setTaskName("");
      setStatus("To Do");
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const handleEdit = (task) => {
    setTaskName(task.name);
    setStatus(task.status);
    setEditId(task.id);
  };

  const handleDelete = async (id) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      await deleteTodo(id);
    } catch (error) {
      console.error("Error deleting todo:", error);
      setTasks(previousTasks);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const TaskItem = ({ task }) => (
    <div className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2">
      <span>{task.name}</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(task)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(task.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );

  const columns = ["To Do", "Done"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Task Board</h1>

      <div className="flex flex-col md:flex-row gap-3 justify-center mb-6">
        <input
          type="text"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-64"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option>To Do</option>
          <option>Done</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {columns.map((col) => (
          <div key={col} className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-bold mb-3">{col}</h2>
            {getTasksByStatus(col).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
