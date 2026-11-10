import { deleteShared, importNotes, loadNotes, logIn, openNote, renameNote, saveNote, signUp } from "./app.js";

const $ = (id) => document.getElementById(id);

$("login").onclick = () => logIn($("email").value, $("password").value).then(render);
$("signup").onclick = () => signUp($("email").value, $("password").value);
$("add").onclick = () => saveNote({ title: $("title").value }).then(render);
$("import").onclick = () => importNotes($("data").value).then(render);

async function render() {
  const list = $("notes");
  list.innerHTML = "";
  for (const note of await loadNotes()) {
    const item = document.createElement("li");
    item.textContent = `${note.title} (${note.when})`;
    item.onclick = async () => alert((await openNote(note._id)).body);
    item.ondblclick = () => renameNote(note._id, prompt("New title", note.title)).then(render);
    item.oncontextmenu = (e) => { e.preventDefault(); deleteShared(note._id).then(render); };
    list.append(item);
  }
}
