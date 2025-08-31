<template>
    <div class="comments-section">
        <button class="comments-toggle" @click="toggleComments">
            {{ showComments ? t('gamecomments.hide') : t('gamecomments.show') }}
        </button>

        <div v-if="showComments" class="comments-container">
            <div v-if="gameStore.commentsLoading[gameId]" class="comments-loading">{{ t('gamecomments.loading') }}</div>

            <div v-else-if="gameStore.commentsError[gameId]" class="comments-error">
                {{ gameStore.commentsError[gameId] }}
            </div>

            <div v-else>
                <div v-if="gameStore.games.find((g) => g.id === gameId)?.comments?.length === 0" class="no-comments">
                    {{ t('gamecomments.noComments') }}
                </div>

                <div v-else class="comments-list">
                    <div
                        v-for="comment in gameStore.games.find((g) => g.id === gameId)?.comments"
                        :key="comment.id"
                        class="comment"
                    >
                        <div class="comment-header">
                            <span class="username">{{ comment.username }}</span>
                            <span class="timestamp">{{ formatDate(comment.createdAt) }}</span>
                        </div>
                        <div class="comment-text">{{ comment.content }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useGameStore } from '@/stores/gameStore';
    import { useI18n } from '@/plugins/i18n';

    const props = defineProps<{
        gameId: number;
    }>();

    const gameStore = useGameStore();
    const showComments = ref(false);
    const { t } = useI18n();

    const toggleComments = async () => {
        showComments.value = !showComments.value;

        // Fetch comments if they don't exist yet and comments are being shown
        if (showComments.value) {
            const game = gameStore.games.find((g) => g.id === props.gameId);
            if (game && !game.comments) {
                await gameStore.fetchComments(props.gameId);
            }
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
</script>

<style scoped>
    .comments-section {
        margin-top: 1rem;
    }

    .comments-toggle {
        background-color: #f0f0f0;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
    }

    .comments-toggle:hover {
        background-color: #e0e0e0;
    }

    .comments-container {
        margin-top: 1rem;
        background-color: #f9f9f9;
        padding: 1rem;
        border-radius: 4px;
    }

    .comments-loading,
    .comments-error,
    .no-comments {
        padding: 1rem;
        text-align: center;
        color: #666;
    }

    .comments-error {
        color: #e74c3c;
    }

    .comments-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .comment {
        padding: 0.75rem;
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
</style>
