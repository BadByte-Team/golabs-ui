<template>
  <v-layout>
    <v-app-bar color="background" class="border-b" border="primary">
      <template v-slot:prepend>
        <v-icon color="primary" class="ml-4 glow-icon" size="x-large">mdi-calendar-star</v-icon>
      </template>
      <v-app-bar-title class="font-weight-black text-primary ctf-brand">
        WAR GAMES
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn class="mr-4" color="secondary" variant="outlined" to="/dashboard" prepend-icon="mdi-view-dashboard">
        Dashboard
      </v-btn>
    </v-app-bar>

    <v-main class="events-bg">
      <v-container class="py-12">
        <div class="d-flex justify-space-between align-center mb-8">
          <h2 class="text-h4 font-weight-black text-white" style="letter-spacing: 1px;">AVAILABLE PROTOCOLS</h2>
          <v-btn color="primary" variant="outlined" @click="fetchEvents" :loading="loading" prepend-icon="mdi-refresh">Refresh Matrix</v-btn>
        </div>

        <v-alert v-if="error" type="error" variant="tonal" class="mb-8 border-error">
          {{ error }}
        </v-alert>

        <v-row>
          <v-col cols="12" md="6" lg="4" v-for="event in events" :key="event.id">
            <v-card class="glass-panel" rounded="xl" :border="getStatusColor(event.status)" elevation="8">
              <div class="d-flex justify-space-between p-4 px-4 pt-4">
                <v-chip size="small" :color="getStatusColor(event.status)" class="font-weight-boldtext-uppercase" variant="flat">
                  {{ event.status }}
                </v-chip>
                <div class="text-caption text-grey">Limit: {{ event.max_team_size }} Operatives / Team</div>
              </div>
              
              <v-card-title class="text-h5 font-weight-black mt-2 text-wrap line-clamp-2">
                {{ event.name || event.title }}
              </v-card-title>
              
              <v-card-text class="mt-2 text-grey-lighten-1">
                <p class="mb-4 description-text">{{ event.description || "No transmission data found for this protocol." }}</p>
                <div class="d-flex align-center text-caption mb-1">
                  <v-icon size="small" class="mr-2 text-primary">mdi-clock-start</v-icon>
                  Starts: {{ new Date(event.starts_at).toLocaleString() }}
                </div>
                <div class="d-flex align-center text-caption">
                  <v-icon size="small" class="mr-2 text-error">mdi-clock-end</v-icon>
                  Ends: {{ new Date(event.ends_at).toLocaleString() }}
                </div>
              </v-card-text>
              
              <v-divider class="border-opacity-25 my-0"></v-divider>
              
              <v-card-actions class="px-4 py-3 bg-black bg-opacity-20 d-flex justify-end gap-2">
                <v-btn 
                  v-if="event.status === 'open' || event.status === 'running'" 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                  @click="openTeamDialog(event)"
                >
                  TEAM UPLINK
                </v-btn>
                <v-btn 
                  color="secondary" 
                  variant="elevated" 
                  size="small"
                  :disabled="event.status === 'draft'"
                  @click="viewLeaderboard(event)"
                >
                  LEADERBOARD
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        
        <div v-if="events.length === 0 && !loading" class="text-center py-12 mt-12 glass-panel rounded-xl">
          <v-icon size="64" color="grey" class="mb-4">mdi-radar</v-icon>
          <h3 class="text-h5 text-grey">No active War Games detected on the network.</h3>
        </div>
      </v-container>
    </v-main>

    <!-- Team Interaction Dialog -->
    <v-dialog v-model="teamDialog" max-width="500">
      <v-card class="glass-panel" border="primary">
        <v-card-title class="text-primary font-weight-black border-b d-flex justify-space-between align-center px-6 py-4">
          Establish Team Uplink
          <v-btn icon="mdi-close" variant="text" size="small" @click="teamDialog = false"></v-btn>
        </v-card-title>
        
        <v-tabs v-model="teamTab" color="primary" grow>
          <v-tab value="join">Join Existing</v-tab>
          <v-tab value="create">Create New</v-tab>
        </v-tabs>
        
        <v-card-text class="pt-6">
          <v-alert v-if="teamError" type="error" variant="tonal" class="mb-4">{{ teamError }}</v-alert>
          <v-alert v-if="teamSuccess" type="success" variant="tonal" class="mb-4">{{ teamSuccess }}</v-alert>
          
          <v-window v-model="teamTab">
            <!-- Join Team -->
            <v-window-item value="join">
              <p class="text-caption text-grey mb-4">Input the cryptographic JOIN SECRET provided by a team captain to establish neural sync.</p>
              <v-text-field v-model="joinSecretStr" label="Join Secret" variant="outlined" color="primary" prepend-inner-icon="mdi-key" @keyup.enter="joinTeam"></v-text-field>
              <v-btn color="primary" block @click="joinTeam" :loading="actionLoading" class="mt-2 font-weight-black" variant="elevated">Initiate Sync</v-btn>
            </v-window-item>
            
            <!-- Create Team -->
            <v-window-item value="create">
              <p class="text-caption text-grey mb-4">Found a vanguard unit. You will be assigned as the Captain of this new element.</p>
              <v-text-field v-model="newTeamName" label="Squadron Name" variant="outlined" color="primary" prepend-inner-icon="mdi-shield-account" @keyup.enter="createTeam"></v-text-field>
              <v-btn color="primary" block @click="createTeam" :loading="actionLoading" class="mt-2 font-weight-black" variant="elevated">Found Element</v-btn>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

const router = useRouter()
const events = ref([])
const loading = ref(false)
const error = ref('')

const teamDialog = ref(false)
const teamTab = ref('join')
const teamError = ref('')
const teamSuccess = ref('')
const actionLoading = ref(false)
const activeEvent = ref(null)

const joinSecretStr = ref('')
const newTeamName = ref('')

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'open': return 'primary';
    case 'running': return 'error';
    case 'finished': return 'grey';
    case 'draft': default: return 'warning';
  }
}

const fetchEvents = async () => {
  try {
    loading.value = true
    error.value = ''
    const res = await api.get('/events')
    events.value = res.data.data || res.data || []
  } catch (err) {
    error.value = 'Failed to fetch the War Games timeline from the server.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openTeamDialog = (event) => {
  activeEvent.value = event
  teamError.value = ''
  teamSuccess.value = ''
  joinSecretStr.value = ''
  newTeamName.value = ''
  teamDialog.value = true
}

const createTeam = async () => {
  if (!newTeamName.value.trim()) {
    teamError.value = 'Squadron name is strictly required.'
    return
  }
  try {
    actionLoading.value = true
    teamError.value = ''
    teamSuccess.value = ''
    
    const res = await api.post(`/events/${activeEvent.value.id}/teams`, {
      name: newTeamName.value.trim()
    })
    
    const secret = res.data.join_secret
    teamSuccess.value = `Squadron founded successfully! IMPORTANT: Save this Join Secret to invite operatives: ${secret}`
    newTeamName.value = ''
  } catch (err) {
    teamError.value = err.response?.data?.error || 'Failed to found element.'
  } finally {
    actionLoading.value = false
  }
}

const joinTeam = async () => {
  if (!joinSecretStr.value.trim()) {
    teamError.value = 'Join secret is required.'
    return
  }
  try {
    actionLoading.value = true
    teamError.value = ''
    teamSuccess.value = ''
    
    await api.post(`/events/${activeEvent.value.id}/teams/join`, {
      join_secret: joinSecretStr.value.trim()
    })
    
    teamSuccess.value = 'Neural sync established! You have joined the squadron.'
    joinSecretStr.value = ''
  } catch (err) {
    teamError.value = err.response?.data?.error || 'Failed to establish sync. Check your secret.'
  } finally {
    actionLoading.value = false
  }
}

const viewLeaderboard = (event) => {
  // Not implemented yet on UI side, but could navigate to /events/:id/leaderboard 
  // or show another dialog. We'll simply show a message.
  alert('Leaderboard visualizer system is booting up... (Not currently implemented in this terminal)')
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.events-bg {
  background: radial-gradient(circle at top right, #051410 0%, #03080c 100%);
  min-height: 100vh;
}

.ctf-brand {
  letter-spacing: 2px;
}

.glow-icon {
  filter: drop-shadow(0 0 10px rgba(0, 230, 118, 0.6));
}

.glass-panel {
  background: rgba(10, 16, 26, 0.6) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 230, 118, 0.1) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 230, 118, 0.2) !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.description-text {
  font-size: 0.875rem;
  line-height: 1.4;
  height: 2.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
