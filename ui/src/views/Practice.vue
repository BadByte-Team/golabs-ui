<template>
  <v-container class="py-10 practice-page">
    <h1 class="text-h3 font-weight-black text-white mb-2 ctf-header">
      <v-icon size="36" color="warning" class="mr-2">mdi-school</v-icon>Practice Arena
    </h1>
    <p class="text-grey-lighten-1 mb-8">Sharpen your skills with challenges from past events.</p>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64" width="5"></v-progress-circular>
    </div>

    <template v-else>
      <!-- Event Selector -->
      <v-select
        v-model="selectedEventId"
        :items="finishedEvents"
        item-title="name"
        item-value="id"
        label="Select a past event"
        variant="outlined"
        color="warning"
        class="mb-6"
        prepend-inner-icon="mdi-calendar-check"
        @update:model-value="fetchChallenges"
      ></v-select>

      <v-card v-if="!selectedEventId" class="glass-panel pa-10 text-center" rounded="xl" style="border-style: dashed !important;">
        <v-icon size="64" color="grey-darken-2" class="mb-4">mdi-puzzle-outline</v-icon>
        <h3 class="text-h6 text-grey-lighten-1">Select a past event to browse its challenges</h3>
      </v-card>

      <!-- Challenges -->
      <template v-if="selectedEventId">
        <!-- Category Filter -->
        <div class="d-flex gap-2 mb-6 flex-wrap" v-if="categories.length > 0">
          <v-chip 
            v-for="cat in categories" :key="cat"
            :color="activeCat === cat ? 'warning' : 'grey'" 
            :variant="activeCat === cat ? 'flat' : 'outlined'"
            class="font-weight-bold text-uppercase"
            size="small"
            @click="activeCat = activeCat === cat ? '' : cat"
          >
            {{ cat }}
          </v-chip>
        </div>

        <v-row v-if="loadingChallenges">
          <v-col cols="12" class="text-center py-8">
            <v-progress-circular indeterminate color="warning" size="36"></v-progress-circular>
          </v-col>
        </v-row>

        <v-row v-else-if="filteredChallenges.length === 0">
          <v-col cols="12">
            <v-card class="glass-panel pa-10 text-center" rounded="xl" style="border-style: dashed !important;">
              <v-icon size="48" color="grey" class="mb-3">mdi-puzzle-outline</v-icon>
              <p class="text-grey">No challenges available for this event.</p>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col v-for="ch in filteredChallenges" :key="ch.id" cols="12" sm="6" lg="4">
            <v-card 
              class="glass-panel challenge-card" 
              rounded="xl"
              @click="openChallenge(ch)"
              hover
            >
              <v-card-title class="d-flex justify-space-between align-center px-5 pt-5 pb-1">
                <span class="text-body-1 font-weight-bold text-truncate" style="max-width: 70%;">{{ ch.title }}</span>
                <span class="text-warning font-weight-black">{{ ch.points }} pts</span>
              </v-card-title>
              <v-card-text class="px-5 pb-5">
                <div class="d-flex gap-2 mb-3">
                  <v-chip :color="getDiffColor(ch.difficulty)" size="x-small" variant="flat" class="font-weight-bold text-uppercase">{{ ch.difficulty }}</v-chip>
                  <v-chip color="grey" size="x-small" variant="outlined" class="text-uppercase">{{ ch.category }}</v-chip>
                </div>
                <p class="text-body-2 text-grey-lighten-1 description-text">{{ ch.description }}</p>
                <div class="d-flex justify-space-between align-center mt-3 text-caption text-grey">
                  <span><v-icon size="small" class="mr-1">mdi-check-decagram</v-icon>{{ ch.solve_count }} solves</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </template>

    <!-- Challenge Detail Dialog (Read-Only) -->
    <v-dialog v-model="challengeDialog" max-width="600">
      <v-card class="glass-panel" border="warning" rounded="xl" v-if="selectedChallenge">
        <v-card-title class="d-flex justify-space-between align-center px-6 pt-6">
          <span class="text-h6 font-weight-bold">{{ selectedChallenge.title }}</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="challengeDialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="px-6">
          <div class="d-flex gap-2 mb-4">
            <v-chip :color="getDiffColor(selectedChallenge.difficulty)" size="small" variant="flat" class="font-weight-bold text-uppercase">{{ selectedChallenge.difficulty }}</v-chip>
            <v-chip color="grey" size="small" variant="outlined" class="text-uppercase">{{ selectedChallenge.category }}</v-chip>
            <v-chip color="warning" size="small" variant="outlined">{{ selectedChallenge.points }} pts</v-chip>
          </div>

          <p class="text-body-1 text-grey-lighten-1 mb-6" style="white-space: pre-wrap;">{{ selectedChallenge.description }}</p>

          <v-text-field
            v-if="selectedChallenge.file_url"
            :model-value="selectedChallenge.file_url"
            label="File URL"
            variant="outlined"
            readonly
            append-inner-icon="mdi-open-in-new"
            class="mb-4"
          ></v-text-field>

          <v-divider class="mb-4 border-opacity-25"></v-divider>

          <v-alert type="info" variant="tonal" class="mb-0" icon="mdi-school">
            <span class="font-weight-bold">Practice Mode</span>
            <span class="text-caption ml-2">This challenge is from a past event. Flag submission is disabled.</span>
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'

const loading = ref(true)
const loadingChallenges = ref(false)
const finishedEvents = ref([])
const selectedEventId = ref(null)
const challenges = ref([])
const activeCat = ref('')

// Challenge dialog
const challengeDialog = ref(false)
const selectedChallenge = ref(null)

const categories = computed(() => [...new Set(challenges.value.map(c => c.category))])
const filteredChallenges = computed(() => {
  if (!activeCat.value) return challenges.value
  return challenges.value.filter(c => c.category === activeCat.value)
})

const getDiffColor = (diff) => {
  switch (diff?.toLowerCase()) {
    case 'easy': return 'success'
    case 'medium': return 'warning'
    case 'hard': return 'error'
    default: return 'grey'
  }
}

const fetchFinishedEvents = async () => {
  try {
    const res = await api.get('/events')
    const all = res.data.data || res.data || []
    finishedEvents.value = all.filter(e => e.status === 'finished')
  } catch {
    finishedEvents.value = []
  } finally {
    loading.value = false
  }
}

const fetchChallenges = async () => {
  if (!selectedEventId.value) return
  loadingChallenges.value = true
  activeCat.value = ''
  try {
    const res = await api.get(`/events/${selectedEventId.value}/challenges`)
    challenges.value = res.data.data || res.data || []
  } catch {
    challenges.value = []
  } finally {
    loadingChallenges.value = false
  }
}

const openChallenge = (ch) => {
  selectedChallenge.value = ch
  challengeDialog.value = true
}

onMounted(fetchFinishedEvents)
</script>

<style scoped>
.practice-page { min-height: 100vh; }

.ctf-header {
  text-shadow: 0 0 12px rgba(255, 152, 0, 0.2);
  letter-spacing: 1px;
}

.glass-panel {
  background: rgba(10, 16, 26, 0.6) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 152, 0, 0.15) !important;
}

.challenge-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.challenge-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.12) !important;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.8rem;
}
</style>
