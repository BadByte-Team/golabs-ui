<template>
  <div class="training-view">
    <div class="view-header">
      <h1 class="view-title text-secondary">TRAINING_GROUNDS</h1>
      <p class="text-muted">Sharpen your skills against isolated targets.</p>
    </div>

    <!-- Filters -->
    <div class="action-bar mb-4">
      <div class="category-filters">
        <button 
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: currentCategory === cat }"
          @click="currentCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
      <div class="difficulty-filters">
        <select v-model="currentDifficulty" class="cyber-select">
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Insane">Insane</option>
        </select>
      </div>
    </div>

    <!-- Challenges Grid -->
    <div class="challenges-grid">
      <ChallengeCard 
        v-for="chal in filteredChallenges" 
        :key="chal.id" 
        :challenge="chal" 
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredChallenges.length === 0" class="empty-state text-center mt-4">
      <p class="text-muted">NO_TARGETS_ACQUIRED</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ChallengeCard from '../components/ChallengeCard.vue'

const categories = ['All', 'Web', 'Crypto', 'Forensics', 'Pwn', 'Rev']
const currentCategory = ref('All')
const currentDifficulty = ref('All')

// Mock Data
const challenges = ref([
  { id: 1, name: 'SQLi Basics', category: 'Web', difficulty: 'Easy', points: 50, solves: 4200, solved: true },
  { id: 2, name: 'RSA Baby', category: 'Crypto', difficulty: 'Easy', points: 50, solves: 3100, solved: false },
  { id: 3, name: 'Hidden in Plain Sight', category: 'Forensics', difficulty: 'Medium', points: 150, solves: 850, solved: false },
  { id: 4, name: 'Buffer Overflow 101', category: 'Pwn', difficulty: 'Medium', points: 200, solves: 540, solved: false },
  { id: 5, name: 'Obfuscated Mess', category: 'Rev', difficulty: 'Hard', points: 300, solves: 120, solved: false },
  { id: 6, name: 'Blind RCE', category: 'Web', difficulty: 'Insane', points: 500, solves: 12, solved: false },
  { id: 7, name: 'XOR Wizardry', category: 'Crypto', difficulty: 'Medium', points: 100, solves: 2100, solved: true },
  { id: 8, name: 'Heap Feng Shui', category: 'Pwn', difficulty: 'Hard', points: 400, solves: 45, solved: false },
])

const filteredChallenges = computed(() => {
  return challenges.value.filter(c => {
    const matchCat = currentCategory.value === 'All' || c.category === currentCategory.value
    const matchDiff = currentDifficulty.value === 'All' || c.difficulty === currentDifficulty.value
    return matchCat && matchDiff
  })
})
</script>

<style scoped>
.training-view {
  animation: fadeIn 0.5s ease;
}

.view-header {
  margin-bottom: 2rem;
}

.view-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: var(--secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
}


.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  background: var(--panel-bg);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--panel-border);
}

.category-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cat-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.cat-btn:hover {
  color: var(--secondary);
}

.cat-btn.active {
  color: var(--bg-color);
  background: var(--secondary);
}

.cyber-select {
  background: rgba(11, 12, 16, 0.8);
  border: 1px solid var(--panel-border);
  color: var(--text-main);
  padding: 0.6rem 2rem 0.6rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s;
  outline: none;
}

.cyber-select:focus {
  border-color: var(--secondary);
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.mb-4 { margin-bottom: 2rem; }
.mt-4 { margin-top: 2rem; }
.text-center { text-align: center; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
