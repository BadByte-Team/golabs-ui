<template>
  <v-container fluid class="fill-height login-wrapper">
    <div class="glow-bg"></div>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card class="elevation-24 pa-8 glass-card" rounded="xl" border="primary md">
          <v-card-title class="text-center text-primary text-h4 font-weight-black mb-6 ctf-title">
            GOLABS CTF
          </v-card-title>
          
          <v-card-text>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>

            <v-form @submit.prevent="handleLogin" v-model="valid">
              <v-text-field
                v-model="username"
                label="Username / Agent ID"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-shield-account"
                class="mb-2"
                required
              ></v-text-field>

              <v-text-field
                v-if="registering"
                v-model="email"
                label="Comlink Address (Email)"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-email"
                class="mb-2"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Passphrase"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                class="mb-6"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                block
                size="x-large"
                color="primary"
                class="login-btn font-weight-bold"
                :loading="loading"
              >
                INITIALIZE HACK
              </v-btn>
            </v-form>
          </v-card-text>
          <div class="text-center mt-4">
            <v-btn variant="text" color="secondary" size="small" @click="registering = !registering">
              {{ registering ? 'Return to login' : 'Request Access (Register)' }}
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
      error.value = 'Registration successful! Please log in.'
      email.value = ''
      password.value = ''
      registering.value = false
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
    if (err.response?.status === 400) {
      error.value = 'Invalid data provided.'
    } else if (err.response?.status === 409) {
      error.value = 'Username or email already in use.'
    } else if (err.response?.status === 401 || err.response?.status === 403) {
      error.value = 'Invalid credentials or access denied.'
    } else {
      error.value = err.response?.data?.message || 'Connection to mainframe failed. Try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  background: radial-gradient(circle at center, #0a0e17 0%, #000000 100%);
  position: relative;
  overflow: hidden;
}

.glow-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  height: 60vh;
  background: radial-gradient(circle, rgba(0,230,118,0.1) 0%, rgba(0,0,0,0) 70%);
  z-index: 0;
  pointer-events: none;
}

.ctf-title {
  letter-spacing: 4px;
  text-shadow: 0 0 10px rgba(0, 230, 118, 0.5);
}

.glass-card {
  background: rgba(18, 24, 38, 0.7) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px);
  z-index: 1;
  border: 1px solid rgba(0, 230, 118, 0.3) !important;
}

.login-btn {
  letter-spacing: 1px;
  text-shadow: 0px 0px 5px rgba(0,0,0,0.5);
  box-shadow: 0 0 15px rgba(0, 230, 118, 0.4);
  transition: all 0.3s ease;
}

.login-btn:hover {
  box-shadow: 0 0 25px rgba(0, 230, 118, 0.7);
  transform: translateY(-2px);
}
</style>
