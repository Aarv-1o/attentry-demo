import { formatDate } from "./dates.js";

const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

export async function loadNotes() {
  const res = await fetch("/api/notes", { headers: headers() });
  return (await res.json()).map((n) => ({ ...n, when: formatDate(n.createdAt) }));
}

export async function saveNote(note) {
  await fetch("/api/notes", { method: "POST", headers: headers(), body: JSON.stringify(note) });
}

// A typo: the server has /api/notes/:id, not /api/note/:id.
export async function openNote(id) {
  const res = await fetch(`/api/note/${id}`, { headers: headers() });
  return res.json();
}

// The server updates notes with PUT, not PATCH.
export async function renameNote(id, title) {
  await fetch(`/api/notes/${id}`, { method: "PATCH", headers: headers(), body: JSON.stringify({ title }) });
}

export async function deleteShared(id) {
  await fetch(`/api/shared/${id}`, { method: "DELETE", headers: headers() });
}

export async function importNotes(data) {
  await fetch("/api/import", { method: "POST", headers: headers(), body: JSON.stringify({ data }) });
}

export async function logIn(email, password) {
  const res = await fetch("/api/login", { method: "POST", headers: headers(), body: JSON.stringify({ email, password }) });
  localStorage.setItem("token", (await res.json()).token);
}

export async function signUp(email, password) {
  await fetch("/api/register", { method: "POST", headers: headers(), body: JSON.stringify({ email, password }) });
}

// The same date formatting as dates.js, written again.
export function prettyDate(value) {
  const d = new Date(value);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
