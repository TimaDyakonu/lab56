import { useState, useEffect, useCallback } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { TodoTask } from "../types";
import { getTasks, createTask, updateTask, deleteTask } from "../api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function TasksPage() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const data = await getTasks();
      setTasks(data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/taskshub")
        .withAutomaticReconnect()
        .build();

    connection.start().catch(() => setError("SignalR Connection Error"));

    connection.on("TaskChanged", () => {
      load();
    });

    return () => {
      connection.stop();
    };
  }, [load]);

  const handleCreate = async (title: string, description: string) => {
    await createTask({ title, description });
  };

  const handleToggle = async (task: TodoTask) => {
    await updateTask(task.id, {
      title: task.title,
      description: task.description,
      isCompleted: !task.isCompleted,
    });
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
  };

  return (
      <div>
        <h1>Tasks</h1>
        <TaskForm onSubmit={handleCreate} />
        {error && <p className="error">{error}</p>}
        {loading ? (
            <p className="loading">Loading...</p>
        ) : (
            <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </div>
  );
}

export default TasksPage;