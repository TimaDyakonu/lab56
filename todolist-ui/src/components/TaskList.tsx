import { TodoTask } from "../types";

interface Props {
  tasks: TodoTask[];
  onToggle: (task: TodoTask) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet.</p>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="card">
          <div className="task-header">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => onToggle(task)}
            />
            <span className={`task-title ${task.isCompleted ? "done" : ""}`}>
              {task.title}
            </span>
            <button className="danger small" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </div>
          {task.description && <p className="task-desc">{task.description}</p>}
          <p className="task-date">
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TaskList;