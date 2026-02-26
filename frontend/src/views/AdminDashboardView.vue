<template>
  <div class="admin-dashboard">
    <div class="view-header">
      <h1 class="view-title text-danger">ROOT_ADMINISTRATION</h1>
      <p class="text-muted">System-wide operative management & access control.</p>
    </div>

    <!-- Stats -->
    <div class="stats-grid mb-4">
      <CyberCard class="stat-card border-danger">
        <h3 class="stat-title text-muted">TOTAL_OPS</h3>
        <p class="stat-value text-primary">12,492</p>
      </CyberCard>
      
      <CyberCard class="stat-card border-danger">
        <h3 class="stat-title text-muted">ACTIVE_NOW</h3>
        <p class="stat-value text-success">842</p>
      </CyberCard>
      
      <CyberCard class="stat-card border-danger">
        <h3 class="stat-title text-muted">BANNED_OPS</h3>
        <p class="stat-value text-danger">156</p>
      </CyberCard>
    </div>

    <!-- User Management Table -->
    <CyberCard class="table-card">
      <template #header>
        <div class="flex-between">
          <h2 class="section-title mb-0 text-danger">OPERATIVE_REGISTRY</h2>
          <div class="search-box">
            <CyberInput placeholder="Search logs..." />
          </div>
        </div>
      </template>
      
      <div class="table-responsive">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>ALIAS</th>
              <th>VECTOR (EMAIL)</th>
              <th>ROLE</th>
              <th>SCORE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" :class="{ 'banned-row': user.status === 'Banned' }">
              <td class="font-bold">{{ user.username }}</td>
              <td class="text-muted">{{ user.email }}</td>
              <td>
                <span class="role-text" :class="roleColor(user.role)">[{{ user.role }}]</span>
              </td>
              <td class="text-primary">{{ user.score }} pts</td>
              <td>
                <CyberBadge :variant="user.status === 'Active' ? 'success' : 'danger'">
                  {{ user.status }}
                </CyberBadge>
              </td>
              <td>
                <CyberButton variant="ghost" size="sm" class="mr-2">EDIT</CyberButton>
                <CyberButton 
                  v-if="user.status === 'Active'" 
                  variant="ghost" 
                  size="sm" 
                  class="text-danger"
                >
                  BAN
                </CyberButton>
                <CyberButton 
                  v-else 
                  variant="ghost" 
                  size="sm" 
                  class="text-success"
                >
                  UNBAN
                </CyberButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <template #footer>
        <div class="pagination flex-between">
          <span class="text-muted">Showing 1-4 of 12,492 entries</span>
          <div class="page-controls">
            <CyberButton variant="ghost" size="sm" disabled>&lt; PREV</CyberButton>
            <CyberButton variant="ghost" size="sm" class="ml-2">NEXT &gt;</CyberButton>
          </div>
        </div>
      </template>
    </CyberCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CyberCard from '../components/ui/CyberCard.vue'
import CyberBadge from '../components/ui/CyberBadge.vue'
import CyberButton from '../components/ui/CyberButton.vue'
import CyberInput from '../components/ui/CyberInput.vue'

const users = ref([
  { id: 1, username: 'H4x0r', email: 'target@domain.internal', role: 'Event Creator', score: 1337, status: 'Active' },
  { id: 2, username: '0xDeaD', email: 'dead@beef.com', role: 'User', score: 4200, status: 'Active' },
  { id: 3, username: 'Cheater1', email: 'anon@null.net', role: 'User', score: 99999, status: 'Banned' },
  { id: 4, username: 'SysOP', email: 'root@platform.io', role: 'Admin', score: 0, status: 'Active' },
])

const roleColor = (role) => {
  switch(role) {
    case 'Admin': return 'text-danger'
    case 'Event Creator': return 'text-purple'
    default: return 'text-secondary'
  }
}
</script>

<style scoped>
.admin-dashboard {
  animation: fadeIn 0.5s ease;
}

.view-header {
  margin-bottom: 2.5rem;
}

.view-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
}

.stat-title {
  font-size: 0.85rem;
  font-family: var(--font-mono);
  margin: 0 0 0.5rem 0;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  font-family: var(--font-mono);
  margin: 0;
}

.border-danger {
  border-color: rgba(231, 76, 60, 0.3);
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  margin: 0;
}

.search-box {
  width: 250px;
}
.search-box > div { margin-bottom: 0; }

.table-responsive {
  overflow-x: auto;
}

.cyber-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.cyber-table th {
  text-align: left;
  padding: 1rem;
  color: var(--secondary);
  font-family: var(--font-mono);
  border-bottom: 2px solid var(--panel-border);
  text-transform: uppercase;
}

.cyber-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-family: var(--font-mono);
}

.cyber-table tbody tr:hover {
  background: rgba(102, 252, 241, 0.05);
}

.banned-row {
  opacity: 0.6;
  background: rgba(231, 76, 60, 0.05);
}

.font-bold { font-weight: bold; }
.role-text { font-family: var(--font-mono); font-size: 0.85rem; }

.mb-4 { margin-bottom: 2rem; }
.mb-0 { margin-bottom: 0; }
.mr-2 { margin-right: 0.5rem; }
.ml-2 { margin-left: 0.5rem; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
