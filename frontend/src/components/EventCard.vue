<template>
  <CyberCard :variant="event.status === 'Active' ? 'primary' : 'default'" hoverable class="event-card">
    <template #header>
      <div class="event-header">
        <h3 class="event-title">{{ event.name }}</h3>
        <CyberBadge :variant="statusVariant">{{ event.status }}</CyberBadge>
      </div>
    </template>
    
    <div class="event-details">
      <p class="event-desc text-muted">{{ event.description }}</p>
      
      <div class="event-meta">
        <div class="meta-item">
          <span class="meta-label">START</span>
          <span class="meta-val">{{ event.startDate }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">END</span>
          <span class="meta-val">{{ event.endDate }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">TEAMS</span>
          <span class="meta-val text-primary">{{ event.teamsCount }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">CHALLENGES</span>
          <span class="meta-val text-secondary">{{ event.challengesCount }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="event-actions">
        <CyberButton v-if="event.status === 'Active'" variant="primary" block>
          ENTER_COMPETITION
        </CyberButton>
        <CyberButton v-else-if="event.status === 'Upcoming'" variant="secondary" block>
          REGISTER_TEAM
        </CyberButton>
        <CyberButton v-else variant="ghost" block>
          VIEW_RESULTS
        </CyberButton>
      </div>
    </template>
  </CyberCard>
</template>

<script setup>
import { computed } from 'vue'
import CyberCard from './ui/CyberCard.vue'
import CyberBadge from './ui/CyberBadge.vue'
import CyberButton from './ui/CyberButton.vue'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const statusVariant = computed(() => {
  switch (props.event.status) {
    case 'Active': return 'success'
    case 'Upcoming': return 'primary'
    case 'Finished': return 'default'
    default: return 'default'
  }
})
</script>

<style scoped>
.event-card {
  height: 100%;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-title {
  margin: 0;
  color: var(--primary);
  font-family: var(--font-mono);
  font-size: 1.25rem;
  letter-spacing: 1px;
}

.event-desc {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.75rem;
  color: var(--secondary);
  font-family: var(--font-mono);
  margin-bottom: 0.25rem;
}

.meta-val {
  font-weight: 500;
  font-family: var(--font-mono);
  font-size: 0.9rem;
}
</style>
