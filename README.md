# Simple Dashboard 3D

A React application with two pages — a **Designers** management page and a **3D Editor** page where you can place, move and configure objects on a canvas.

## Tech stack

| Category | Library |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Routing | react-router-dom v7 |
| State management | Zustand v5 |
| 3D rendering | @react-three/fiber + @react-three/drei (Three.js) |
| Testing | Vitest + React Testing Library |

## Getting started

```bash
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |

## How it works

### Designers page
- View the list of currently employed designers
- Add new designers with the **"+ Add New"** button
- Each designer has a full name, working hours (per day), and an attached objects count
- Delete designers via the Delete button

### Editor page
- **Double-click** on the grid to add a new 3D object
- When adding an object, you must select a designer and a color
- **Click** an object to select it — a properties panel appears on the right
- **Drag** objects to move them around the canvas
- Hovered and selected objects change their appearance (emissive glow)
- In the properties panel you can edit: name, designer, size (small / normal / large) and color
- All changes are validated before saving

### Data persistence
The API layer is mocked with in-memory storage + `localStorage`, so data survives page refreshes. The mock is designed to be easily swapped out for a real API — just replace the functions in `src/api/api.ts`.

### Validation
All forms have proper validation:
- **Add Designer**: name >= 2 chars, working hours 1–24
- **Add Object**: name >= 2 chars, designer required
- **Edit Properties**: name >= 2 chars, designer required, color required

### Accessibility
- ARIA roles, labels and live regions on all forms and modals
- Keyboard navigation (Escape to close modals, focus management)
- `focus-visible` outlines on interactive elements
- Semantic HTML (`<nav>`, `<main>`, `<aside>`, `role="dialog">`)

## Project structure

```
src/
├── api/
│   ├── api.ts            # Mock API (localStorage-backed)
│   └── api.test.ts       # API tests
├── components/
│   ├── AddDesignerForm.tsx
│   ├── AddDesignerForm.test.tsx
│   ├── AddObjectModal.tsx
│   ├── Layout.tsx
│   ├── Modal.tsx
│   ├── PropertiesPanel.tsx
│   ├── Scene.tsx
│   └── SceneObject.tsx
├── pages/
│   ├── DesignersPage.tsx
│   └── EditorPage.tsx
├── store/
│   ├── designerStore.ts   # Zustand store for designers
│   └── objectStore.ts     # Zustand store for 3D objects
├── test/
│   └── setup.ts           # Vitest setup
├── types.ts               # Shared TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css
```

## Build & Deploy

```bash
npm run build
```

Output goes to the `dist/` folder. The build uses relative paths (`base: './'`) so it can be deployed to any subdirectory including GitHub Pages.
