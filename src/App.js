import React, { useState, useEffect } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "./components/api";

// Pagination component (unchanged)
function Pagination({ totalPages, currentPage, onPageChange, isLoading }) {
  if (totalPages === 0) return null;

  const pages = [];

  pages.push(1);

  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 3) {
    startPage = 2;
    endPage = Math.min(4, totalPages - 1);
  }
  if (currentPage >= totalPages - 2) {
    startPage = Math.max(totalPages - 3, 2);
    endPage = totalPages - 1;
  }

  if (startPage > 2) {
    pages.push("left-ellipsis");
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push("right-ellipsis");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <div className="flex justify-center gap-2 mt-6 items-center">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1 || isLoading}
        className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>

      {pages.map((page, idx) => {
        if (page === "left-ellipsis" || page === "right-ellipsis") {
          return (
            <span key={page + idx} className="px-3 py-1 select-none">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages || isLoading}
        className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

function App() {
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("To Do");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // changed default to false

  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const result = await getTodos(page, limit);
        const todos = result.data;
        const total = result.total;

        const formattedTodos = todos.map((todo) => ({
          id: todo.id,
          name: todo.title,
          status: todo.completed ? "Done" : "To Do",
        }));

        setTasks(formattedTodos);
        setTotalTasks(total);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [page, limit]);

  const handleSubmit = async () => {
    if (taskName.trim() === "") return;

    if (editId !== null) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editId ? { ...task, name: taskName, status: status } : task
        )
      );

      try {
        await updateTodo(editId, {
          title: taskName,
          completed: status === "Done",
          userId: 1,
        });
      } catch (error) {
        console.error("Error updating todo:", error);
      }

      setEditId(null);
      setTaskName("");
      setStatus("To Do");
    } else {
      try {
        await addTodo({
          title: taskName,
          completed: status === "Done",
          userId: 1,
        });

        const uniqueId = Date.now();

        setTasks((prev) => [
          { id: uniqueId, name: taskName, status: status },
          ...prev,
        ]);

        setTaskName("");
        setStatus("To Do");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
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
      <span className="text-gray-800">{task.name}</span>
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
  const totalPages = Math.ceil(totalTasks / limit);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Task Board</h1>

      <div className="flex flex-col md:flex-row gap-3 justify-center mb-6">
        <input
          type="text"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-64 text-gray-900"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[200px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 text-gray-700 font-semibold">
            Loading tasks...
          </div>
        )}
        {columns.map((col) => (
          <div key={col} className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-bold mb-3">{col}</h2>
            {getTasksByStatus(col).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
            {!isLoading && getTasksByStatus(col).length === 0 && (
              <p className="text-gray-500">No tasks in this category.</p>
            )}
          </div>
        ))}
      </div>

      <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} isLoading={isLoading} />
    </div>
  );
}

export default App;
