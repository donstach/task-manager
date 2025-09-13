import { useEffect, useState } from "react";
import api from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get("/tasks");
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

  const addTask = (task) => setTasks(prev => [task, ...prev]);
  const updatedTask = (t) => setTasks(prev => prev.map(p => p._id === t._id ? t : p));
  const deletedTask = (id) => setTasks(prev => prev.filter(p => p._id !== id));

  const filtered = tasks.filter(t => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="container">
      <h1 className="title">Task Manager</h1>

      <TaskForm
        onAdded={addTask}
        editingTask={editingTask}
        onUpdated={(t) => { updatedTask(t); setEditingTask(null); }}
        onCancelEdit={() => setEditingTask(null)}
      />

      <div className="filters">
        <button onClick={() => setFilter("all")} className={filter==="all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("completed")} className={filter==="completed" ? "active" : ""}>Completed</button>
        <button onClick={() => setFilter("pending")} className={filter==="pending" ? "active" : ""}>Pending</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <TaskList
          tasks={filtered}
          onUpdated={updatedTask}
          onDeleted={deletedTask}
          onEdit={(task) => setEditingTask(task)}
        />
      )}
    </div>
  );
}
