<template>
  <div class="dashboard-view">
    <div class="view-header">
      <h1 class="view-title text-primary">COMMAND_CENTER</h1>
      <p class="text-muted">Global operations overview.</p>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid mb-4">
      <CyberCard class="stat-card">
        <h3 class="stat-title text-muted">ACTIVE_TEAMS</h3>
        <p class="stat-value text-primary">8,492</p>
      </CyberCard>
      
      <CyberCard class="stat-card">
        <h3 class="stat-title text-muted">SYSTEMS_PAWNED</h3>
        <p class="stat-value text-success">14,233</p>
      </CyberCard>
      
      <CyberCard class="stat-card">
        <h3 class="stat-title text-muted">DEFENSES_ACTIVE</h3>
        <p class="stat-value text-warning">99.8%</p>
      </CyberCard>
    </div>

    <div class="dashboard-content">
      <!-- Active Events -->
      <div class="col-main">
        <h2 class="section-title text-secondary">ACTIVE_OPERATIONS</h2>
        <div class="events-list">
          <CyberCard hoverable class="event-item">
            <template #header>
              <div class="flex-between">
                <h3 class="item-title">HackThePlanet 2026</h3>
                <CyberBadge variant="success">Active</CyberBadge>
              </div>
            </template>
            <p class="text-muted small-text">35 targets remaining. 1,420 combatants engaged.</p>
            <template #footer>
              <CyberButton variant="ghost" size="sm" block>DEPLOY_TO_ZONE</CyberButton>
            </template>
          </CyberCard>
          
          <CyberCard hoverable class="event-item mt-3">
            <template #header>
              <div class="flex-between">
                <h3 class="item-title">NeoTokyo Qualifiers</h3>
                <CyberBadge variant="primary">Upcoming - 48h</CyberBadge>
              </div>
            </template>
            <p class="text-muted small-text">Regional qualifiers. Gear up.</p>
            <template #footer>
              <CyberButton variant="ghost" size="sm" block>VIEW_INTEL</CyberButton>
            </template>
          </CyberCard>
        </div>
      </div>

      <!-- Live Feed -->
      <div class="col-side">
        <h2 class="section-title text-purple">GLOBAL_FEED</h2>
        <CyberCard class="feed-card">
          <ul class="live-feed">
            <li>
              <span class="time text-muted">[10:04]</span> 
              <span class="text-primary">0xDeaD</span> pwnd <span class="text-warning">SQLi Basics</span>
            </li>
            <li>
              <span class="time text-muted">[10:02]</span> 
              <span class="text-primary">GhostInShell</span> pwnd <span class="text-warning">Blind RCE</span>
            </li>
            <li>
              <span class="time text-muted">[09:58]</span> 
              <span class="text-success">[TEAM] RootAccess</span> claimed First Blood on <span class="text-danger">Heap Feng Shui</span>
            </li>
            <li>
              <span class="time text-muted">[09:45]</span> 
              <span class="text-primary">n00b</span> registered.
            </li>
            <li>
              <span class="time text-muted">[09:12]</span> 
              <span class="text-primary">CyberNinja</span> pwnd <span class="text-warning">RSA Baby</span>
            </li>
          </ul>
        </CyberCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import CyberCard from '../components/ui/CyberCard.vue'
import CyberBadge from '../components/ui/CyberBadge.vue'
import CyberButton from '../components/ui/CyberButton.vue'
</script>

<style scoped>
.dashboard-view {
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

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .dashboard-content { grid-template-columns: 1fr; }
}

.section-title {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title {
  margin: 0;
  font-size: 1.1rem;
}

.small-text {
  font-size: 0.85rem;
}

.feed-card {
  height: 100%;
}

.live-feed {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.8;
}

.live-feed li {
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.live-feed li:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.mb-4 { margin-bottom: 2rem; }
.mt-3 { margin-top: 1.5rem; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
