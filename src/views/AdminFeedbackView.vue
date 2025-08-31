<template>
    <div class="admin-feedback-container">
        <h2>{{ t('adminFeedback.header') }}</h2>

        <div class="admin-header">
            <h2>{{ t('adminFeedback.header') }}</h2>
            <div class="admin-badge">Admin: {{ authStore.user?.username }}</div>
        </div>

        <div v-if="feedbackStore.loading" class="loading">{{ t('adminFeedback.loading') }}</div>

        <div v-if="feedbackStore.error" class="error-message">
            {{ feedbackStore.error }}
        </div>

        <div v-if="!feedbackStore.loading && feedbackStore.feedbacks.length === 0" class="empty-state">
            {{ t('adminFeedback.empty') }}
        </div>

        <div v-if="feedbackStore.feedbacks.length > 0" class="feedback-list">
            <div v-for="item in feedbackStore.feedbacks" :key="item.id" class="feedback-item">
                <div class="feedback-header">
                    <h3>
                        {{ item.name }}
                        <span class="email">{{ item.email }}</span>
                    </h3>
                    <div class="status-badge" :class="item.status?.toLowerCase()">
                        {{ item.status || 'Pending' }}
                    </div>
                </div>

                <div class="feedback-message">{{ item.message }}</div>

                <div class="feedback-actions">
                    <select v-model="item.status" @change="updateStatus(item.id!, item.status!)">
                        <option value="Pending">{{ t('adminFeedback.pending') }}</option>
                        <option value="In-Progress">{{ t('adminFeedback.inProgress') }}</option>
                        <option value="Resolved">{{ t('adminFeedback.resolved') }}</option>
                        <option value="Rejected">{{ t('adminFeedback.rejected') }}</option>
                    </select>

                    <button class="delete-btn" @click="deleteFeedbackItem(item.id!)">
                        {{ t('adminFeedback.delete') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import { useFeedbackStore } from '@/stores/feedbackStore';
    import { useAuthStore } from '@/stores/authStore';
    import { useI18n } from '@/plugins/i18n';

    const feedbackStore = useFeedbackStore();
    const authStore = useAuthStore();
    const { t } = useI18n();

    onMounted(async () => {
        await feedbackStore.getAllFeedback();
    });

    const updateStatus = async (id: number, status: string) => {
        try {
            await feedbackStore.updateFeedbackStatus(id, status);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const deleteFeedbackItem = async (id: number) => {
        if (confirm('Are you sure you want to delete this feedback?')) {
            try {
                await feedbackStore.deleteFeedback(id);
            } catch (error) {
                console.error('Failed to delete feedback:', error);
            }
        }
    };
</script>

<style scoped>
    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .admin-badge {
        background-color: #3498db;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: bold;
    }

    .admin-feedback-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    h2 {
        color: #ffffff;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .loading,
    .empty-state {
        text-align: center;
        color: #ffffff;
        padding: 2rem 0;
    }

    .error-message {
        background-color: #ffdddd;
        color: #d63031;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .feedback-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .feedback-item {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .feedback-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .feedback-header h3 {
        color: #ffffff;
        margin: 0;
    }

    .email {
        color: #95a5a6;
        font-weight: normal;
        font-size: 0.9rem;
    }

    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        text-transform: uppercase;
        font-weight: bold;
    }

    .status-badge.pending {
        background-color: #f39c12;
        color: #000;
    }

    .status-badge.in-progress {
        background-color: #3498db;
        color: #fff;
    }

    .status-badge.resolved {
        background-color: #2ecc71;
        color: #fff;
    }

    .status-badge.rejected {
        background-color: #e74c3c;
        color: #fff;
    }

    .feedback-message {
        color: #ffffff;
        line-height: 1.5;
    }

    .feedback-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    select {
        padding: 0.5rem;
        border-radius: 4px;
        background-color: #2c3e50;
        color: #ffffff;
        border: 1px solid #34495e;
    }

    .delete-btn {
        padding: 0.5rem 1rem;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .delete-btn:hover {
        background-color: #c0392b;
    }

    @media (max-width: 768px) {
        .feedback-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .feedback-actions {
            flex-direction: column;
            align-items: stretch;
        }
    }
</style>
