# Simple Dashboard 3D

A React + TypeScript application with a **Designers** management page and a **3D Editor** with interactive object creation, selection, and manipulation.

## Tech Stack

| Category           | Technology                                        |
| ------------------ | ------------------------------------------------- |
| Framework          | React 19 + TypeScript                             |
| Bundler            | Vite 7                                            |
| Routing            | React Router v7                                   |
| State              | Zustand                                           |
| 3D                 | Three.js + @react-three/fiber + @react-three/drei |
| Forms & Validation | React Hook Form + Zod                             |
| API                | Mock API with localStorage persistence            |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

### Designers Page (`/`)

- View all currently employed designers
- Add new designers via form with validation
- Edit and delete existing designers
- Displays working hours and attached objects count

### Editor Page (`/editor`)

- 3D canvas with grid ground and orbit camera controls
- **Double-click** the ground to place a new object (requires designer selection)
- **Hover** objects to see color change
- **Click** objects to select them (color change + wireframe outline)
- **Drag** objects to move them on the XZ plane
- **Properties panel** for editing selected object: name, designer, size, color
- All changes are persisted via the mock API

### Mock API

- Full CRUD for Designers and Objects
- Data persists via `localStorage` across page refreshes
- Abstracted behind a clean API layer — swap one import for a real backend

## Project Structure

```
src/
├── api/             # Mock API + abstraction layer
├── components/      # Reusable UI components
│   ├── Layout.tsx
│   ├── Modal.tsx
│   ├── Canvas3D.tsx
│   ├── SceneObject.tsx
│   ├── PropertiesPanel.tsx
│   ├── DesignerCard.tsx
│   ├── DesignerForm.tsx
│   └── DesignerSelectDialog.tsx
├── pages/           # Route pages
│   ├── DesignersPage.tsx
│   └── EditorPage.tsx
├── stores/          # Zustand stores
├── types.ts         # TypeScript models
├── App.tsx          # Router config
├── main.tsx         # Entry point
└── index.css        # Global styles
```
# PORTBIM-Technical-Task
