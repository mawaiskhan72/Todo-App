import React, { useState } from "react";

function App() {
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("To Do");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = () => {
    if (taskName.trim() === "") return;

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = { name: taskName, status };
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { name: taskName, status }]);
    }

    setTaskName("");
    setStatus("To Do");
  };

  const handleEdit = (index) => {
    setTaskName(tasks[index].name);
    setStatus(tasks[index].status);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const TaskItem = ({ task }) => (
    <div className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2">
      <span>{task.name}</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(tasks.indexOf(task))}
          className="bg-yellow-400 hover:bg-yell  ow-500 text-white px-2 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(tasks.indexOf(task))}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );

  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Task Board</h1>

      {/* Input Section */}
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
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editIndex !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col} className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-bold mb-3">{col}</h2>
            {getTasksByStatus(col).map((task, index) => (
              <TaskItem key={index} task={task} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
