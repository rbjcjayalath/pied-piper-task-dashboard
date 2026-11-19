# TaskFlow Dashboard — Pied Piper Innovation

A responsive Task Management Dashboard built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**, supporting task CRUD workflows via a mock JSON Server API (`db.json`) with an automatic `localStorage` fallback.

## Features

- **Dashboard Overview:** Real-time summary cards showing Total, To Do, In Progress, and Completed task counts.
- **Search, Filter & Sort:** Search by task title or description, filter by status or priority, and sort by newest first, due date, priority, or title.
- **Full CRUD & Quick Status Cycle:** Create new tasks, view full task details, edit existing tasks, delete tasks, or cycle task status directly from the list with client-side form validation.
- **Pagination & States:** Paginated task list with loading skeletons, empty state screens, error retry banners, and toast notifications.
- **Responsive Design:** Adapts cleanly across mobile, tablet, and desktop screen sizes.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** `lucide-react`
- **Data Layer:** JSON Server (`db.json`) + `localStorage` fallback

## Project Structure

```text
task-dashboard/
├── db.json
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── StatsOverview.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskFormModal.tsx
│   │   └── TaskDetailsModal.tsx
│   ├── services/
│   │   └── taskService.ts
│   └── types/
│       └── task.ts
├── package.json
└── README.md

## Getting Started
1. **Install dependencies:**
```bash
npm install

2. **Start the development server:**
```bash
npm run dev

Open http://localhost:3000 (or the local URL shown in the terminal, such as http://localhost:3001) in your browser.

3. Optional — Run JSON Server on port 5000:
```bash
npx json-server --watch db.json --port 5000

## Author
Janadhi Chamudini (rbjcjayalath) — BSc (Hons) in Computer Science


