import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

// Set backend URL: will use local in dev, deployed in prod
const API_URL = import.meta.env.VITE_API_URL || "https://task-manager-backend-9jeu.onrender.com/api";

export default function App() {
  const [tasks, setTasks] = useState([]);           // List of all tasks
  const [editingTask, setEditingTask] = useState(null); // Task currently being edited
  const [filter, setFilter] = useState("all");      // Filter: all/completed/pending
  const [loading, setLoading] = useState(true);     // Loading state for fetch

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/tasks`);
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        alert("Could not fetch tasks (check backend).");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Add, update, delete tasks locally after backend operations
  const addTask = (task) => setTasks((prev) => [task, ...prev]);
  const updateTask = (updated) => setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t._id !== id));

  // Filter tasks based on current filter state
  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="container">
      <h1 className="title">Task Manager</h1>

      <TaskForm
        apiUrl={API_URL}
        onAdded={addTask}
        editingTask={editingTask}
        onUpdated={(t) => { updateTask(t); setEditingTask(null); }}
        onCancelEdit={() => setEditingTask(null)}
      />

      <div className="filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completed</button>
        <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>Pending</button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          apiUrl={API_URL}
          tasks={filteredTasks}
          onUpdated={updateTask}
          onDeleted={deleteTask}
          onEdit={setEditingTask}
        />
      )}
    </div>
  );
}
