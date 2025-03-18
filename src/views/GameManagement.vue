<template>
    <div class="game-management">
        <h1>Game Management</h1>

        <!-- Game Form Section -->
        <div class="form-section">
            <div class="section-header">
                <button class="btn-new-game" @click="resetForm">+ New Game</button>
            </div>
            <h2>{{ isEditing ? 'Edit Game' : 'Add New Game' }}</h2>
            <form @submit.prevent="submitGame">
                <div class="form-group">
                    <label for="name">Game Name (ID)</label>
                    <input
                        id="name"
                        v-model="gameForm.name"
                        type="text"
                        required
                        placeholder="Unique game identifier"
                    />
                </div>

                <div class="form-group">
                    <label for="title">Game Title</label>
                    <input id="title" v-model="gameForm.title" type="text" required placeholder="Display title" />
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea
                        id="description"
                        v-model="gameForm.description"
                        rows="4"
                        placeholder="Game description"
                    ></textarea>
                </div>

                <div class="form-group">
                    <label for="type">Game Type</label>
                    <select id="type" v-model="gameForm.type" required>
                        <option value="">Select a type</option>
                        <option value="arcade">Arcade</option>
                        <option value="puzzle">Puzzle</option>
                        <option value="strategy">Strategy</option>
                        <option value="action">Action</option>
                        <option value="sports">Sports</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="logoUrl">Logo URL</label>
                    <input id="logoUrl" v-model="gameForm.logoUrl" type="url" placeholder="URL to game logo" />
                </div>

                <div class="form-group">
                    <label for="bigLogoUrl">Big Logo URL</label>
                    <input
                        id="bigLogoUrl"
                        v-model="gameForm.bigLogoUrl"
                        type="url"
                        placeholder="URL to game big logo"
                    />
                </div>

                <div class="form-group">
                    <label for="url">Game URL</label>
                    <input id="url" v-model="gameForm.url" type="url" required placeholder="URL to play the game" />
                </div>

                <div class="form-group checkbox">
                    <input id="isFeatured" v-model="gameForm.isFeatured" type="checkbox" />
                    <label for="isFeatured">Featured Game</label>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" @click="resetForm">Cancel</button>
                    <button type="submit" class="btn-primary">{{ isEditing ? 'Update Game' : 'Add Game' }}</button>
                </div>
            </form>
        </div>

        <!-- Games List Section -->
        <div class="games-list-section">
            <h2>Your Games</h2>

            <div v-if="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>Loading games...</p>
            </div>

            <div v-else-if="error" class="error-message">
                {{ error }}
            </div>

            <div v-else-if="games.length === 0" class="no-games">You haven't added any games yet.</div>

            <div v-else class="games-grid">
                <div v-for="game in games" :key="game.id" class="game-card">
                    <img :src="game.logoUrl" :alt="game.title" class="game-logo" />
                    <div class="game-info">
                        <h3>{{ game.title }}</h3>
                        <p class="game-type">{{ game.type }}</p>
                        <p class="game-status" :class="game.status">{{ game.status }}</p>
                    </div>
                    <div class="game-actions">
                        <button class="btn-edit" @click="editGame(game)">Edit</button>
                        <button class="btn-delete" @click="confirmDelete(game.id)">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue';
    import api from '@/config/api';
    import type { Game } from '@/types';

    const API_URL = import.meta.env.VITE_GAME_URL;

    // State
    const games = ref<Game[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const isEditing = ref(false);
    const currentGameId = ref<number | null>(null);

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
    });

    // Fetch all games created by the current user
    const fetchUserGames = async () => {
        loading.value = true;
        error.value = null;

        try {
            // You might need to adjust this endpoint based on your API
            const response = await api.get(`${API_URL}/games`);
            games.value = response.data;
        } catch (err: any) {
            console.error('Error fetching games:', err);
            error.value = err.response?.data?.message || 'Failed to load games';
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
            type: game.category, // Assuming 'category' in your type maps to 'type' in the API
            logoUrl: game.logoUrl,
            bigLogoUrl: game.bigLogoUrl,
            url: game.url,
            isFeatured: game.isFeatured || false,
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
            if (isEditing.value && currentGameId.value) {
                // Update existing game
                await api.put(`${API_URL}/games/${currentGameId.value}`, gameForm);
            } else {
                // Create new game
                await api.post(`${API_URL}/games`, gameForm);
            }

            // Refresh the games list
            await fetchUserGames();
            resetForm();
        } catch (err: any) {
            console.error('Error saving game:', err);
            error.value = err.response?.data?.message || 'Failed to save game';
        } finally {
            loading.value = false;
        }
    };

    // Confirm and delete a game
    const confirmDelete = async (gameId: number) => {
        if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
            loading.value = true;
            error.value = null;

            try {
                await api.delete(`${API_URL}/games/${gameId}`);
                await fetchUserGames();
            } catch (err: any) {
                console.error('Error deleting game:', err);
                error.value = err.response?.data?.message || 'Failed to delete game';
            } finally {
                loading.value = false;
            }
        }
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
</style>
