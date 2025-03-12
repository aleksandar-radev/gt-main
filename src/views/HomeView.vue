<template>
    <div class="home-view">
        <h1>Welcome :)</h1>
        <h3>for any questions, either use the email below, or the feedback form.</h3>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import { useGameStore } from '@/stores/gameStore';

    const gameStore = useGameStore();

    // Fetch games when component is mounted
    onMounted(() => {
        if (gameStore.games.length === 0) {
            gameStore.fetchGames();
        }
    });
</script>

<style scoped>
    .home-view {
        width: 100%;
    }

    h1 {
        margin-bottom: 2rem;
        text-align: center;
        color: #d8d7d7;
    }

    h3 {
        margin-bottom: 2rem;
        text-align: center;
        color: #d8d7d7;
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
