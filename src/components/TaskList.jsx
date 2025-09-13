import axios from "axios";

export default function TaskList({ apiUrl, tasks, onUpdated, onDeleted, onEdit }) {
  const toggleComplete = async (task) => {
    try {
      const res = await axios.put(`${apiUrl}/tasks/${task._id}`, {
        ...task,
        completed: !task.completed,
      });
      onUpdated(res.data);
    } catch (err) {
      console.error(err);
      alert("Error updating task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${apiUrl}/tasks/${id}`);
      onDeleted(id);
    } catch (err) {
      console.error(err);
      alert("Error deleting task");
    }
  };

  return (
    <ul className="task-list">
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <li key={task._id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleComplete(task)}>
              {task.title}
            </span>
            <div className="actions">
              <button onClick={() => onEdit(task)}>Edit</button>
              <button onClick={() => deleteTask(task._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}
