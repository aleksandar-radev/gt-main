import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Feedback } from '../types';
import api from '../config/api';

const API_URL = import.meta.env.VITE_API_URL;

export const useFeedbackStore = defineStore('feedback', () => {
    const feedbacks = ref<Feedback[]>([]);
    const currentFeedback = ref<Feedback | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const methods = {
        // Submit new feedback (public)
        submitFeedback: async (feedback: Feedback): Promise<void> => {
            try {
                loading.value = true;
                error.value = null;

                const response = await api.post(`${API_URL}feedback`, feedback);
                return response.data;
            } catch (err: any) {
                console.error('Error submitting feedback:', err);
                error.value = err.response?.data?.message || 'Failed to submit feedback. Please try again.';
                throw error.value;
            } finally {
                loading.value = false;
            }
        },

        // Get all feedback (admin only)
        getAllFeedback: async (): Promise<void> => {
            try {
                loading.value = true;
                error.value = null;

                const response = await api.get(`${API_URL}feedback`);
                feedbacks.value = response.data;
            } catch (err: any) {
                console.error('Error fetching feedback:', err);
                error.value = err.response?.data?.message || 'Failed to load feedback. Please try again.';
            } finally {
                loading.value = false;
            }
        },

        // Get specific feedback by ID (admin only)
        getFeedbackById: async (id: number): Promise<void> => {
            try {
                loading.value = true;
                error.value = null;

                const response = await api.get(`${API_URL}feedback/${id}`);
                currentFeedback.value = response.data;
            } catch (err: any) {
                console.error(`Error fetching feedback ${id}:`, err);
                error.value = err.response?.data?.message || 'Failed to load feedback details.';
            } finally {
                loading.value = false;
            }
        },

        // Update feedback status (admin only)
        updateFeedbackStatus: async (id: number, status: string): Promise<void> => {
            try {
                loading.value = true;
                error.value = null;

                await api.post(`${API_URL}feedback/${id}/status`, { status });

                // Update local state
                if (currentFeedback.value && currentFeedback.value.id === id) {
                    currentFeedback.value.status = status;
                }

                // Update in the list if present
                const feedbackIndex = feedbacks.value.findIndex((f) => f.id === id);
                if (feedbackIndex !== -1) {
                    feedbacks.value[feedbackIndex].status = status;
                }
            } catch (err: any) {
                console.error(`Error updating feedback ${id} status:`, err);
                error.value = err.response?.data?.message || 'Failed to update feedback status.';
                throw error.value;
            } finally {
                loading.value = false;
            }
        },

        // Delete feedback (admin only)
        deleteFeedback: async (id: number): Promise<void> => {
            try {
                loading.value = true;
                error.value = null;

                await api.delete(`${API_URL}feedback/${id}`);

                // Remove from local state
                feedbacks.value = feedbacks.value.filter((f) => f.id !== id);
                if (currentFeedback.value && currentFeedback.value.id === id) {
                    currentFeedback.value = null;
                }
            } catch (err: any) {
                console.error(`Error deleting feedback ${id}:`, err);
                error.value = err.response?.data?.message || 'Failed to delete feedback.';
                throw error.value;
            } finally {
                loading.value = false;
            }
        },
    };

    return {
        feedbacks,
        currentFeedback,
        loading,
        error,
        ...methods,
    };
});
