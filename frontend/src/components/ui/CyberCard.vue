<template>
  <div class="cyber-card" :class="[variant, { hoverable }]">
    <div v-if="$slots.header || title" class="cyber-card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="cyber-card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="cyber-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'primary', 'danger', 'success'
    validator: (val) => ['default', 'primary', 'danger', 'success'].includes(val)
  },
  hoverable: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.cyber-card {
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;
  display: flex;
  flex-direction: column;
}

.cyber-card.hoverable:hover {
  transform: translateY(-2px);
  border-color: rgba(102, 252, 241, 0.6);
}

.cyber-card.primary { border-color: rgba(102, 252, 241, 0.5); }
.cyber-card.success { border-color: rgba(46, 204, 113, 0.5); }
.cyber-card.danger { border-color: rgba(231, 76, 60, 0.5); }

.cyber-card-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-title {
  margin: 0;
  color: var(--primary);
  font-family: var(--font-mono);
  font-size: 1.25rem;
  letter-spacing: 1px;
}

.cyber-card-body {
  padding: 1.5rem;
  flex: 1;
}

.cyber-card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}
</style>
