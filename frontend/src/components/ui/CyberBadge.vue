<template>
  <span class="cyber-badge" :class="variant">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default', // 'easy', 'medium', 'hard', 'insane', 'primary', 'success', 'danger', 'warning'
  }
})
</script>

<style scoped>
.cyber-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: var(--font-mono);
}

/* Difficulties */
.cyber-badge.easy {
  color: var(--success);
  border-color: var(--success);
  background: rgba(46, 204, 113, 0.1);
}

.cyber-badge.medium {
  color: var(--warning);
  border-color: var(--warning);
  background: rgba(243, 156, 18, 0.1);
}

.cyber-badge.hard {
  color: #ff3333;
  border-color: #ff3333;
  background: rgba(255, 51, 51, 0.1);
}

.cyber-badge.insane {
  color: #ff00ff;
  border-color: #ff00ff;
  background: rgba(255, 0, 255, 0.1);
}

/* Statuses */
.cyber-badge.primary {
  color: var(--primary);
  border-color: var(--primary);
  background: rgba(102, 252, 241, 0.1);
}

.cyber-badge.success {
  color: var(--success);
  border-color: var(--success);
  background: rgba(46, 204, 113, 0.1);
}

.cyber-badge.danger {
  color: var(--danger);
  border-color: var(--danger);
  background: rgba(231, 76, 60, 0.1);
}
</style>
