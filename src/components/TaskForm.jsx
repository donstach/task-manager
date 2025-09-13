import { useEffect, useState } from "react";
import api from "../api";

export default function TaskForm({ onAdded, editingTask, onUpdated, onCancelEdit }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (editingTask) setTitle(editingTask.title);
    else setTitle("");
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    try {
      if (editingTask) {
        const res = await api.put(`/tasks/${editingTask._id}`, { title: trimmed });
        onUpdated(res.data);
      } else {
        const res = await api.post("/tasks", { title: trimmed });
        onAdded(res.data);
      }
      setTitle("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong (check console).");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
        placeholder="Enter task..."
      />
      <button className="btn">{editingTask ? "Update" : "Add"}</button>
      {editingTask && <button type="button" onClick={onCancelEdit} className="btn btn-alt">Cancel</button>}
    </form>
  );
}
