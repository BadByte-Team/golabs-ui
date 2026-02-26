<template>
  <div class="cyber-input-group" :class="{ 'has-error': error }">
    <label v-if="label" class="cyber-label">{{ label }}</label>
    <div class="input-wrapper">
      <div v-if="$slots.icon" class="input-icon">
        <slot name="icon"></slot>
      </div>
      <input
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="cyber-input"
        :class="{ 'with-icon': $slots.icon }"
      />
      <!-- Terminal cursor effect -->
      <span class="blinking-cursor"></span>
    </div>
    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.cyber-input-group {
  margin-bottom: 1.25rem;
  position: relative;
}

.cyber-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--secondary);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-mono);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.cyber-input {
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(11, 12, 16, 0.8);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  color: var(--text-main);
  font-family: var(--font-mono);
  font-size: 1rem;
  transition: all 0.3s ease;
  z-index: 2;
}

.cyber-input.with-icon {
  padding-left: 2.5rem;
}

.input-icon {
  position: absolute;
  left: 0.8rem;
  color: var(--text-muted);
  z-index: 3;
  display: flex;
  align-items: center;
}

.cyber-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(15, 20, 30, 0.95);
}

.cyber-input:focus + .blinking-cursor {
  display: block;
}

.blinking-cursor {
  display: none;
  position: absolute;
  bottom: 0.5rem;
  right: 0.8rem;
  width: 8px;
  height: 4px;
  background-color: var(--primary);
  animation: blink 1s step-end infinite;
  z-index: 3;
  pointer-events: none;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Error State */
.has-error .cyber-input {
  border-color: var(--danger);
}


.has-error .cyber-label {
  color: var(--danger);
}

.error-text {
  display: block;
  margin-top: 0.4rem;
  color: var(--danger);
  font-size: 0.8rem;
}
</style>
