<template>
  <button 
    class="cyber-button" 
    :class="[variant, size, { block, disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span class="btn-content">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // 'primary', 'secondary', 'danger', 'ghost'
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.cyber-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;
}

.cyber-button.block {
  width: 100%;
  display: flex;
}

/* Base Variants */
.cyber-button.primary {
  color: var(--primary);
  border: 2px solid var(--primary);
}

.cyber-button.primary:hover:not(:disabled) {
  background: var(--primary);
  color: var(--bg-color);
}

.cyber-button.primary:active:not(:disabled) {
  background: var(--primary);
  color: var(--bg-color);
}

.cyber-button.secondary {
  color: var(--text-main);
  border: 2px solid var(--secondary);
}

.cyber-button.secondary:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.cyber-button.danger {
  color: var(--danger);
  border: 2px solid var(--danger);
}

.cyber-button.danger:hover:not(:disabled) {
  background: var(--danger);
  color: var(--bg-color);
}

.cyber-button.ghost {
  color: var(--text-main);
  border: 2px solid transparent;
}

.cyber-button.ghost:hover:not(:disabled) {
  color: var(--primary);
}

/* Sizes */
.cyber-button.sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
}

.cyber-button.md {
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
}

.cyber-button.lg {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Disabled */
.cyber-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(100%);
}

.btn-content {
  position: relative;
  z-index: 2;
}
</style>
