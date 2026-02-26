<template>
  <CyberCard class="challenge-card" :class="{ 'solved': challenge.solved }" hoverable>
    <div class="challenge-content">
      <div class="chal-top">
        <div class="chal-cat text-secondary">
          [{{ challenge.category }}]
        </div>
        <div class="chal-points text-primary">
          {{ challenge.points }} pts
        </div>
      </div>
      
      <h3 class="chal-title" :class="{ 'text-success': challenge.solved }">
        {{ challenge.name }}
      </h3>
      
      <div class="chal-meta mt-2">
        <CyberBadge :variant="difficultyVariant" class="mr-2">
          {{ challenge.difficulty }}
        </CyberBadge>
        <span class="solve-rate text-muted">
          {{ challenge.solves }} Solves
        </span>
      </div>
    </div>
    
    <div class="chal-action mt-3">
      <CyberButton 
        :variant="challenge.solved ? 'ghost' : 'primary'" 
        size="sm" 
        block
        class="action-btn"
      >
        {{ challenge.solved ? 'REVIEW_SOLUTION' : 'INITIATE_ATTACK' }}
      </CyberButton>
    </div>
  </CyberCard>
</template>

<script setup>
import { computed } from 'vue'
import CyberCard from './ui/CyberCard.vue'
import CyberBadge from './ui/CyberBadge.vue'
import CyberButton from './ui/CyberButton.vue'

const props = defineProps({
  challenge: {
    type: Object,
    required: true
  }
})

const difficultyVariant = computed(() => {
  switch (props.challenge.difficulty.toLowerCase()) {
    case 'easy': return 'easy'
    case 'medium': return 'medium'
    case 'hard': return 'hard'
    case 'insane': return 'insane'
    default: return 'default'
  }
})
</script>

<style scoped>
.challenge-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
}

.challenge-card.solved {
  border-color: rgba(46, 204, 113, 0.4);
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.05) 0%, rgba(15, 20, 30, 0.7) 100%);
}

.challenge-content {
  flex: 1;
}

.chal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}


.chal-title {
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: 0.5px;
  color: var(--text-main);
  transition: color 0.3s;
}

.challenge-card:hover .chal-title:not(.text-success) {
  color: var(--primary);
}

.chal-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.solve-rate {
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.action-btn {
  margin-top: auto;
}

.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mr-2 { margin-right: 0.5rem; }
</style>
