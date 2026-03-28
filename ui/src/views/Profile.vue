<template>
  <v-container class="py-10 profile-page" style="max-width: 800px;">
    <h1 class="text-h3 font-weight-black text-white mb-8 ctf-header">
      <v-icon size="36" color="primary" class="mr-2">mdi-account-circle</v-icon>Profile
    </h1>

    <v-row v-if="loading">
      <v-col class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
      </v-col>
    </v-row>

    <template v-else-if="profile">
      <!-- Profile Card -->
      <v-card class="glass-panel pa-8 mb-8" rounded="xl">
        <div class="d-flex align-center mb-6">
          <v-avatar size="72" color="primary" class="mr-6">
            <span class="text-h4 font-weight-black text-black">{{ profile.username?.charAt(0)?.toUpperCase() }}</span>
          </v-avatar>
          <div>
            <h2 class="text-h5 font-weight-bold text-white">{{ profile.username }}</h2>
            <div class="d-flex align-center gap-3 mt-1">
              <v-chip :color="profile.role === 'admin' ? 'error' : 'secondary'" size="small" variant="flat" class="font-weight-bold text-uppercase">
                {{ profile.role }}
              </v-chip>
              <span v-if="profile.email" class="text-caption text-grey">{{ profile.email }}</span>
            </div>
          </div>
        </div>

        <v-divider class="border-opacity-15 mb-6"></v-divider>

        <v-row>
          <v-col cols="6" sm="3">
            <div class="text-caption text-grey text-uppercase" style="letter-spacing: 2px;">Points</div>
            <div class="text-h5 font-weight-black text-primary mt-1">{{ profile.points ?? 0 }}</div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="text-caption text-grey text-uppercase" style="letter-spacing: 2px;">Role</div>
            <div class="text-h5 font-weight-black text-secondary mt-1 text-uppercase">{{ profile.role }}</div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="text-caption text-grey text-uppercase" style="letter-spacing: 2px;">Joined</div>
            <div class="text-body-1 font-weight-bold text-white mt-1">
              {{ profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A' }}
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="text-caption text-grey text-uppercase" style="letter-spacing: 2px;">Status</div>
            <v-chip :color="profile.banned ? 'error' : 'success'" size="small" variant="outlined" class="mt-1">
              {{ profile.banned ? 'BANNED' : 'ACTIVE' }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card>

      <!-- Edit Profile (only for own profile) -->
      <v-card v-if="isOwner" class="glass-panel pa-8 mb-8" rounded="xl">
        <h3 class="text-h6 font-weight-bold text-white mb-6">
          <v-icon class="mr-2" color="primary">mdi-pencil</v-icon>Edit Profile
        </h3>

        <v-alert v-if="editError" type="error" variant="tonal" class="mb-4">{{ editError }}</v-alert>

        <v-text-field 
          v-model="editForm.username" 
          label="Username" 
          variant="outlined" 
          color="primary"
          class="mb-4"
          :rules="[v => !v || v.length >= 3 || 'Min 3 characters']"
        ></v-text-field>
        <v-text-field 
          v-model="editForm.email" 
          label="Email" 
          variant="outlined" 
          color="primary"
          class="mb-4"
          :rules="[v => !v || /.+@.+\..+/.test(v) || 'Invalid email']"
        ></v-text-field>

        <v-btn color="primary" variant="elevated" @click="updateProfile" :loading="editLoading" class="font-weight-bold">
          Save Changes
        </v-btn>
      </v-card>

      <!-- Change Password (only for own profile) -->
      <v-card v-if="isOwner" class="glass-panel pa-8" rounded="xl">
        <h3 class="text-h6 font-weight-bold text-white mb-6">
          <v-icon class="mr-2" color="warning">mdi-lock-reset</v-icon>Change Password
        </h3>

        <v-alert v-if="passError" type="error" variant="tonal" class="mb-4">{{ passError }}</v-alert>

        <v-text-field 
          v-model="passForm.current_password" 
          label="Current Password" 
          type="password"
          variant="outlined" 
          color="primary"
          class="mb-4"
        ></v-text-field>
        <v-text-field 
          v-model="passForm.new_password" 
          label="New Password" 
          type="password"
          variant="outlined" 
          color="primary"
          class="mb-4"
          :rules="[v => v.length >= 6 || 'Min 6 characters']"
        ></v-text-field>

        <v-btn color="warning" variant="elevated" @click="changePassword" :loading="passLoading" class="font-weight-bold">
          Update Password
        </v-btn>
      </v-card>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useNotify } from '@/composables/useNotify'
import { api } from '@/api'
import { useRoute } from 'vue-router'

const { userId } = useAuth()
const notify = useNotify()
const route = useRoute()

// If an ID is passed in the query (e.g. /profile?id=xxx), view that profile; else view own.
const targetUserId = computed(() => route.query.id || userId.value)
const isOwner = computed(() => targetUserId.value === userId.value)

const profile = ref(null)
const loading = ref(true)

const editForm = ref({ username: '', email: '' })
const editError = ref('')
const editLoading = ref(false)

const passForm = ref({ current_password: '', new_password: '' })
const passError = ref('')
const passLoading = ref(false)

const fetchProfile = async () => {
  try {
    loading.value = true
    profile.value = null
    const res = await api.get(`/users/${targetUserId.value}`)
    profile.value = res.data
    editForm.value.username = res.data.username || ''
    editForm.value.email = res.data.email || ''
  } catch {
    notify.error('Failed to load profile.')
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  editError.value = ''
  editLoading.value = true
  try {
    const payload = {}
    if (editForm.value.username && editForm.value.username !== profile.value.username) {
      payload.username = editForm.value.username
    }
    if (editForm.value.email && editForm.value.email !== profile.value.email) {
      payload.email = editForm.value.email
    }
    if (Object.keys(payload).length === 0) {
      notify.info('No changes to save.')
      editLoading.value = false
      return
    }
    await api.post(`/users/${userId.value}/update`, payload)
    notify.success('Profile updated successfully!')
    await fetchProfile()
  } catch (err) {
    editError.value = err.response?.data?.error || 'Failed to update profile.'
  } finally {
    editLoading.value = false
  }
}

const changePassword = async () => {
  passError.value = ''
  if (!passForm.value.current_password || !passForm.value.new_password) {
    passError.value = 'Both fields are required.'
    return
  }
  if (passForm.value.new_password.length < 6) {
    passError.value = 'New password must be at least 6 characters.'
    return
  }
  passLoading.value = true
  try {
    await api.post(`/users/${userId.value}/password`, {
      current_password: passForm.value.current_password,
      new_password: passForm.value.new_password
    })
    notify.success('Password changed successfully!')
    passForm.value = { current_password: '', new_password: '' }
  } catch (err) {
    passError.value = err.response?.data?.error || 'Failed to change password.'
  } finally {
    passLoading.value = false
  }
}

// Re-fetch when navigating to a different user's profile
watch(() => route.query.id, () => {
  fetchProfile()
})

onMounted(fetchProfile)
</script>

<style scoped>
.profile-page { min-height: 100vh; }

.ctf-header {
  text-shadow: 0 0 12px rgba(24, 255, 255, 0.2);
  letter-spacing: 1px;
}

.glass-panel {
  background: rgba(18, 24, 38, 0.6) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(24, 255, 255, 0.15) !important;
}
</style>
