<template>
  <div class="auth-box">
    <div class="auth-header">
      <h2 class="auth-title">SYSTEM_LOGIN</h2>
      <p class="auth-subtitle text-muted">Enter credentials to establish connection.</p>
    </div>

    <form @submit.prevent="handleLogin" class="auth-form">
      <CyberInput 
        v-model="username" 
        label="USERNAME / EMAIL" 
        placeholder="Enter your handle..." 
        type="text"
        required
      />
      
      <CyberInput 
        v-model="password" 
        label="PASSWORD" 
        placeholder="••••••••" 
        type="password"
        required
      />

      <div class="form-options">
        <label class="checkbox-container">
          <input type="checkbox" v-model="rememberMe">
          <span class="checkmark"></span>
          <span class="checkbox-label text-secondary">Remember Link</span>
        </label>
        <a href="#" class="forgot-link text-muted">Forgot Key?</a>
      </div>

      <CyberButton type="submit" variant="primary" block>
        INITIALIZE_CONNECTION
      </CyberButton>

      <div class="auth-footer text-center mt-4">
        <span class="text-muted">No clearance? </span>
        <RouterLink to="/register" class="text-primary">Request Access</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CyberInput from '../components/ui/CyberInput.vue'
import CyberButton from '../components/ui/CyberButton.vue'

const router = useRouter()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)

const handleLogin = () => {
  // Simulate login
  if (username.value && password.value) {
    localStorage.setItem('token', 'fake-jwt-token')
    router.push('/')
  }
}
</script>

<style scoped>
.auth-box {
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 8px;
  padding: 3rem 2.5rem;
  backdrop-filter: blur(10px);
}

.auth-header {
  margin-bottom: 2.5rem;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.85rem;
}

/* Custom Checkbox */
.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 18px;
  width: 18px;
  background-color: rgba(11, 12, 16, 0.8);
  border: 1px solid var(--secondary);
  border-radius: 3px;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--primary);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: rgba(102, 252, 241, 0.2);
  border-color: var(--primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 4px;
  height: 9px;
  border: solid var(--primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.forgot-link {
  font-family: var(--font-mono);
  text-transform: uppercase;
}
.forgot-link:hover {
  text-shadow: 0 0 8px var(--text-muted);
}

.mt-4 {
  margin-top: 1.5rem;
}
.text-center {
  text-align: center;
}
</style>
