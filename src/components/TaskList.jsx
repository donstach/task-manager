import api from "../api";

export default function TaskList({ tasks, onUpdated, onDeleted, onEdit }) {
  const toggleComplete = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { ...task, completed: !task.completed });
      onUpdated(res.data);
    } catch (err) {
      console.error(err);
      alert("Could not update task");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      onDeleted(id);
    } catch (err) {
      console.error(err);
      alert("Could not delete task");
    }
  };

  if (!tasks.length) return <p>No tasks yet — add one!</p>;

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="task-item">
          <div className="left">
            <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task)} />
            <span className={task.completed ? "done" : ""}>{task.title}</span>
          </div>
          <div className="right">
            <button onClick={() => onEdit(task)} className="link">Edit</button>
            <button onClick={() => deleteTask(task._id)} className="link danger">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
