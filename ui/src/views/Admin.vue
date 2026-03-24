<template>
  <v-layout>
    <v-app-bar color="background" class="border-b" border="error">
      <template v-slot:prepend>
        <v-icon color="error" class="ml-4" size="x-large">mdi-shield-crown</v-icon>
      </template>
      <v-app-bar-title class="font-weight-black text-error" style="letter-spacing: 2px;">
        OVERSEER NODE
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn class="mr-4" color="primary" variant="outlined" to="/dashboard" prepend-icon="mdi-monitor-dashboard">
        Dashboard
      </v-btn>
    </v-app-bar>

    <v-main class="admin-bg">
      <v-container class="py-12">
        <v-tabs v-model="tab" color="error" align-tabs="center" class="mb-8 font-weight-bold">
          <v-tab value="users"><v-icon start>mdi-account-group</v-icon> Operatives</v-tab>
          <v-tab value="events"><v-icon start>mdi-calendar-alert</v-icon> War Games</v-tab>
        </v-tabs>

        <v-card class="glass-panel" rounded="xl" border="error">
          <v-window v-model="tab">
            
            <!-- USERS TAB -->
            <v-window-item value="users">
              <v-card-text>
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h4 text-error font-weight-black hacker-text">Network Operatives</h2>
                  <v-btn color="secondary" @click="fetchUsers" :loading="loading" prepend-icon="mdi-refresh">Refresh</v-btn>
                </div>
                
                <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
                  {{ error }}
                </v-alert>

                <v-table theme="dark" class="bg-transparent table-custom">
                  <thead>
                    <tr>
                      <th class="text-left text-error">ID</th>
                      <th class="text-left text-error">Username</th>
                      <th class="text-left text-error">Role</th>
                      <th class="text-left text-error">Status</th>
                      <th class="text-center text-error">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.id }}</td>
                      <td class="font-weight-bold text-primary">{{ user.username }}</td>
                      <td>
                        <v-chip :color="user.role === 'admin' ? 'error' : 'secondary'" size="small" variant="flat">
                          {{ user.role }}
                        </v-chip>
                      </td>
                      <td>
                        <v-chip :color="user.banned ? 'error' : 'success'" size="small" variant="outlined">
                          {{ user.banned ? 'BANNED' : 'ACTIVE' }}
                        </v-chip>
                      </td>
                      <td class="text-center">
                        <v-btn 
                          size="small" 
                          :color="user.banned ? 'success' : 'error'" 
                          variant="elevated" 
                          class="mx-1"
                          @click="toggleBan(user)"
                        >
                          {{ user.banned ? 'UNBAN' : 'BAN' }}
                        </v-btn>
                      </td>
                    </tr>
                    <tr v-if="users.length === 0">
                      <td colspan="5" class="text-center py-8 text-grey">No operatives found in the network.</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-window-item>

            <!-- EVENTS TAB -->
            <v-window-item value="events">
              <v-card-text>
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h4 text-error font-weight-black hacker-text">War Games</h2>
                  <v-btn color="error" @click="dialog = true" prepend-icon="mdi-plus">Create Event</v-btn>
                </div>

                <v-timeline side="end" align="start">
                  <v-timeline-item
                    v-for="event in events"
                    :key="event.id"
                    :dot-color="getStatusColor(event.status)"
                    size="small"
                  >
                    <v-card class="bg-surface border" :border="getStatusColor(event.status)" elevation="4">
                      <v-card-title :class="`text-${getStatusColor(event.status)} font-weight-bold`">
                        {{ event.title || event.name }}
                        <v-chip size="x-small" :color="getStatusColor(event.status)" class="ml-2">{{ event.status }}</v-chip>
                      </v-card-title>
                      <v-card-text class="pt-3">
                        <p class="mb-4">{{ event.description }}</p>
                        <div class="d-flex gap-2">
                          <v-btn size="small" v-if="event.status === 'draft'" color="secondary" @click="changeEventStatus(event.id, 'open')">OPEN</v-btn>
                          <v-btn size="small" v-if="event.status === 'open'" color="success" class="ml-2" @click="changeEventStatus(event.id, 'start')">START</v-btn>
                          <v-btn size="small" v-if="event.status === 'running'" color="error" class="ml-2" @click="changeEventStatus(event.id, 'finish')">FINISH</v-btn>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-container>
    </v-main>

    <!-- Create Event Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="glass-panel" border="primary">
        <v-card-title class="text-primary font-weight-bold">Create New Protocol</v-card-title>
        <v-card-text>
          <v-text-field v-model="newEvent.title" label="Event Title" variant="outlined" color="primary"></v-text-field>
          <v-textarea v-model="newEvent.description" label="Description" variant="outlined" color="primary"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="createEvent">Deploy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api'

const tab = ref('users')
const users = ref([])
const events = ref([])
const error = ref('')
const loading = ref(false)
const dialog = ref(false)

const newEvent = ref({
  title: '',
  description: ''
})

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'open': return 'secondary';
    case 'running': return 'success';
    case 'finished': return 'grey';
    case 'draft': 
    default: return 'warning';
  }
}

const fetchUsers = async () => {
  try {
    loading.value = true
    const res = await api.get('/users')
    users.value = res.data.data || res.data || []
  } catch (err) {
    error.value = 'Failed to load operatives. Ensure you have Admin clearance.'
  } finally {
    loading.value = false
  }
}

const fetchEvents = async () => {
  try {
    const res = await api.get('/events')
    events.value = res.data.data || res.data || []
  } catch (err) {
    console.error(err)
  }
}

const toggleBan = async (user) => {
  try {
    const endpoint = user.banned ? `/users/${user.id}/unban` : `/users/${user.id}/ban`
    await api.post(endpoint)
    await fetchUsers()
  } catch (err) {
    error.value = 'Failed to execute ban/unban protocol.'
  }
}

const changeEventStatus = async (id, action) => {
  try {
    await api.post(`/events/${id}/${action}`)
    await fetchEvents()
  } catch (err) {
    error.value = 'Failed to change event status.'
  }
}

const createEvent = async () => {
  try {
    await api.post('/events', {
      name: newEvent.value.title,
      title: newEvent.value.title,
      description: newEvent.value.description
    })
    dialog.value = false
    newEvent.value = { title: '', description: '' }
    await fetchEvents()
  } catch (err) {
    error.value = 'Failed to deploy event.'
  }
}

onMounted(() => {
  fetchUsers()
  fetchEvents()
})
</script>

<style scoped>
.admin-bg {
  background: radial-gradient(circle at top left, #1a0b0f 0%, #05070a 100%);
  min-height: 100vh;
}

.hacker-text {
  text-shadow: 0 0 10px rgba(255, 23, 68, 0.4);
  letter-spacing: 1px;
}

.glass-panel {
  background: rgba(18, 24, 38, 0.8) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 23, 68, 0.3) !important;
}

.table-custom {
  background: transparent !important;
}

.table-custom th {
  font-weight: 900 !important;
  font-size: 1rem !important;
  border-bottom: 2px solid #ff1744 !important;
}

.table-custom td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
</style>
