# TaskFlow

A frontend-only task manager built with React and Vite. Tasks and the lightweight user profile are stored in `localStorage`, so the app runs without a backend, database, or environment variables.

## Features

- Drag-and-drop Kanban workflow
- Create, edit, delete, and reprioritize tasks
- Deadline indicators for upcoming and overdue work
- Priority filters and summary stats
- Local browser persistence for profile and task data
- Vercel-friendly static deployment

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

## Deploy to Vercel

Deploy the repository as a standard Vite app. No environment variables are needed.

## Data storage

This app stores data only in the browser:

- `taskflow-user`
- `taskflow-tasks`

Clearing browser storage will reset the workspace data.
