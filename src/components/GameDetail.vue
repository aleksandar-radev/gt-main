<template>
    <div v-if="gameStore.loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading game details...</p>
    </div>

    <div v-else-if="!game" class="error-message">Game not found.</div>

    <div v-else class="game-detail-container">
        <button class="back-button" @click="goBack">← Back to Games</button>

        <div class="game-detail">
            <div class="game-info">
                <img :src="game.imageUrl" :alt="game.title" class="game-image" />
                <h1>{{ game.title }}</h1>
                <p class="game-description">{{ game.description }}</p>

                <!-- Play Now button -->
                <button class="play-button" @click="playGame">Play Now</button>

                <div class="game-meta">
                    <span class="game-id">Game ID: {{ game.id }}</span>
                </div>
            </div>

            <div class="comments-section">
                <h2>Comments</h2>

                <div v-if="gameStore.commentsLoading[gameId]" class="comments-loading">
                    <div class="loading-spinner small"></div>
                    <p>Loading comments...</p>
                </div>

                <div v-else-if="gameStore.commentsError[gameId]" class="comments-error">
                    {{ gameStore.commentsError[gameId] }}
                </div>

                <div v-else-if="!game.comments || game.comments.length === 0" class="no-comments">
                    No comments yet. Be the first to comment!
                </div>

                <div v-else class="comments-list">
                    <div v-for="comment in game.comments" :key="comment.id" class="comment">
                        <div class="comment-header">
                            <span class="username">{{ comment.username }}</span>
                            <span class="timestamp">{{ formatDate(comment.timestamp) }}</span>
                        </div>
                        <div class="comment-text">{{ comment.text }}</div>
                    </div>
                </div>

                <!-- Comment input positioned at the bottom -->
                <div class="comment-input">
                    <form class="comment-form" @submit.prevent="submitComment">
                        <textarea
                            v-model="newCommentText"
                            placeholder="Write a comment..."
                            rows="2"
                            required
                        ></textarea>
                        <button type="submit" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Sending...' : 'Post' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useGameStore } from '@/stores/gameStore';

    const route = useRoute();
    const router = useRouter();
    const gameStore = useGameStore();

    const gameId = computed(() => Number(route.params.id));
    const game = computed(() => gameStore.games.find((g) => g.id === gameId.value));
    const commentsLoaded = ref(false);
    const newCommentText = ref('');
    const isSubmitting = ref(false);

    // Load comments for this game
    const loadComments = async () => {
        if (!commentsLoaded.value && game.value) {
            await gameStore.fetchComments(game.value.id);
            commentsLoaded.value = true;
        }
    };

    // Submit new comment
    const submitComment = async () => {
        if (!game.value || !newCommentText.value.trim()) return;

        isSubmitting.value = true;

        try {
            // Create a new comment object
            const comment = {
                gameId: game.value.id,
                username: 'User', // Default username or get from user profile/session
                text: newCommentText.value,
                timestamp: new Date().toISOString(),
            };

            // Add the comment to the store
            await gameStore.addComment(comment);

            // Reset the form
            newCommentText.value = '';
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            isSubmitting.value = false;
        }
    };

    // Format date to be more readable
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Navigate back to game list
    const goBack = () => {
        router.push({ name: 'home' });
    };

    // Play game function
    const playGame = () => {
        if (game.value) {
            const gameUrl = `${import.meta.env.VITE_GAME_URL}/${game.value.name}`;
            window.open(gameUrl, '_blank');
        }
    };

    onMounted(() => {
        // Ensure games are loaded
        if (gameStore.games.length === 0) {
            gameStore.fetchGames().then(() => {
                // If after loading games, the game doesn't exist, go back to list
                if (!game.value) {
                    router.push({ name: 'home' });
                    return;
                }
                loadComments();
            });
        } else {
            // If games are already loaded but requested game doesn't exist
            if (!game.value) {
                router.push({ name: 'home' });
                return;
            }
            loadComments();
        }
    });
</script>

<style scoped>
    .game-detail-container {
        padding: 2rem 0;
    }

    .back-button {
        background-color: #f0f0f0;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        margin-bottom: 2rem;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .back-button:hover {
        background-color: #e0e0e0;
    }

    .play-button {
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.8rem 1.5rem;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        margin: 1rem 0;
        transition: background-color 0.3s;
        display: block;
        width: fit-content;
    }

    .play-button:hover {
        background-color: #45a049;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .game-detail {
        display: flex;
        gap: 2rem;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .game-info {
        flex: 1;
        padding: 2rem;
    }

    .game-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }

    .game-description {
        color: #555;
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .game-meta {
        color: #888;
        font-size: 0.9rem;
    }

    .comments-section {
        flex: 1;
        padding: 2rem;
        background-color: #f9f9f9;
        max-width: 400px;
        border-left: 1px solid #eee;
        display: flex;
        flex-direction: column;
    }

    .comments-loading,
    .comments-error,
    .no-comments {
        padding: 1rem;
        text-align: center;
        color: #666;
    }

    .comments-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .comments-error {
        color: #e74c3c;
    }

    .comments-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 400px;
        overflow-y: auto;
        margin-bottom: 1rem;
        flex-grow: 1;
    }

    .comment {
        padding: 1rem;
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .comment-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .username {
        font-weight: bold;
        color: #2c3e50;
    }

    .timestamp {
        font-size: 0.8rem;
        color: #7f8c8d;
    }

    .comment-text {
        color: var(--color-text);
        line-height: 1.4;
    }

    /* Comment input at the bottom */
    .comment-input {
        margin-top: auto;
        position: sticky;
        bottom: 0;
        background-color: #f9f9f9;
        padding-top: 0.5rem;
    }

    .comment-form {
        display: flex;
        gap: 0.5rem;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .comment-form textarea {
        flex-grow: 1;
        border: none;
        padding: 0.75rem;
        font-family: inherit;
        font-size: 0.9rem;
        resize: none;
        outline: none;
    }

    .comment-form button {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 0 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        min-width: 60px;
    }

    .comment-form button:hover:not(:disabled) {
        background-color: #2980b9;
    }

    .comment-form button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    /* Loading spinner */
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

    .loading-spinner.small {
        width: 30px;
        height: 30px;
        border-width: 3px;
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

    /* Responsive design */
    @media (max-width: 768px) {
        .game-detail {
            flex-direction: column;
        }

        .comments-section {
            max-width: 100%;
            border-left: none;
            border-top: 1px solid #eee;
        }
    }
</style>
