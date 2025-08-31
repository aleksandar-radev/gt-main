<template>
    <div v-if="gameStore.loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>{{ t('gamedetail.loading') }}</p>
    </div>

    <div v-else-if="!game" class="error-message">{{ t('gamedetail.notFound') }}</div>

    <div v-else class="game-detail-container">
        <button class="back-button" @click="goBack">{{ t('gamedetail.back') }}</button>

        <div class="game-detail">
            <div class="game-info">
                <img :src="game.bigLogoUrl" :alt="game.title" class="game-image" />
                <h1>{{ game.title }}</h1>
                <p class="game-description">{{ game.description }}</p>

                <!-- Play Now button -->
                <button class="play-button" @click="playGame">{{ t('gamedetail.play') }}</button>

                <div class="game-meta">
                    <span class="game-id">Game ID: {{ game.id }}</span>
                </div>
            </div>

            <div class="comments-section">
                <h2>{{ t('gamedetail.comments') }}</h2>

                <div v-if="gameStore.commentsLoading[gameId]" class="comments-loading">
                    <div class="loading-spinner small"></div>
                    <p>{{ t('gamedetail.loadingComments') }}</p>
                </div>

                <div v-else-if="gameStore.commentsError[gameId]" class="comments-error">
                    {{ gameStore.commentsError[gameId] }}
                </div>

                <div v-else-if="!game.comments || game.comments.length === 0" class="no-comments">
                    {{ t('gamedetail.noComments') }}
                </div>

                <div v-else class="comments-list">
                    <div v-for="comment in game.comments" :key="comment.id" class="comment">
                        <div class="comment-header">
                            <span class="username">{{ comment.user.username }}</span>
                            <span class="timestamp">{{ formatDate(comment.createdAt) }}</span>
                        </div>
                        <div class="comment-text">{{ comment.content }}</div>
                    </div>
                </div>

                <!-- Comment input positioned at the bottom -->
                <div class="comment-input">
                    <form class="comment-form" @submit.prevent="submitComment">
                        <textarea
                            v-model="newCommentText"
                            :placeholder="t('gamedetail.placeholder')"
                            rows="2"
                            required
                            maxlength="300"
                        ></textarea>
                        <button type="submit" :disabled="isSubmitting || newCommentText.length === 0">
                            {{ isSubmitting ? t('gamedetail.sending') : t('gamedetail.post') }}
                        </button>
                    </form>
                    <div class="character-counter" :class="{ 'limit-near': charactersRemaining <= 20 }">
                        {{ t('gamedetail.charactersLeft', { count: charactersRemaining }) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useGameStore } from '@/stores/gameStore';
    import { useI18n } from '@/plugins/i18n';

    const route = useRoute();
    const router = useRouter();
    const gameStore = useGameStore();
    const { t } = useI18n();

    const gameId = computed(() => Number(route.params.id));
    const game = computed(() => gameStore.games.find((g) => g.id === gameId.value));
    const commentsLoaded = ref(false);
    const newCommentText = ref('');
    const isSubmitting = ref(false);
    const characterLimit = 200;

    const charactersRemaining = computed(() => {
        return characterLimit - newCommentText.value.length;
    });

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
            // Create a new comment object with the correct property names
            const comment = {
                gameId: game.value.id,
                content: newCommentText.value, // Changed from 'text' to 'content'
                // Only include fields the API expects
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
        router.push({ name: 'games' });
    };

    // Play game function
    const playGame = () => {
        if (game.value) {
            const gameUrl = game.value.url;
            window.open(gameUrl, '_blank');
        }
    };

    onMounted(() => {
        // Ensure games are loaded
        if (gameStore.games.length === 0) {
            gameStore.fetchGames().then(() => {
                // If after loading games, the game doesn't exist, go back to list
                if (!game.value) {
                    router.push({ name: 'games' });
                    return;
                }
                loadComments();
            });
        } else {
            // If games are already loaded but requested game doesn't exist
            if (!game.value) {
                router.push({ name: 'games' });
                return;
            }
            loadComments();
        }
    });
</script>

<style scoped>
    .game-detail-container {
        padding: 0rem 0;
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
        gap: 0.3rem;
        max-height: 400px;
        overflow-y: auto;
        margin-bottom: 1rem;
        flex-grow: 1;
    }

    .comment {
        padding: 2px 1rem;
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

    .comment-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .comment-form textarea {
        width: 100%;
        border: none;
        padding: 0.75rem;
        font-family: inherit;
        font-size: 0.9rem;
        resize: none;
        outline: none;
    }

    .character-counter {
        padding: 0 0.75rem;
        font-size: 0.8rem;
        color: #7f8c8d;
        text-align: right;
    }

    .limit-near {
        color: #e74c3c;
        font-weight: bold;
    }

    .comment-form button {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        align-self: flex-end;
        border-radius: 4px;
        margin: 0 0.75rem 0.75rem 0;
    }
</style>
