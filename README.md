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
├── screenshots/
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

# Modular Component-Based Structure: UI responsibilities are separated into focused components (StatsOverview, TaskFilters, TaskFormModal, and TaskDetailsModal) orchestrated by src/app/page.tsx for readability and reusability.

# Service-Layer Abstraction & Resilient Data Fallback: CRUD operations are encapsulated in src/services/taskService.ts, connecting to JSON Server (db.json) while falling back seamlessly to localStorage so the dashboard remains interactive even if JSON Server is not started separately.

# Strict TypeScript & Client-Side Validation: Strongly typed domain models in src/types/task.ts help catch data mismatches early, paired with form validation, loading/empty/error states, and toast feedback for a smooth UX.

## Screenshots
Dashboard Overview (Page 1)
Task List & Pagination (Page 2)
Create Task Modal
Task Details Modal
Edit Task Modal

## Getting Started
1. **Install dependencies:**
```bash
npm install

2. **Start the development server:**
```bash
npm run dev

Open http://localhost:3000 (or the local URL shown in the terminal, such as http://localhost:3001) in your browser.

3. **Optional — Run JSON Server on port 5000:**
```bash
npx json-server --watch db.json --port 5000

## Author
Janadhi Chamudini (rbjcjayalath) — BSc (Hons) in Computer Science


