<template>
  <div class="profile-view">
    <div class="profile-header mb-4">
      <div class="identifier-block">
        <div class="avatar-box">
          <div class="avatar-placeholder">
            H4
          </div>
        </div>
        <div class="user-meta">
          <h1 class="username">H4x0r</h1>
          <p class="role text-purple">[ EVENT CREATOR ]</p>
          <p class="email text-muted">target@domain.internal</p>
        </div>
      </div>
      
      <div class="stats-overview">
        <div class="stat-box">
          <span class="stat-label">GLOBAL RANK</span>
          <span class="stat-val text-primary">#42</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">TOTAL SCORE</span>
          <span class="stat-val text-success">1337 pts</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">SYSTEMS COMPROMISED</span>
          <span class="stat-val text-warning">84</span>
        </div>
      </div>
    </div>

    <!-- Edit Profile Section -->
    <div class="dashboard-grid">
      <CyberCard title="OPERATIVE_SETTINGS" class="settings-card">
        <form @submit.prevent="saveProfile">
          <CyberInput v-model="form.username" label="ALIAS" />
          <CyberInput v-model="form.email" label="CONTACT_VECTOR" type="email" />
          
          <div class="password-section mt-4 border-top pt-4">
            <h4 class="text-muted font-mono mb-3">MODIFY_CREDENTIALS</h4>
            <CyberInput v-model="form.currentPass" label="CURRENT_KEY" type="password" />
            <CyberInput v-model="form.newPass" label="NEW_KEY" type="password" />
          </div>

          <div class="form-actions mt-4 pt-4 border-top">
            <CyberButton type="submit" variant="primary">
              UPDATE_RECORDS
            </CyberButton>
            <CyberButton type="button" variant="ghost" class="ml-2">
              REVERT
            </CyberButton>
          </div>
        </form>
      </CyberCard>

      <!-- Activity Timeline -->
      <CyberCard title="COMBAT_LOG" class="activity-card">
        <div class="timeline">
          <div class="timeline-item" v-for="log in activityLog" :key="log.id">
            <div class="timeline-dot" :class="'dot-' + log.type"></div>
            <div class="timeline-content">
              <span class="log-time text-muted">{{ log.time }}</span>
              <p class="log-desc">
                <span v-html="log.action"></span>
              </p>
            </div>
          </div>
        </div>
      </CyberCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CyberCard from '../components/ui/CyberCard.vue'
import CyberInput from '../components/ui/CyberInput.vue'
import CyberButton from '../components/ui/CyberButton.vue'

const form = ref({
  username: 'H4x0r',
  email: 'target@domain.internal',
  currentPass: '',
  newPass: ''
})

const activityLog = ref([
  { id: 1, type: 'solve', time: '10 mins ago', action: 'System compromised: <span class="text-success">[Blind RCE]</span> (+500 pts)' },
  { id: 2, type: 'solve', time: '2 hrs ago', action: 'Flag captured: <span class="text-success">[RSA Baby]</span> (+50 pts)' },
  { id: 3, type: 'event', time: '1 day ago', action: 'Registered for <span class="text-primary">[HackThePlanet 2026]</span>' },
  { id: 4, type: 'system', time: '5 days ago', action: 'Promoted to <span class="text-purple">[EVENT CREATOR]</span>' },
  { id: 5, type: 'solve', time: '1 week ago', action: 'First blood on <span class="text-warning">[Obfuscated Mess]</span> (+300 pts)' },
])

const saveProfile = () => {
  console.log('Profile saved', form.value)
  // simulate toast
}
</script>

<style scoped>
.profile-view {
  animation: fadeIn 0.5s ease;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 2rem;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 8px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

@media (max-width: 900px) {
  .profile-header {
    flex-direction: column;
  }
}

.identifier-block {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-box {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 2px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(11, 12, 16, 0.8);
}

.avatar-placeholder {
  font-family: var(--font-mono);
  font-size: 2.5rem;
  font-weight: bold;
}

.user-meta .username {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: var(--text-main);
  text-transform: uppercase;
}

.user-meta .role {
  font-family: var(--font-mono);
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.user-meta .email {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.stats-overview {
  display: flex;
  gap: 2rem;
}

@media (max-width: 600px) {
  .stats-overview { flex-direction: column; gap: 1rem; }
}

.stat-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 1rem;
  border-left: 2px solid rgba(102, 252, 241, 0.2);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  margin-bottom: 0.5rem;
}

.stat-val {
  font-size: 1.8rem;
  font-weight: bold;
  font-family: var(--font-mono);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}

/* Utilities */
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 2rem; }
.mt-4 { margin-top: 1.5rem; }
.pt-4 { padding-top: 1.5rem; }
.ml-2 { margin-left: 1rem; }
.border-top { border-top: 1px solid rgba(255, 255, 255, 0.05); }
.font-mono { font-family: var(--font-mono); }

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  position: relative;
  padding-left: 1.5rem;
  padding-bottom: 1.5rem;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
}

.timeline-item:last-child {
  border-left: 2px solid transparent;
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -7px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text-muted);
}

.dot-solve { background: var(--success); color: var(--success); }
.dot-event { background: var(--primary); color: var(--primary); }
.dot-system { background: var(--accent-purple); color: var(--accent-purple); }

.log-time {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  display: block;
  margin-bottom: 0.25rem;
}

.log-desc {
  margin: 0;
  font-size: 0.95rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
