<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-split-screen">
      <!-- Left side (Visuals) -->
      <div class="auth-visuals">
        <div class="visuals-content">
          <div class="brand">
            <h1>&lt;CTF_PLATFORM /&gt;</h1>
            <p class="catchphrase text-secondary">Hack. Learn. Compete.</p>
          </div>
        </div>
      </div>

      <!-- Right side (Form) -->
      <div class="auth-form-container">
        <div class="auth-form-wrapper">
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  background-color: var(--bg-color);
}

.auth-split-screen {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.auth-visuals {
  flex: 1;
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--panel-border);
}

@media (max-width: 900px) {
  .auth-visuals {
    display: none;
  }
}

.visuals-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.brand h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.catchphrase {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  letter-spacing: 2px;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 450px;
}
</style>
