<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <div class="main-layout">
    <!-- Top Navigation -->
    <header class="top-nav">
      <div class="nav-brand">
        <RouterLink to="/">&lt;CTF_PLATFORM /&gt;</RouterLink>
      </div>

      <div class="nav-center">
        <RouterLink to="/events" class="nav-link">Events</RouterLink>
        <RouterLink to="/training" class="nav-link">Training</RouterLink>
        <RouterLink to="/leaderboard" class="nav-link">Leaderboard</RouterLink>
      </div>

      <div class="nav-right">
        <div class="user-profile">
          <RouterLink to="/profile" class="profile-link">
            <span class="username">H4x0r</span>
            <span class="points text-primary">1337 pts</span>
          </RouterLink>
          <button @click="logout" class="logout-btn">
            [ EXIT ]
          </button>
        </div>
      </div>
    </header>

    <div class="layout-body">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <nav class="side-nav">
          <div class="nav-section">
            <span class="section-title">Menu</span>
            <RouterLink to="/" class="side-link">Dashboard</RouterLink>
            <RouterLink to="/events" class="side-link">Competitions</RouterLink>
            <RouterLink to="/training" class="side-link">Practice Area</RouterLink>
          </div>
          <div class="nav-section">
            <span class="section-title">Personal</span>
            <RouterLink to="/profile" class="side-link">Profile System</RouterLink>
            <RouterLink to="/team" class="side-link">Team Roster</RouterLink>
          </div>
          <div class="nav-section admin-section">
            <span class="section-title text-danger">Root Access</span>
            <RouterLink to="/creator" class="side-link text-purple">Event Creator</RouterLink>
            <RouterLink to="/admin" class="side-link text-danger">User Admin</RouterLink>
          </div>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="content-area">
        <RouterView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Top Navigation */
.top-nav {
  height: 60px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--panel-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-brand a {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary);
}

.nav-center {
  display: flex;
  gap: 2rem;
}
@media (max-width: 900px) {
  .nav-center { display: none; }
}

.nav-link {
  color: var(--text-main);
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  position: relative;
}

.nav-link:hover, .nav-link.router-link-active {
  color: var(--primary);
}
.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -22px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
}

.nav-right {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.username {
  font-weight: 600;
  color: var(--text-main);
}
.points {
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.logout-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  cursor: pointer;
  transition: color 0.3s;
}
.logout-btn:hover {
  color: var(--danger);
}

/* Body (Sidebar + Content) */
.layout-body {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 250px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--panel-border);
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .sidebar { display: none; }
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  padding: 0 1.5rem 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--secondary);
  font-family: var(--font-mono);
}

.side-link {
  padding: 0.8rem 1.5rem;
  color: var(--text-main);
  font-size: 0.95rem;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.side-link:hover, .side-link.router-link-active {
  background: rgba(102, 252, 241, 0.05);
  border-left-color: var(--primary);
  color: var(--primary);
}

.admin-section .side-link.router-link-active.text-purple {
  border-left-color: var(--accent-purple);
  color: var(--accent-purple);
  background: rgba(157, 78, 221, 0.05);
}

.admin-section .side-link.router-link-active.text-danger {
  border-left-color: var(--danger);
  color: var(--danger);
  background: rgba(231, 76, 60, 0.05);
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
