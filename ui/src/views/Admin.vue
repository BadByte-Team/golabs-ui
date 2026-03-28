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
          <v-tab value="challenges"><v-icon start>mdi-skull-crossbones</v-icon> Challenges</v-tab>
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
                      <th class="text-left text-error">Username</th>
                      <th class="text-left text-error">Role</th>
                      <th class="text-left text-error">Points</th>
                      <th class="text-left text-error">Status</th>
                      <th class="text-center text-error">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td class="font-weight-bold text-primary">{{ user.username }}</td>
                      <td>
                        <v-chip :color="user.role === 'admin' ? 'error' : 'secondary'" size="small" variant="flat">
                          {{ user.role }}
                        </v-chip>
                      </td>
                      <td>{{ user.points || 0 }}</td>
                      <td>
                        <v-chip :color="user.banned ? 'error' : 'success'" size="small" variant="outlined">
                          {{ user.banned ? 'BANNED' : 'ACTIVE' }}
                        </v-chip>
                      </td>
                      <td class="text-center d-flex justify-center flex-wrap gap-1 align-center">
                        <v-btn size="small" color="primary" variant="outlined" class="mx-1" @click="openEditUserDialog(user)">
                          EDIT
                        </v-btn>
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
                      <td colspan="6" class="text-center py-8 text-grey">No operatives found in the network.</td>
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
                  <v-btn color="error" @click="openCreateEventDialog" prepend-icon="mdi-plus">Create Event</v-btn>
                </div>

                <v-table theme="dark" class="bg-transparent glass-panel rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th class="text-left font-weight-bold">Protocol Name</th>
                      <th class="text-left font-weight-bold text-primary">Status Override</th>
                      <th class="text-left font-weight-bold text-secondary">Dates</th>
                      <th class="text-right font-weight-bold text-error">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="event in activeEvents" :key="event.id" class="border-b" style="border-color: rgba(0, 230, 118, 0.1) !important;">
                      <td class="py-3">
                        <div class="font-weight-bold text-subtitle-1">{{ event.name || event.title }}</div>
                        <div class="text-caption text-grey mt-1">{{ event.max_team_size }} Operatives Max Limit</div>
                      </td>
                      <td style="width: 200px;">
                        <v-select
                          :model-value="event.status"
                          @update:model-value="forceChangeStatus(event, $event)"
                          :items="['draft', 'open', 'running', 'finished']"
                          density="compact"
                          variant="outlined"
                          hide-details
                          class="status-select"
                        >
                          <template v-slot:selection="{ item }">
                            <v-chip size="small" :color="getStatusColor(item.title)" class="text-uppercase font-weight-black w-100 justify-center">
                              {{ item.title }}
                            </v-chip>
                          </template>
                        </v-select>
                      </td>
                      <td>
                        <div class="text-caption text-grey-lighten-1"><v-icon size="small" class="mr-1">mdi-clock-start</v-icon>{{ new Date(event.starts_at).toLocaleString() }}</div>
                        <div class="text-caption text-grey-lighten-1 mt-1"><v-icon size="small" class="mr-1" color="error">mdi-clock-end</v-icon>{{ new Date(event.ends_at).toLocaleString() }}</div>
                      </td>
                      <td class="text-right">
                        <v-btn v-if="event.status === 'draft'" size="small" icon="mdi-pencil" variant="text" color="primary" @click="openEditEventDialog(event)"></v-btn>
                        <v-btn v-if="event.status === 'draft'" size="small" icon="mdi-delete" variant="text" color="error" @click="deleteEvent(event.id)"></v-btn>
                        <span v-if="event.status !== 'draft'" class="text-caption text-grey">Locked</span>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-window-item>

            <!-- CHALLENGES TAB -->
            <v-window-item value="challenges">
              <v-card-text>
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h4 text-error font-weight-black hacker-text">Challenge Matrices</h2>
                </div>
                
                <v-select
                  v-model="selectedEventId"
                  :items="events"
                  item-title="name"
                  item-value="id"
                  label="Select War Game / Event"
                  variant="outlined"
                  color="error"
                  class="mb-6"
                  @update:model-value="fetchChallenges"
                ></v-select>

                <template v-if="selectedEventId">
                  <v-btn color="error" variant="outlined" class="mb-4" @click="openCreateChallengeDialog" prepend-icon="mdi-plus">Add Challenge</v-btn>
                  
                  <v-table theme="dark" class="bg-transparent table-custom">
                    <thead>
                      <tr>
                        <th class="text-left text-error">Name</th>
                        <th class="text-left text-error">Category</th>
                        <th class="text-left text-error">Points</th>
                        <th class="text-left text-error">Published</th>
                        <th class="text-center text-error">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="challenge in challenges" :key="challenge.id">
                        <td class="font-weight-bold text-primary">{{ challenge.title }}</td>
                        <td>{{ challenge.category }}</td>
                        <td>{{ challenge.points }}</td>
                        <td>
                          <v-chip :color="challenge.published ? 'success' : 'grey'" size="small" variant="outlined">
                            {{ challenge.published ? 'YES' : 'NO' }}
                          </v-chip>
                        </td>
                        <td class="text-center">
                          <v-btn size="small" class="mx-1" color="primary" variant="outlined" @click="openEditChallengeDialog(challenge)">EDIT</v-btn>
                          <v-btn size="small" class="mx-1" color="secondary" variant="outlined" @click="openSetFlagDialog(challenge)" prepend-icon="mdi-flag-variant">FLAG</v-btn>
                          <v-btn v-if="!challenge.published" size="small" class="mx-1" color="success" variant="elevated" @click="publishChallenge(challenge.id)">PUBLISH</v-btn>
                        </td>
                      </tr>
                      <tr v-if="challenges.length === 0">
                        <td colspan="5" class="text-center py-8 text-grey">No challenges deployed in this event yet.</td>
                      </tr>
                    </tbody>
                  </v-table>
                </template>
              </v-card-text>
            </v-window-item>

          </v-window>
        </v-card>
      </v-container>
    </v-main>

    <!-- Create/Edit Event Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="glass-panel" border="primary">
        <v-card-title class="text-primary font-weight-bold">{{ editModeEvent ? 'Edit Protocol' : 'Create New Protocol' }}</v-card-title>
        <v-card-text>
          <v-alert v-if="dialogError" type="error" variant="tonal" class="mb-4">{{ dialogError }}</v-alert>
          <v-text-field v-model="newEvent.name" label="Event Title" variant="outlined" class="mb-2"></v-text-field>
          <v-textarea v-model="newEvent.description" label="Description" variant="outlined" class="mb-2"></v-textarea>
          <v-text-field v-model.number="newEvent.max_team_size" label="Max Team Size" type="number" variant="outlined" class="mb-2"></v-text-field>
          <v-text-field v-model="newEvent.starts_at" label="Starts At" type="datetime-local" variant="outlined" class="mb-2"></v-text-field>
          <v-text-field v-model="newEvent.ends_at" label="Ends At" type="datetime-local" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveEvent">Deploy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit User Dialog -->
    <v-dialog v-model="userDialog" max-width="400">
      <v-card class="glass-panel" border="primary">
        <v-card-title class="text-primary font-weight-bold">Edit Operative Profile</v-card-title>
        <v-card-text>
          <v-alert v-if="userDialogError" type="error" variant="tonal" class="mb-4">{{ userDialogError }}</v-alert>
          <v-text-field v-model="selectedUser.username" label="Username (Read-Only)" variant="outlined" readonly class="mb-2"></v-text-field>
          <v-select v-model="editUserForm.role" :items="['user', 'admin']" label="Role" variant="outlined" class="mb-2"></v-select>
          <v-text-field v-model.number="editUserForm.points" label="Points" type="number" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="userDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="updateUser" :loading="formLoading">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Challenge Dialog (Create/Edit) -->
    <v-dialog v-model="challengeDialog" max-width="500">
      <v-card class="glass-panel" border="error">
        <v-card-title class="text-error font-weight-bold">{{ editModeChallenge ? 'Edit Challenge' : 'New Challenge' }}</v-card-title>
        <v-card-text>
          <v-alert v-if="challengeDialogError" type="error" variant="tonal" class="mb-4">{{ challengeDialogError }}</v-alert>
          <v-text-field v-model="challengeForm.title" label="Title" variant="outlined" class="mb-2"></v-text-field>
          <v-select v-model="challengeForm.difficulty" :items="['easy', 'medium', 'hard']" label="Difficulty" variant="outlined" class="mb-2"></v-select>
          <v-text-field v-model="challengeForm.category" label="Category (e.g. pwn, web)" variant="outlined" class="mb-2"></v-text-field>
          <v-textarea v-model="challengeForm.description" label="Description" variant="outlined" class="mb-2"></v-textarea>
          <v-text-field v-model.number="challengeForm.points" label="Points" type="number" variant="outlined" class="mb-2"></v-text-field>
          <v-text-field v-model="challengeForm.hints" label="Hints (Optional)" variant="outlined" class="mb-2"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="challengeDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="saveChallenge" :loading="formLoading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Set Flag Dialog -->
    <v-dialog v-model="flagDialog" max-width="400">
      <v-card class="glass-panel" border="success">
        <v-card-title class="text-success font-weight-bold">Set Secret Flag</v-card-title>
        <v-card-text>
          <v-alert v-if="flagDialogError" type="error" variant="tonal" class="mb-4">{{ flagDialogError }}</v-alert>
          <p class="mb-4 text-grey">Establish the flag string for this challenge. It will be securely hashed on the backend.</p>
          <v-text-field v-model="flagForm.flag" label="Flag Format" placeholder="golabs{...}" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="flagDialog = false">Cancel</v-btn>
          <v-btn color="success" @click="saveFlag" :loading="formLoading">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '@/api'

const tab = ref('users')
const users = ref([])
const events = ref([])
const activeEvents = computed(() => events.value.filter(e => e.status !== 'finished'))
const error = ref('')
const loading = ref(false)
const formLoading = ref(false)

// Events
const dialog = ref(false)
const editModeEvent = ref(false)
const selectedEventEditId = ref(null)
const dialogError = ref('')
const newEvent = ref({
  name: '', description: '', max_team_size: 4,
  starts_at: new Date().toISOString().slice(0, 16),
  ends_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
})

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'open': return 'secondary';
    case 'running': return 'success';
    case 'finished': return 'grey';
    case 'draft': default: return 'warning';
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

const openCreateEventDialog = () => {
  editModeEvent.value = false
  newEvent.value = {
    name: '', description: '', max_team_size: 4,
    starts_at: new Date().toISOString().slice(0, 16),
    ends_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  }
  dialogError.value = ''
  dialog.value = true
}

const openEditEventDialog = (ev) => {
  editModeEvent.value = true
  selectedEventEditId.value = ev.id
  newEvent.value = {
    name: ev.name || ev.title, 
    description: ev.description, 
    max_team_size: ev.max_team_size,
    starts_at: ev.starts_at ? new Date(ev.starts_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    ends_at: ev.ends_at ? new Date(ev.ends_at).toISOString().slice(0, 16) : new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  }
  dialogError.value = ''
  dialog.value = true
}

const saveEvent = async () => {
  try {
    dialogError.value = ''
    const payload = {
      name: newEvent.value.name,
      description: newEvent.value.description,
      max_team_size: Number(newEvent.value.max_team_size),
      starts_at: new Date(newEvent.value.starts_at).toISOString(),
      ends_at: new Date(newEvent.value.ends_at).toISOString(),
    }
    
    if (editModeEvent.value) {
      await api.put(`/events/${selectedEventEditId.value}`, payload)
    } else {
      await api.post('/events', payload)
    }
    
    dialog.value = false
    await fetchEvents()
  } catch (err) {
    dialogError.value = err.response?.data?.error || err.message || 'Failed to deploy event.'
  }
}

const deleteEvent = async (id) => {
  if (!confirm('Are you sure you want to completely erase this event protocol?')) return
  try {
    await api.delete(`/events/${id}`)
    await fetchEvents()
  } catch (err) {
    alert(err.response?.data?.error || 'Failed to delete event.')
  }
}

const changeEventStatus = async (id, action) => {
  try {
    await api.post(`/events/${id}/${action}`)
  } catch (err) { throw err }
}

const forceChangeStatus = async (event, targetStatus) => {
  const current = event.status
  if (current === targetStatus) return
  
  const states = ['draft', 'open', 'running', 'finished']
  const currentIndex = states.indexOf(current)
  const targetIndex = states.indexOf(targetStatus)
  
  // API does not support rewinding state
  if (targetIndex < currentIndex) {
    alert(`The backend API strictly prohibits reversing an event's state (Cannot go from ${current.toUpperCase()} back to ${targetStatus.toUpperCase()}). Please create a new protocol.`)
    await fetchEvents() // Revert UI
    return
  }
  
  try {
    // Chain forward transitions to reach target
    if (currentIndex < 1 && targetIndex >= 1) await changeEventStatus(event.id, 'open')
    if (currentIndex < 2 && targetIndex >= 2) await changeEventStatus(event.id, 'start')
    if (currentIndex < 3 && targetIndex >= 3) await changeEventStatus(event.id, 'finish')
    
    await fetchEvents()
  } catch (err) {
    alert('Failed to execute protocol state transitions: ' + (err.response?.data?.error || err.message))
    await fetchEvents()
  }
}

const createEvent = async () => {
  try {
    dialogError.value = ''
    await api.post('/events', {
      name: newEvent.value.name,
      description: newEvent.value.description,
      max_team_size: Number(newEvent.value.max_team_size),
      starts_at: new Date(newEvent.value.starts_at).toISOString(),
      ends_at: new Date(newEvent.value.ends_at).toISOString(),
    })
    dialog.value = false
    await fetchEvents()
  } catch (err) {
    dialogError.value = err.response?.data?.error || err.message || 'Failed to deploy event.'
  }
}

// Users
const fetchUsers = async () => {
  try {
    loading.value = true
    const res = await api.get('/users')
    users.value = res.data.data || res.data || []
  } catch (err) {
    error.value = 'Failed to load operatives.'
  } finally {
    loading.value = false
  }
}

const toggleBan = async (user) => {
  try {
    const endpoint = user.banned ? `/admin/users/${user.id}/unban` : `/admin/users/${user.id}/ban`
    await api.post(endpoint)
    await fetchUsers()
  } catch (err) { }
}

const userDialog = ref(false)
const userDialogError = ref('')
const selectedUser = ref(null)
const editUserForm = ref({ role: 'user', points: 0 })

const openEditUserDialog = (user) => {
  selectedUser.value = user
  editUserForm.value.role = user.role || 'user'
  editUserForm.value.points = user.points || 0
  userDialogError.value = ''
  userDialog.value = true
}

const updateUser = async () => {
  try {
    formLoading.value = true
    userDialogError.value = ''
    // Change Role
    if (editUserForm.value.role !== selectedUser.value.role) {
      await api.post(`/admin/users/${selectedUser.value.id}/role`, { role: editUserForm.value.role })
    }
    // Change Points
    if (editUserForm.value.points !== selectedUser.value.points) {
      await api.post(`/admin/users/${selectedUser.value.id}/points`, { points: editUserForm.value.points })
    }
    await fetchUsers()
    userDialog.value = false
  } catch (err) {
    userDialogError.value = 'Failed to update user parameters.'
  } finally {
    formLoading.value = false
  }
}

// Challenges
const challenges = ref([])
const selectedEventId = ref(null)

const fetchChallenges = async () => {
  if (!selectedEventId.value) return
  try {
    const res = await api.get(`/events/${selectedEventId.value}/challenges`)
    challenges.value = res.data.data || res.data || []
  } catch (err) {
    console.error(err)
    challenges.value = []
  }
}

const challengeDialog = ref(false)
const editModeChallenge = ref(false)
const challengeDialogError = ref('')
const selectedChallengeId = ref(null)
const challengeForm = ref({ title: '', difficulty: 'medium', category: '', description: '', points: 10, hints: '' })

const openCreateChallengeDialog = () => {
  editModeChallenge.value = false
  challengeForm.value = { title: '', difficulty: 'medium', category: 'web', description: '', points: 100, hints: '' }
  challengeDialogError.value = ''
  challengeDialog.value = true
}

const openEditChallengeDialog = (challenge) => {
  editModeChallenge.value = true
  selectedChallengeId.value = challenge.id
  challengeForm.value = { 
    title: challenge.title, difficulty: challenge.difficulty || 'medium', category: challenge.category, 
    description: challenge.description, points: challenge.points, hints: challenge.hints || '' 
  }
  challengeDialogError.value = ''
  challengeDialog.value = true
}

const saveChallenge = async () => {
  try {
    formLoading.value = true
    challengeDialogError.value = ''
    const payload = {
      title: challengeForm.value.title,
      difficulty: challengeForm.value.difficulty,
      category: challengeForm.value.category,
      description: challengeForm.value.description,
      points: Number(challengeForm.value.points),
      hints: challengeForm.value.hints
    }
    if (editModeChallenge.value) {
      await api.put(`/events/${selectedEventId.value}/challenges/${selectedChallengeId.value}`, payload)
    } else {
      await api.post(`/events/${selectedEventId.value}/challenges`, payload)
    }
    await fetchChallenges()
    challengeDialog.value = false
  } catch (err) {
    challengeDialogError.value = err.response?.data?.error || 'Failed to save challenge.'
  } finally {
    formLoading.value = false
  }
}

const publishChallenge = async (cid) => {
  try {
    await api.post(`/events/${selectedEventId.value}/challenges/${cid}/publish`)
    await fetchChallenges()
  } catch (err) { }
}

const flagDialog = ref(false)
const flagDialogError = ref('')
const flagForm = ref({ flag: '' })

const openSetFlagDialog = (challenge) => {
  selectedChallengeId.value = challenge.id
  flagForm.value.flag = ''
  flagDialogError.value = ''
  flagDialog.value = true
}

const saveFlag = async () => {
  try {
    formLoading.value = true
    flagDialogError.value = ''
    await api.post(`/events/${selectedEventId.value}/challenges/${selectedChallengeId.value}/flag`, { flag: flagForm.value.flag })
    flagDialog.value = false
  } catch (err) {
    flagDialogError.value = 'Failed to set flag.'
  } finally {
    formLoading.value = false
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
.hacker-text { text-shadow: 0 0 10px rgba(255, 23, 68, 0.4); letter-spacing: 1px; }
.glass-panel {
  background: rgba(18, 24, 38, 0.8) !important; backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 23, 68, 0.3) !important;
}
.table-custom { background: transparent !important; }
.table-custom th { font-weight: 900 !important; border-bottom: 2px solid #ff1744 !important; }
.table-custom td { border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important; }
</style>
