<template>
    <div class="game-list">
        <h1>{{ t('gamelist.featured') }}</h1>

        <!-- Loading state -->
        <div v-if="gameStore.loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>{{ t('gamelist.loading') }}</p>
        </div>

        <!-- Error state -->
        <div v-else-if="gameStore.error" class="error-message">
            {{ gameStore.error }}
        </div>

        <!-- Games carousel -->
        <div v-else class="carousel-wrapper">
            <button class="nav prev" @click="scrollLeft">&#8249;</button>
            <div ref="carousel" class="carousel">
                <div
                    v-for="game in activeGames"
                    :key="game.id"
                    class="game-card"
                    @click="navigateToGameDetail(game.id)"
                >
                    <img :src="game.logoUrl" :alt="game.title" class="game-image" />
                    <div class="game-content">
                        <h3>{{ game.title }}</h3>
                        <p>{{ game.description }}</p>
                    </div>
                </div>
            </div>
            <button class="nav next" @click="scrollRight">&#8250;</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, computed, ref } from 'vue';
    import { useGameStore } from '@/stores/gameStore';
    import { useRouter } from 'vue-router';
    import { useI18n } from '@/plugins/i18n';

    const gameStore = useGameStore();
    const router = useRouter();
    const { t } = useI18n();

    const activeGames = computed(() => gameStore.games.filter((g) => g.status === 'active'));
    const carousel = ref<HTMLDivElement | null>(null);

    const scrollRight = () => {
        if (carousel.value) {
            carousel.value.scrollBy({ left: carousel.value.clientWidth, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (carousel.value) {
            carousel.value.scrollBy({ left: -carousel.value.clientWidth, behavior: 'smooth' });
        }
    };

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

    .carousel-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .carousel {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        gap: 1rem;
        padding: 1rem 0;
    }

    .carousel::-webkit-scrollbar {
        display: none;
    }

    .nav {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #3498db;
    }

    .nav:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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
        flex: 0 0 280px;
        scroll-snap-align: start;
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
