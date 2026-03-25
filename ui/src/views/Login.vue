<template>
  <v-container fluid class="pa-0 fill-height login-wrapper">
    <v-row no-gutters class="fill-height">
      <!-- LEFT SIDE: Branding & Cybersecurity Visuals -->
      <v-col cols="12" md="6" class="left-panel d-none d-md-flex flex-column justify-center align-center position-relative">
        <div class="cyber-overlay"></div>
        <div class="cyber-grid"></div>
        
        <v-icon size="120" color="primary" class="mb-6 glow-icon">mdi-shield-lock-outline</v-icon>
        <h1 class="text-h2 font-weight-black text-white text-center mb-4 ctf-logo">
          GOLABS <span class="text-primary">CTF</span>
        </h1>
        <p class="text-h5 text-grey-lighten-1 font-weight-medium tracking-wide">
          HACK. LEARN. COMPETE.
        </p>
      </v-col>

      <!-- RIGHT SIDE: Minimal Auth Form -->
      <v-col cols="12" md="6" class="right-panel d-flex align-center justify-center">
        <v-card class="elevation-0 bg-transparent pa-8 pa-sm-12 auth-card" width="100%" max-width="500">
          
          <div class="d-md-none text-center mb-10">
            <v-icon size="80" color="primary" class="mb-4">mdi-shield-lock-outline</v-icon>
            <h1 class="text-h4 font-weight-black text-white">GOLABS <span class="text-primary">CTF</span></h1>
          </div>

          <h2 class="text-h4 font-weight-bold text-white mb-2">
            {{ registering ? 'Create Account' : 'Welcome Back' }}
          </h2>
          <p class="text-grey-lighten-1 mb-8">
            {{ registering ? 'Join the grid and prove your skills.' : 'Enter your credentials to access the mainframe.' }}
          </p>
          
          <v-alert v-if="error" type="error" variant="tonal" border="start" class="mb-6 auth-alert">
            {{ error }}
          </v-alert>

          <v-form @submit.prevent="handleLogin" v-model="valid">
            <v-text-field
              v-model="username"
              label="Username"
              variant="underlined"
              color="primary"
              prepend-inner-icon="mdi-account"
              class="mb-4 custom-input"
              required
            ></v-text-field>

            <v-slide-y-transition>
              <v-text-field
                v-if="registering"
                v-model="email"
                label="Email Address"
                variant="underlined"
                color="primary"
                prepend-inner-icon="mdi-email"
                class="mb-4 custom-input"
                required
              ></v-text-field>
            </v-slide-y-transition>

            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              variant="underlined"
              color="primary"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              class="mb-2 custom-input"
              required
            ></v-text-field>

            <div class="d-flex justify-space-between align-center mb-8" v-if="!registering">
              <v-checkbox label="Remember me" color="primary" hide-details class="text-grey-lighten-1"></v-checkbox>
              <a href="#" class="text-primary text-decoration-none text-body-2 font-weight-bold hover-glow">Forgot Password?</a>
            </div>

            <v-btn
              type="submit"
              block
              size="x-large"
              color="primary"
              class="auth-btn font-weight-bold mb-6"
              :loading="loading"
              elevation="8"
            >
              {{ registering ? 'INITIALIZE HACK' : 'AUTHENTICATE' }}
            </v-btn>
          </v-form>

          <div class="text-center">
            <span class="text-grey-lighten-1">{{ registering ? 'Already an operative?' : 'New to the platform?' }}</span>
            <v-btn 
              variant="text" 
              color="secondary" 
              class="font-weight-bold ml-2 text-none" 
              @click="toggleMode"
            >
              {{ registering ? 'Sign In' : 'Create an Account' }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

const router = useRouter()
const valid = ref(false)
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const registering = ref(false)

const toggleMode = () => {
  registering.value = !registering.value
  error.value = ''
  username.value = ''
  password.value = ''
  email.value = ''
}

const handleLogin = async () => {
  if (!username.value || !password.value) return
  loading.value = true
  error.value = ''
  
  try {
    if (registering.value) {
      if (!email.value) {
        error.value = 'Email is required for registration.'
        loading.value = false
        return
      }
      await api.post('/auth/register', {
        username: username.value,
        email: email.value,
        password: password.value,
      })
      error.value = 'Registration successful! Please sign in.'
      toggleMode()
    } else {
      const res = await api.post('/auth/login', {
        identifier: username.value,
        password: password.value,
      })
      if (res.data.access_token) {
        localStorage.setItem('access_token', res.data.access_token)
        if (res.data.refresh_token) {
          localStorage.setItem('refresh_token', res.data.refresh_token)
        }
        router.push('/dashboard')
      } else {
        error.value = 'Token missing in response'
      }
    }
  } catch (err) {
    if (err.response?.status === 400 || err.response?.status === 422) {
      error.value = 'Invalid data provided. Check your inputs.'
    } else if (err.response?.status === 409) {
      error.value = 'Username or email already in use.'
    } else if (err.response?.status === 401 || err.response?.status === 403) {
      error.value = 'Invalid credentials or access denied.'
    } else {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Connection to mainframe failed. Try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  background-color: #05070a;
}

.left-panel {
  background: linear-gradient(135deg, rgba(0, 230, 118, 0.05) 0%, rgba(24, 255, 255, 0.02) 100%), #0a0e17;
  border-right: 1px solid rgba(0, 230, 118, 0.2);
  overflow: hidden;
}

.right-panel {
  background-color: #0a0e17;
}

/* Abstract Cyber Background */
.cyber-grid {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 230, 118, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 230, 118, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.5;
  z-index: 1;
}

.cyber-overlay {
  position: absolute;
  top: -50%; left: -50%; right: -50%; bottom: -50%;
  background: radial-gradient(circle at center, rgba(24, 255, 255, 0.08) 0%, transparent 50%);
  animation: pulse-glow 8s infinite alternate;
  z-index: 0;
}

.glow-icon {
  filter: drop-shadow(0 0 20px rgba(0, 230, 118, 0.6));
  z-index: 2;
}

.ctf-logo {
  letter-spacing: 2px;
  z-index: 2;
}

.tracking-wide {
  letter-spacing: 4px;
  z-index: 2;
}

/* Auth Form Styles */
.auth-card {
  z-index: 2;
}

.custom-input :deep(.v-field__input) {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.1rem;
}

.auth-btn {
  letter-spacing: 2px;
  background: linear-gradient(90deg, #00e676 0%, #00c853 100%) !important;
  color: #000 !important;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 230, 118, 0.3) !important;
}

.auth-btn:hover {
  filter: brightness(1.2);
  box-shadow: 0 0 25px rgba(0, 230, 118, 0.6) !important;
  transform: translateY(-2px);
}

.hover-glow:hover {
  text-shadow: 0 0 8px rgba(24, 255, 255, 0.8);
  transition: text-shadow 0.2s ease;
}

.auth-alert {
  border: 1px solid rgba(255, 23, 68, 0.5) !important;
  background: rgba(255, 23, 68, 0.1) !important;
}

@keyframes pulse-glow {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.1); opacity: 0.8; }
}
</style>
