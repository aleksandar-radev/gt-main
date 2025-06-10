<template>
    <div class="game-list">
        <h1>Featured Games</h1>

        <!-- Loading state -->
        <div v-if="gameStore.loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading games...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="gameStore.error" class="error-message">
            {{ gameStore.error }}
        </div>

        <!-- Games grid -->
        <div v-else class="games-grid">
            <div v-for="game in activeGames" :key="game.id" class="game-card" @click="navigateToGameDetail(game.id)">
                <img :src="game.logoUrl" :alt="game.title" class="game-image" />
                <div class="game-content">
                    <h3>{{ game.title }}</h3>
                    <p>{{ game.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, computed } from 'vue';
    import { useGameStore } from '@/stores/gameStore';
    import { useRouter } from 'vue-router';

    const gameStore = useGameStore();
    const router = useRouter();

    const activeGames = computed(() => gameStore.games.filter((g) => g.status === 'active'));

    // Ensure games are loaded when component is mounted
    onMounted(() => {
        console.log('GameList mounted, games count:', gameStore.games.length);
        if (gameStore.games.length === 0) {
            console.log('Fetching games from GameList component');
            gameStore.fetchGames();
        }
    });

    const navigateToGameDetail = (gameId: number) => {
        router.push({ name: 'gameDetail', params: { id: gameId.toString() } });
    };
</script>

<style scoped>
    h1 {
        color: rgb(219, 207, 207);
    }
    .game-list {
        padding: 2rem 0;
    }

    .games-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        padding: 2rem 0;
    }

    .game-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition:
            transform 0.2s,
            box-shadow 0.2s;
        cursor: pointer;
    }

    .game-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .game-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .game-content {
        padding: 1rem;
    }

    .game-card h3 {
        margin: 0 0 0.5rem 0;
    }

    .game-card p {
        color: #666;
        margin-bottom: 0.5rem;
        /* Display only 3 lines of text for description */
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    /* Loading state */
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    .error-message {
        text-align: center;
        color: #e74c3c;
        padding: 2rem;
        background-color: #ffeaea;
        border-radius: 8px;
        margin: 2rem 0;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
