<template>
  <div class="creator-dashboard">
    <div class="view-header">
      <h1 class="view-title text-purple">EVENT_CREATOR_TERMINAL</h1>
      <p class="text-muted">Manage operations and targets.</p>
    </div>

    <!-- Stats -->
    <div class="stats-grid mb-4">
      <CyberCard class="stat-card">
        <h3 class="stat-title text-muted">MY_EVENTS</h3>
        <p class="stat-value text-primary">3</p>
      </CyberCard>
      
      <CyberCard class="stat-card">
        <h3 class="stat-title text-muted">CHALLENGES</h3>
        <p class="stat-value text-success">42</p>
      </CyberCard>
      
      <CyberCard class="stat-card">
        <h3 class="stat-title text-muted">COMPETITORS</h3>
        <p class="stat-value text-warning">1,337</p>
      </CyberCard>
    </div>

    <!-- Management Tables -->
    <div class="management-section">
      <CyberCard class="table-card">
        <template #header>
          <div class="flex-between">
            <h2 class="section-title mb-0">EVENT_MANAGEMENT</h2>
            <CyberButton variant="primary" size="sm">+ NEW_EVENT</CyberButton>
          </div>
        </template>
        
        <div class="table-responsive">
          <table class="cyber-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>STATUS</th>
                <th>CHALLENGES</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#EV-01</td>
                <td>HackThePlanet 2026</td>
                <td><CyberBadge variant="success">Active</CyberBadge></td>
                <td>35</td>
                <td>
                  <CyberButton variant="ghost" size="sm" class="mr-2">EDIT</CyberButton>
                  <CyberButton variant="ghost" size="sm" class="text-danger">RM</CyberButton>
                </td>
              </tr>
              <tr>
                <td>#EV-02</td>
                <td>Winter Bootcamp CTF</td>
                <td><CyberBadge variant="default">Finished</CyberBadge></td>
                <td>15</td>
                <td>
                  <CyberButton variant="ghost" size="sm" class="mr-2">EDIT</CyberButton>
                  <CyberButton variant="ghost" size="sm" class="text-danger">RM</CyberButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CyberCard>

      <CyberCard class="table-card mt-4">
        <template #header>
          <div class="flex-between">
            <h2 class="section-title mb-0">TARGET_REPOSITORY</h2>
            <CyberButton variant="secondary" size="sm">+ NEW_CHALLENGE</CyberButton>
          </div>
        </template>

        <div class="table-responsive">
          <table class="cyber-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>CAT</th>
                <th>DIFF</th>
                <th>PTS</th>
                <th>SOLVES</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="chal in challenges" :key="chal.id">
                <td>{{ chal.name }}</td>
                <td class="text-muted">[{{ chal.category }}]</td>
                <td><CyberBadge :variant="chal.diffVariant">{{ chal.difficulty }}</CyberBadge></td>
                <td class="text-primary">{{ chal.points }}</td>
                <td>{{ chal.solves }}</td>
                <td>
                  <CyberButton variant="ghost" size="sm" class="mr-2">EDIT</CyberButton>
                  <CyberButton variant="ghost" size="sm" class="text-danger">RM</CyberButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CyberCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CyberCard from '../components/ui/CyberCard.vue'
import CyberBadge from '../components/ui/CyberBadge.vue'
import CyberButton from '../components/ui/CyberButton.vue'

const challenges = ref([
  { id: 1, name: 'Blind RCE', category: 'Web', difficulty: 'Insane', points: 500, solves: 12, diffVariant: 'insane' },
  { id: 2, name: 'Heap Feng Shui', category: 'Pwn', difficulty: 'Hard', points: 400, solves: 45, diffVariant: 'hard' },
  { id: 3, name: 'SQLi Basics', category: 'Web', difficulty: 'Easy', points: 50, solves: 4200, diffVariant: 'easy' },
])
</script>

<style scoped>
.creator-dashboard {
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

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  margin: 0;
  color: var(--primary);
}

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

.mb-4 { margin-bottom: 2rem; }
.mb-0 { margin-bottom: 0; }
.mt-4 { margin-top: 2rem; }
.mr-2 { margin-right: 0.5rem; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
