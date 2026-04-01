import { TodoTask, SendEmailRequest, EmailMessage } from "./types";

const BASE = "/api";

export async function getTasks(): Promise<TodoTask[]> {
  const res = await fetch(`${BASE}/tasks`); // Есть ещё библиотека axios
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function getTask(id: number): Promise<TodoTask> {
  const res = await fetch(`${BASE}/tasks/${id}`);
  if (!res.ok) throw new Error("Failed to fetch task");
  return res.json();
}

export async function createTask(
  task: Pick<TodoTask, "title" | "description">
): Promise<TodoTask> {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(
  id: number,
  task: Pick<TodoTask, "title" | "description" | "isCompleted">
): Promise<void> {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}

export async function sendEmail(
  req: SendEmailRequest
): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/email/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("Failed to send email");
  return res.json();
}

export async function getImapEmails(): Promise<EmailMessage[]> {
  const res = await fetch(`${BASE}/email/imap`);
  if (!res.ok) throw new Error("Failed to fetch IMAP emails");
  return res.json();
}

export async function getPop3Emails(): Promise<EmailMessage[]> {
  const res = await fetch(`${BASE}/email/pop3`);
  if (!res.ok) throw new Error("Failed to fetch POP3 emails");
  return res.json();
}