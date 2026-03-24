<template>
  <v-layout>
    <!-- Navigation Bar -->
    <v-app-bar color="background" class="border-b" border="primary">
      <template v-slot:prepend>
        <v-icon color="primary" class="ml-4" size="x-large">mdi-shield-check</v-icon>
      </template>

      <v-app-bar-title class="font-weight-black text-primary" style="letter-spacing: 2px;">
        GOLABS CTF
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn class="mr-4" color="error" variant="outlined" @click="logout" prepend-icon="mdi-logout">
        Disconnect
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="dashboard-bg">
      <v-container class="py-12">
        <h1 class="text-h3 font-weight-bold text-white mb-8 ctf-header">Active Events</h1>
        
        <v-row v-if="loading">
          <v-col cols="12" class="text-center mt-12">
            <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
            <div class="mt-4 text-secondary">Fetching mainframes...</div>
          </v-col>
        </v-row>

        <v-row v-else-if="error">
          <v-col cols="12">
            <v-alert type="error" variant="tonal" border="start" elevation="2">
              {{ error }}
            </v-alert>
          </v-col>
        </v-row>
        
        <v-row v-else-if="events.length === 0">
          <v-col cols="12">
            <v-card class="pa-12 text-center empty-card glass-panel" rounded="xl">
              <v-icon size="100" color="grey-darken-2" class="mb-4">mdi-server-network-off</v-icon>
              <h2 class="text-h5 text-grey-lighten-1">No Active CTF Events Found</h2>
              <p class="text-grey-darken-1 mt-2">Check back later for new challenges.</p>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col v-for="event in events" :key="event.id" cols="12" md="6" lg="4">
            <v-card class="event-card glass-panel" hover rounded="xl" border="secondary">
              <v-card-title class="text-h5 font-weight-bold pt-6 px-6 text-primary">
                {{ event.title || event.name || 'Unnamed CTF Event' }}
              </v-card-title>
              
              <v-card-text class="px-6 pb-6">
                <v-chip color="secondary" size="small" class="mb-4 font-weight-bold" variant="flat">
                  {{ event.status || 'OPEN' }}
                </v-chip>
                
                <p class="text-body-1 text-grey-lighten-2 mb-4">
                  {{ event.description || 'Access the network and capture the flags to prove your skill.' }}
                </p>
              </v-card-text>
              
              <v-divider color="primary" class="mx-4"></v-divider>
              
              <v-card-actions class="pa-4">
                <v-btn color="primary" block variant="flat" size="large" class="join-btn font-weight-bold">
                  INITIALIZE BREACH
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

const router = useRouter()
const events = ref([])
const error = ref('')
const loading = ref(true)

const fetchEvents = async () => {
  try {
    loading.value = true
    const res = await api.get('/events')
    // Handle array or data wrapper
    events.value = res.data.data || res.data || []
  } catch (err) {
    if (err.response?.status === 401) {
      logout() // Token expired
    }
    error.value = 'Failed to fetch events from the backend API.'
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  router.push('/login')
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top right, #0a0e17 0%, #05070a 100%);
  min-height: 100vh;
}

.ctf-header {
  text-shadow: 0 0 15px rgba(24, 255, 255, 0.3);
  letter-spacing: 1px;
}

.glass-panel {
  background: rgba(18, 24, 38, 0.6) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(24, 255, 255, 0.2) !important;
  transition: all 0.3s ease;
}

.empty-card {
  border-style: dashed !important;
  border-width: 2px !important;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 230, 118, 0.15), 0 0 0 1px rgba(0, 230, 118, 0.5) !important;
}

.join-btn {
  letter-spacing: 1.5px;
  background: linear-gradient(90deg, #00e676 0%, #18ffff 100%) !important;
  color: #000 !important;
  transition: all 0.3s ease;
}

.join-btn:hover {
  filter: brightness(1.2);
  box-shadow: 0 0 20px rgba(24, 255, 255, 0.4);
}
</style>
