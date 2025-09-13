import { useState, useEffect } from "react";
import axios from "axios";

export default function TaskForm({ apiUrl, onAdded, editingTask, onUpdated, onCancelEdit }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
    } else {
      setTitle("");
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");

    try {
      if (editingTask) {
        const res = await axios.put(`${apiUrl}/tasks/${editingTask._id}`, { title });
        onUpdated(res.data);
      } else {
        const res = await axios.post(`${apiUrl}/tasks`, { title });
        onAdded(res.data);
      }
      setTitle("");
    } catch (err) {
      console.error(err);
      alert("Error saving task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Enter task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">{editingTask ? "Update" : "Add"}</button>
      {editingTask && (
        <button type="button" onClick={onCancelEdit} className="cancel-btn">
          Cancel
        </button>
      )}
    </form>
  );
}
