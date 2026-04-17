# TaskFlow

TaskFlow is a modern frontend-only task manager built with React and Vite. It gives you a clean Kanban-style workspace for planning tasks, tracking priorities, and managing deadlines without needing a backend, database, or environment variables.

All user and task data is stored in the browser with `localStorage`, which makes the app simple to run locally and easy to deploy on platforms like Vercel.

## Live Project Goals

- Keep the app lightweight and fast
- Make deployment simple with no backend setup
- Provide a polished UI for portfolio/demo use
- Store all data locally in the browser

## Features

- Drag-and-drop Kanban board
- Create, edit, and delete tasks
- Task status lanes: `Backlog`, `In Progress`, `Completed`
- Priority levels: `Low`, `Medium`, `High`
- Deadline scheduling with date and time preview
- Visual deadline cards with overdue and due-soon states
- Priority filtering
- Workspace overview stats
- Lightweight local profile setup
- GitHub footer credit and repo link
- Responsive layout for desktop and mobile

## Tech Stack

- React
- Vite
- Tailwind CSS
- `@hello-pangea/dnd`
- `date-fns`
- `react-hot-toast`
- `lucide-react`

## Project Structure

```text
task-manager/
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── TaskCard.jsx
│   │   └── TaskModal.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   └── BoardPage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production Build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Deployment

This project is ready to deploy as a static frontend app.

### Deploy on Vercel

1. Import the repository into Vercel
2. Let Vercel detect it as a Vite project
3. Deploy

No environment variables are required.

## Data Persistence

TaskFlow stores data in browser `localStorage` using:

- `taskflow-user`
- `taskflow-tasks`

Important notes:

- Data is stored per browser/device
- Clearing browser storage will reset the app data
- Data is not shared across devices or users

## Current Behavior

- The app starts with a lightweight local profile form
- After entering a name, the task board becomes available
- Tasks are saved automatically after create, edit, delete, and drag actions
- Deadline styling updates automatically based on time

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Create the production build
- `npm run preview` - Preview the production build locally

## Author

Built by Arman Khan

GitHub repository:

[`armancore/task-manager`](https://github.com/armancore/task-manager.git)

