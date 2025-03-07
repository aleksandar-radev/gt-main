<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

// Fetch games when component is mounted
onMounted(() => {
  if (gameStore.games.length === 0) {
    gameStore.fetchGames()
  }
})
</script>

<template>
  <div class="home-view">
    <h1>Games</h1>

    <!-- Loading state -->
    <div v-if="gameStore.loading" class="loading-state">Loading games...</div>

    <!-- Error state -->
    <div v-else-if="gameStore.error" class="error-message">
      {{ gameStore.error }}
    </div>

    <!-- Games grid -->
    <div v-else class="games-grid">
      <div v-for="game in gameStore.games" :key="game.id" class="game-card">
        <img
          :src="game.imageUrl || 'https://placehold.co/300x200'"
          :alt="game.title"
          class="game-image"
        />
        <div class="game-details">
          <h3>{{ game.title }}</h3>
          <p>{{ game.description }}</p>
          <div class="game-meta">
            <span class="game-category">{{ game.category }}</span>
            <span class="game-rating">Rating: {{ game.rating }}/5</span>
          </div>
          <router-link :to="`/game/${game.id}`" class="play-button"> Play Now </router-link>
        </div>
      </div>

      <!-- No games message -->
      <div v-if="gameStore.games.length === 0 && !gameStore.loading" class="no-games">
        No games available at the moment.
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.loading-state,
.error-message,
.no-games {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error-message {
  color: #e74c3c;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.game-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  background-color: #fff;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.game-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.game-details {
  padding: 1.5rem;
}

.game-details h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: #333;
}

.game-details p {
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #777;
}

.play-button {
  display: block;
  background-color: #3498db;
  color: white;
  text-align: center;
  padding: 0.75rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
}

.play-button:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}
</style>
