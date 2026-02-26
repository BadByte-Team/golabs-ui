<template>
  <div class="auth-box">
    <div class="auth-header">
      <h2 class="auth-title">NEW_OPERATIVE</h2>
      <p class="auth-subtitle text-muted">Register for platform access.</p>
    </div>

    <form @submit.prevent="handleRegister" class="auth-form">
      <CyberInput 
        v-model="username" 
        label="ALIAS" 
        placeholder="Choose a handle..." 
        type="text"
        required
      />

      <CyberInput 
        v-model="email" 
        label="TRANSMISSION_ID (EMAIL)" 
        placeholder="target@domain.com" 
        type="email"
        required
      />
      
      <CyberInput 
        v-model="password" 
        label="ACCESS_CODE" 
        placeholder="••••••••" 
        type="password"
        required
      />

      <CyberInput 
        v-model="confirmPassword" 
        label="VERIFY_ACCESS_CODE" 
        placeholder="••••••••" 
        type="password"
        :error="passwordError"
        required
      />

      <CyberButton type="submit" variant="primary" block class="mt-2">
        ENROLL_OPERATIVE
      </CyberButton>

      <div class="auth-footer text-center mt-4">
        <span class="text-muted">Already have a clearance code? </span>
        <RouterLink to="/login" class="text-primary">Authenticate Here</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CyberInput from '../components/ui/CyberInput.vue'
import CyberButton from '../components/ui/CyberButton.vue'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const passwordError = computed(() => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    return 'ACCESS CODES DO NOT MATCH'
  }
  return ''
})

const handleRegister = () => {
  if (!passwordError.value && username.value && password.value) {
    // Simulate successful registration
    setTimeout(() => {
      router.push('/login')
    }, 500)
  }
}
</script>

<style scoped>
.auth-box {
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 8px;
  padding: 3rem 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(102, 252, 241, 0.1);
  backdrop-filter: blur(10px);
}

.auth-header {
  margin-bottom: 2rem;
  text-align: center;
}

.auth-title {
  color: var(--primary);
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.auth-subtitle {
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.mt-2 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.text-center { text-align: center; }
</style>
