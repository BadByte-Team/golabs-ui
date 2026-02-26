# GoLabs UI - Capture The Flag (CTF) Platform

GoLabs UI is the official frontend web application for the GoLabs Capture The Flag (CTF) cybersecurity competition platform. It delivers a modern, serious, and highly responsive dark-themed interface crafted specifically for cybersecurity professionals, students, and event organizers.

The platform facilitates real-time CTF competitions, ongoing target practice (training), and robust administration for content creators and global moderators.

---

## 🏗 Architecture & Tech Stack

The application employs a decoupled architecture designed for high performance and clean separation of concerns:

- **Frontend Framework:** [Vue 3](https://vuejs.org/) utilizing the Composition API for highly reactive, scalable component logic.
- **Routing:** [Vue Router](https://router.vuejs.org/) for seamless Single Page Application (SPA) navigation.
- **State Management:** Ready for [Pinia](https://pinia.vuejs.org/) (or similar) integration.
- **Build Tooling:** Powered by [Vite](https://vitejs.dev/) for lightning-fast Hot Module Replacement (HMR) and optimized production bundles.
- **Styling:** Custom Vanilla CSS Design System built heavily around CSS Variables (`src/style.css`). This maintains a zero-dependency approach to styling while guaranteeing a custom, cohesive look.
- **Static Asset Delivery:** A lightweight **Golang Server** (`main.go`) lives at the project root. Its sole responsibility is to serve the optimized Vite build (`frontend/dist`) on **port 80** in production environments.
- **Backend API Integration:** The frontend is configured to seamlessly interface with an external core game engine/API running on **port 8080**.

---

## 🌟 Core Features

### 1. Unified Authentication

- **Split-Screen Layouts:** A custom `AuthLayout.vue` provides an immersive experience.
- **Secure Workflows:** Login (`LoginView.vue`) and Registration (`RegisterView.vue`) forms feature custom inputs, terminal-style blinking cursors, and local simulated validation mechanisms.

### 2. Command Center (Home Dashboard)

- A global `HomeView.vue` acts as the primary hub for logged-in operatives.
- Features include real-time platform statistics (Active Teams, Systems Pawned), active operations, and a dynamic "Global Feed" simulating live action from other platform users (e.g. First Bloods, Flag captures).

### 3. Competitions & Training

- **Events View:** An interface (`EventsView.vue`) for discovering CTF competitions. Operatives can filter by active, upcoming, or finished states and search through available events.
- **Training Grounds:** An isolated target environment (`TrainingView.vue`) where users can practice specific disciplines (Crypto, Rev, Pwn, Web, Forensics). Challenges display their difficulty, solve rates, and user completion status dynamically.

### 4. Operative Profiles

- The `ProfileView.vue` provides a deep dive into an individual user's performance.
- Contains global rank, total scores, a heavily stylized visual activity timeline (Combat Log), and integrated forms for updating user aliases and access codes.

### 5. Role-Based Administration

To support the dynamic needs of a CTF platform, specific views are locked behind role-based assumptions:

- **Event Creator Terminal (`CreatorDashboardView.vue`):** An interface for challenge architects to monitor their hosted events and manage their target repository.
- **Root Administration (`AdminDashboardView.vue`):** The master operative registry. Global admins can search users, observe score metrics, update access roles, and ban/unban rogue accounts via stylized tables.

---

## 🎨 Design System & Aesthetics

GoLabs UI completely avoids generic frontend frameworks (like Bootstrap or Tailwind) to offer a 100% custom visual identity.

- **The Aesthetic:** The UI adheres strictly to a flat, dark-mode terminal layout. It leverages a deep navy/black base (`#050510`) with sharp, high-contrast primary accents (`#66fcf1`).
- **Typography:** Makes heavy use of monospaced typography (Fira Code) combined with clean sans-serif (Inter) to mimic a professional command-line interface.
- **Refinement:** The project underwent a significant aesthetic refinement to strip out overly aggressive "cyberpunk" elements (like randomized glow effects and glitch animations). The result is a highly readable, serious tool designed for sustained analytical usage over long, multi-day CTF events.

### Reusable Component Library

The core UI is built via a proprietary, reusable component library located in `src/components/ui/`:

- `CyberCard.vue`: Scalable glass-panel cards with structured slots for headers, bodies, and footers.
- `CyberButton.vue`: Highly stylized interactive buttons with structured variants (Primary, Secondary, Danger, Ghost).
- `CyberBadge.vue`: Visual tags indicating difficulty (Easy, Medium, Hard, Insane) and statuses.
- `CyberInput.vue`: Specialized form inputs complete with terminal labels and custom typing cursors.

---

## 🚀 Getting Started

To get the application running locally for development or production deployment, carefully follow these steps:

### Prerequisites

- Node.js (v16.0 or higher recommended)
- Go (v1.20 or higher)

### Local Frontend Development

Working on the Vue components utilizes Vite's blistering fast dev server.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the development server (Defaults to `localhost:5173`):
   ```bash
   npm run dev
   ```

### Production Build & Deployment

For a production run, you compile the Vue application into static files and then use the Go server to serve them on port 80.

1. Build the frontend for production:

   ```bash
   cd frontend
   npm run build
   ```

   _(This outputs the compiled assets into `frontend/dist`)_

2. Move back to the root directory where the Go server lives:

   ```bash
   cd ..
   ```

3. Run the Golang server. Because it targets port 80 (a privileged port), execution generally requires root access:

   ```bash
   sudo go run main.go
   ```

4. The GoLabs UI will now be globally accessible via `http://localhost/`. Ensure your backend API is concurrently running on `localhost:8080`.
