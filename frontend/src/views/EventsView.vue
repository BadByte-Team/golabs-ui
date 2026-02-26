<template>
  <div class="events-view">
    <div class="view-header">
      <h1 class="view-title text-primary">ACTIVE_OPERATIONS</h1>
      <p class="text-muted">Current and future combat simulations.</p>
    </div>

    <!-- Filters & Search -->
    <div class="action-bar mb-4">
      <div class="filters">
        <button 
          v-for="filter in ['All', 'Active', 'Upcoming', 'Finished']"
          :key="filter"
          class="filter-btn"
          :class="{ active: currentFilter === filter }"
          @click="currentFilter = filter"
        >
          [{{ filter }}]
        </button>
      </div>
      <div class="search-box">
        <CyberInput 
          v-model="searchQuery"
          placeholder="Search operations..."
          type="text"
        />
      </div>
    </div>

    <!-- Events Grid -->
    <div class="events-grid">
      <EventCard 
        v-for="event in filteredEvents" 
        :key="event.id" 
        :event="event" 
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredEvents.length === 0" class="empty-state text-center mt-4">
      <p class="text-muted">NO_OPERATIONS_FOUND</p>
      <CyberButton variant="ghost" @click="searchQuery = ''; currentFilter = 'All'">
        RESET_PARAMETERS
      </CyberButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EventCard from '../components/EventCard.vue'
import CyberInput from '../components/ui/CyberInput.vue'
import CyberButton from '../components/ui/CyberButton.vue'

const currentFilter = ref('All')
const searchQuery = ref('')

// Mock Data
const events = ref([
  {
    id: 1,
    name: 'HackThePlanet 2026',
    description: 'Global 48-hour competition featuring Web, Pwn, and Reverse Engineering. Top 10 teams qualify for the finals.',
    status: 'Active',
    startDate: '2026-03-01 00:00 UTC',
    endDate: '2026-03-03 00:00 UTC',
    teamsCount: 1420,
    challengesCount: 35
  },
  {
    id: 2,
    name: 'NeoTokyo Qualifiers',
    description: 'Regional qualifiers for the APAC championship. High-difficulty crypto and forensics.',
    status: 'Upcoming',
    startDate: '2026-04-15 12:00 UTC',
    endDate: '2026-04-17 12:00 UTC',
    teamsCount: 850,
    challengesCount: 20
  },
  {
    id: 3,
    name: 'Winter Bootcamp CTF',
    description: 'Beginner-friendly CTF aimed at new operatives. Fundamentals of web exploitation and basic scripting.',
    status: 'Finished',
    startDate: '2025-12-10 00:00 UTC',
    endDate: '2025-12-15 00:00 UTC',
    teamsCount: 3200,
    challengesCount: 15
  }
])

const filteredEvents = computed(() => {
  return events.value.filter(e => {
    const matchesFilter = currentFilter.value === 'All' || e.status === currentFilter.value
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesFilter && matchesSearch
  })
})
</script>

<style scoped>
.events-view {
  animation: fadeIn 0.5s ease;
}

.view-header {
  margin-bottom: 2rem;
}

.view-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  background: transparent;
  border: 1px solid var(--panel-border);
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.filter-btn:hover {
  color: var(--primary);
  border-color: rgba(102, 252, 241, 0.5);
  background: rgba(102, 252, 241, 0.05);
}

.filter-btn.active {
  color: var(--primary);
  border-color: var(--primary);
  background: rgba(102, 252, 241, 0.1);
}

.search-box {
  min-width: 300px;
}
/* override input margin specifically for action bar inline use */
.search-box > div { margin-bottom: 0; }

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.mb-4 { margin-bottom: 2rem; }
.mt-4 { margin-top: 2rem; }
.text-center { text-align: center; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-box { min-width: 100%; }
}
</style>
