<template>
    <div class="game-management">
        <h1>{{ t('gamemanagement.title') }}</h1>

        <!-- Game Form Section -->
        <div class="form-section">
            <div class="section-header">
                <button class="btn-new-game" @click="resetForm">{{ t('gamemanagement.newGame') }}</button>
            </div>
            <h2>{{ isEditing ? t('gamemanagement.editHeading') : t('gamemanagement.addHeading') }}</h2>
            <form @submit.prevent="submitGame">
                <div class="form-group">
                    <label for="name">{{ t('gamemanagement.name') }}</label>
                    <input
                        id="name"
                        v-model="gameForm.name"
                        type="text"
                        required
                        :placeholder="t('gamemanagement.name')"
                    />
                </div>

                <div class="form-group">
                    <label for="title">{{ t('gamemanagement.titleField') }}</label>
                    <input id="title" v-model="gameForm.title" type="text" required placeholder="Display title" />
                </div>

                <div class="form-group">
                    <label for="description">{{ t('gamemanagement.description') }}</label>
                    <textarea
                        id="description"
                        v-model="gameForm.description"
                        rows="4"
                        :placeholder="t('gamemanagement.description')"
                    ></textarea>
                </div>

                <div class="form-group">
                    <label for="type">{{ t('gamemanagement.type') }}</label>
                    <select id="type" v-model="gameForm.type" required>
                        <option value="">{{ t('gamemanagement.selectType') }}</option>
                        <option value="arcade">Arcade</option>
                        <option value="puzzle">Puzzle</option>
                        <option value="strategy">Strategy</option>
                        <option value="action">Action</option>
                        <option value="sports">Sports</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="logoUrl">{{ t('gamemanagement.logo') }}</label>
                    <input id="logoUrl" v-model="gameForm.logoUrl" type="url" placeholder="URL to game logo" />
                </div>

                <div class="form-group">
                    <label for="bigLogoUrl">{{ t('gamemanagement.bigLogo') }}</label>
                    <input
                        id="bigLogoUrl"
                        v-model="gameForm.bigLogoUrl"
                        type="url"
                        placeholder="URL to game big logo"
                    />
                </div>

                <div class="form-group">
                    <label for="url">{{ t('gamemanagement.url') }}</label>
                    <input id="url" v-model="gameForm.url" type="url" required placeholder="URL to play the game" />
                </div>

                <div class="form-group checkbox">
                    <input id="isFeatured" v-model="gameForm.isFeatured" type="checkbox" />
                    <label for="isFeatured">{{ t('gamemanagement.featured') }}</label>
                </div>

                <div class="form-group checkbox">
                    <input id="status" v-model="gameForm.status" type="checkbox" />
                    <label for="status">{{ t('gamemanagement.active') }}</label>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" @click="resetForm">
                        {{ t('gamemanagement.cancel') }}
                    </button>
                    <button type="submit" class="btn-primary">
                        {{ isEditing ? t('gamemanagement.update') : t('gamemanagement.add') }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Games List Section -->
        <div class="games-list-section">
            <h2>{{ t('gamemanagement.yourGames') }}</h2>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

            <div v-if="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>{{ t('gamemanagement.loading') }}</p>
            </div>

            <div v-else-if="error" class="error-message">
                {{ error }}
            </div>

            <div v-else-if="games.length === 0" class="no-games">{{ t('gamemanagement.noGames') }}</div>

            <div v-else class="games-grid">
                <div v-for="game in paginatedGames" :key="game.id" class="game-card">
                    <img :src="game.logoUrl" :alt="game.title" class="game-logo" />
                    <div class="game-info">
                        <h3>{{ game.title }}</h3>
                        <p class="game-type">{{ game.type }}</p>
                        <p class="game-status" :class="game.status">{{ game.status }}</p>
                    </div>
                    <div class="game-actions">
                        <button class="btn-edit" @click="editGame(game)">{{ t('gamemanagement.edit') }}</button>
                        <button class="btn-delete" @click="confirmDelete(game.id)">
                            {{ t('gamemanagement.delete') }}
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="totalPages > 1" class="pagination">
                <button :disabled="currentPage === 1" @click="prevPage">{{ t('pagination.prev') }}</button>
                <span>{{ currentPage }} / {{ totalPages }}</span>
                <button :disabled="currentPage === totalPages" @click="nextPage">{{ t('pagination.next') }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted, computed } from 'vue';
    import type { Game } from '@/types';
    import { useGameStore } from '@/stores/gameStore';
    import { useI18n } from '@/plugins/i18n';

    const gameStore = useGameStore();
    const { t } = useI18n();

    const games = ref<Game[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const successMessage = ref<string | null>(null);
    const isEditing = ref(false);
    const currentGameId = ref<number | null>(null);
    const currentPage = ref(1);
    const gamesPerPage = 6;

    const totalPages = computed(() => Math.ceil(games.value.length / gamesPerPage));
    const paginatedGames = computed(() => {
        const start = (currentPage.value - 1) * gamesPerPage;
        return games.value.slice(start, start + gamesPerPage);
    });

    // Form state
    const gameForm = reactive({
        name: '',
        title: '',
        description: '',
        type: '',
        logoUrl: '',
        bigLogoUrl: '',
        url: '',
        isFeatured: false,
        status: 'active',
    });

    // Fetch all games created by the current user
    const fetchUserGames = async () => {
        loading.value = true;
        error.value = null;

        try {
            await gameStore.fetchGames();
            games.value = gameStore.games;
            currentPage.value = 1;
        } catch (err: any) {
            console.error('Error fetching games:', err);
            error.value = err.response?.data?.message || t('gamemanagement.fetchError');
        } finally {
            loading.value = false;
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        Object.assign(gameForm, {
            name: '',
            title: '',
            description: '',
            type: '',
            logoUrl: '',
            bigLogoUrl: '',
            url: '',
            isFeatured: false,
            status: 'active',
        });
        isEditing.value = false;
        currentGameId.value = null;
    };

    // Load game data into form for editing
    const editGame = (game: Game) => {
        Object.assign(gameForm, {
            name: game.name,
            title: game.title,
            description: game.description,
            type: game.type,
            logoUrl: game.logoUrl,
            bigLogoUrl: game.bigLogoUrl,
            url: game.url,
            isFeatured: game.isFeatured || false,
            status: game.status,
        });

        isEditing.value = true;
        currentGameId.value = game.id;

        // Scroll to form
        document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Submit form to create or update a game
    const submitGame = async () => {
        loading.value = true;
        error.value = null;

        try {
            const payload = {
                ...gameForm,
                status: gameForm.status,
            };

            if (isEditing.value && currentGameId.value) {
                await gameStore.updateGame(currentGameId.value, payload);
            } else {
                await gameStore.createGame(payload);
            }

            await fetchUserGames();
            resetForm();
            successMessage.value = t('gamemanagement.saveSuccess');
            setTimeout(() => (successMessage.value = null), 3000);
        } catch (err: any) {
            console.error('Error saving game:', err);
            error.value = err.response?.data?.message || t('gamemanagement.error');
        } finally {
            loading.value = false;
        }
    };

    // Confirm and delete a game
    const confirmDelete = async (gameId: number) => {
        if (confirm(t('gamemanagement.deleteConfirm'))) {
            loading.value = true;
            error.value = null;

            try {
                await gameStore.deleteGame(gameId);
                await fetchUserGames();
                successMessage.value = t('gamemanagement.deleteSuccess');
                setTimeout(() => (successMessage.value = null), 3000);
            } catch (err: any) {
                console.error('Error deleting game:', err);
                error.value = err.response?.data?.message || t('gamemanagement.error');
            } finally {
                loading.value = false;
            }
        }
    };

    const nextPage = () => {
        if (currentPage.value < totalPages.value) currentPage.value += 1;
    };

    const prevPage = () => {
        if (currentPage.value > 1) currentPage.value -= 1;
    };

    // Load games when component mounts
    onMounted(() => {
        fetchUserGames();
    });
</script>

<style scoped>
    .game-management {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        margin-bottom: 2rem;
        color: #2c3e50;
    }

    h2 {
        margin-bottom: 1.5rem;
        color: #34495e;
    }

    .form-section {
        background-color: white;
        border-radius: 8px;
        padding: 2rem;
        margin-bottom: 3rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #2c3e50;
    }

    .form-group input[type='text'],
    .form-group input[type='url'],
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        border-color: #3498db;
        outline: none;
    }

    .form-group.checkbox {
        display: flex;
        align-items: center;
    }

    .form-group.checkbox input {
        margin-right: 0.5rem;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
    }

    .btn-primary,
    .btn-secondary,
    .btn-edit,
    .btn-delete {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition:
            background-color 0.2s,
            transform 0.1s;
    }

    .btn-primary {
        background-color: #3498db;
        color: white;
    }

    .btn-primary:hover {
        background-color: #2980b9;
    }

    .btn-secondary {
        background-color: #ecf0f1;
        color: #2c3e50;
    }

    .btn-secondary:hover {
        background-color: #bdc3c7;
    }

    .games-list-section {
        background-color: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .games-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .game-card {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
    }

    .game-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .game-logo {
        width: 100%;
        height: 150px;
        object-fit: cover;
    }

    .game-info {
        padding: 1rem;
    }

    .game-info h3 {
        margin: 0 0 0.5rem;
        color: #2c3e50;
    }

    .game-type {
        color: #7f8c8d;
        font-size: 0.9rem;
        margin: 0;
    }

    .game-status {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        margin-top: 0.5rem;
    }

    .game-status.active {
        background-color: #2ecc71;
        color: white;
    }

    .game-status.deleted {
        background-color: #e74c3c;
        color: white;
    }

    .game-actions {
        display: flex;
        padding: 1rem;
        border-top: 1px solid #eee;
        gap: 0.5rem;
    }

    .btn-edit,
    .btn-delete {
        flex: 1;
        padding: 0.5rem;
        font-size: 0.9rem;
    }

    .btn-edit {
        background-color: #3498db;
        color: white;
    }

    .btn-edit:hover {
        background-color: #2980b9;
    }

    .btn-delete {
        background-color: #e74c3c;
        color: white;
    }

    .btn-delete:hover {
        background-color: #c0392b;
    }

    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    .error-message {
        padding: 1rem;
        background-color: #ffeaea;
        color: #e74c3c;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .no-games {
        text-align: center;
        padding: 2rem;
        color: #7f8c8d;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 768px) {
        .games-grid {
            grid-template-columns: 1fr;
        }

        .form-actions {
            flex-direction: column;
            gap: 0.5rem;
        }

        .form-actions button {
            width: 100%;
        }

        .game-management {
            padding: 1rem;
        }
    }

    /* Additional responsive adjustments */
    @media (max-width: 480px) {
        .form-section,
        .games-list-section {
            padding: 1rem;
        }

        h1 {
            font-size: 1.5rem;
        }

        h2 {
            font-size: 1.2rem;
        }
    }

    /* Status indicators */
    .game-status.pending {
        background-color: #f39c12;
        color: white;
    }

    .game-status.inactive {
        background-color: #95a5a6;
        color: white;
    }

    /* Form validation styles */
    .form-group input:invalid,
    .form-group textarea:invalid,
    .form-group select:invalid {
        border-color: #e74c3c;
    }

    /* Hover effects for buttons */
    .btn-primary:active,
    .btn-secondary:active,
    .btn-edit:active,
    .btn-delete:active {
        transform: scale(0.98);
    }
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .btn-new-game {
        background-color: #2ecc71;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.6rem 1rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition:
            background-color 0.2s,
            transform 0.1s;
    }

    .btn-new-game:hover {
        background-color: #27ae60;
    }

    .btn-new-game:active {
        transform: scale(0.98);
    }

    .success-message {
        padding: 1rem;
        background-color: #e8f8f0;
        color: #2ecc71;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .pagination button {
        border: none;
        background-color: #3498db;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .pagination button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .pagination button:hover:not([disabled]) {
        background-color: #2980b9;
    }
</style>
