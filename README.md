# Attentry demo: a notes app with planted problems

A small Express + MongoDB notes app with mistakes left in on purpose, the kind AI agents often
write. Use it to see what [Attentry](https://attentry.js.org) catches and what it stays quiet about.

You don't need to run the app. Attentry only reads the code.

## Try it

1. Install Attentry for VS Code (or Cursor and Windsurf, from Open VSX).
2. Open this folder. The Attentry panel lists what it found. Switch to **Whole repo**, since
   nothing has changed yet.

## What's planted, and where

| Problem | Where | What Attentry says |
|---|---|---|
| A route anyone can call | `server/index.js`, `DELETE /api/shared/:id` | Changes data, and nothing checks who's calling |
| Another one | `server/index.js`, `POST /api/import` | Same |
| Any logged-in user can read anyone's note | `server/notes.js`, `GET /api/notes/:id` | Loads a record by id without checking it belongs to the caller |
| Secret with a fallback in the code | `server/auth.js`, `JWT_SECRET \|\| "superSecret"` | Falls back to a value written in the code |
| User can set any field | `server/notes.js`, `Object.assign(note, req.body)` | Request body saved as-is |
| Login and sign-up can be brute-forced | `server/index.js`, `/api/login`, `/api/register` | No rate limit |
| Bad input crashes the request | `server/index.js`, `JSON.parse(req.body.data)` | No try/catch |
| Async handlers with no error handling (Express 4) | `server/index.js`, `server/notes.js` | One failed await can crash the server |
| A typo in a URL | `public/app.js`, `/api/note/${id}` | No such route; did you mean `GET /api/notes/:id` |
| The wrong method | `public/app.js`, `PATCH /api/notes/${id}` | The route takes GET and PUT |
| A route nothing calls (because of that) | `server/notes.js`, `PUT /api/notes/:id` | Nothing calls it |
| The same function written twice | `public/app.js` `prettyDate`, `public/dates.js` `formatDate` | Identical apart from names |
| Code nothing uses | `public/dates.js` `daysAgo`, `public/app.js` `prettyDate` | Exported, but nothing uses it |
| Money as a float | `server/models.js`, `price: Number` | Shown as a hint |

## What it stays quiet about

The routes in `server/notes.js` have no login check of their own, but they're mounted behind
`requireAuth` in `server/index.js`:

```js
app.use("/api/notes", requireAuth, notes);
```

Attentry follows that, so it doesn't flag them as unprotected. Compare `DELETE /api/shared/:id`,
which is added straight on the app with nothing in front of it. Both look almost the same in their
own file. Only one is a problem.

Passwords are hashed with bcrypt, and `PUT /api/notes/:id` checks the owner, so neither is
flagged.

## Watch it work with Claude Code

Connect Claude Code from the Attentry panel, start a session in this folder, and ask for something.
For example:

- "add a route to delete a note"
- "add an admin page that lists all users"
- "write a helper that formats dates for the notes list"

After each edit, Claude hears only the problems that edit added, and fixes them. A clean edit gets
no message. The third prompt should get "the repo already has `formatDate`" before Claude writes a
new one.

Found something Attentry got wrong here, or missed? Open an issue at
https://github.com/Aarv-1o/Attentry/issues.
