<template>
    <div class="feedback-container">
        <h2>Share Your Feedback</h2>
        <div v-if="submissionError" class="error-message">
            {{ submissionError }}
        </div>
        <div v-if="successMessage" class="success-message">
            {{ successMessage }}
        </div>
        <form class="feedback-form" @submit.prevent="submitFeedback">
            <div class="form-group">
                <label for="name">Name</label>
                <input id="name" v-model="feedback.name" type="text" placeholder="Your name" />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="feedback.email" type="email" placeholder="Your email" />
            </div>

            <div class="form-group">
                <label for="message">Message</label>
                <textarea
                    id="message"
                    v-model="feedback.message"
                    placeholder="Your feedback"
                    rows="5"
                    required
                ></textarea>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Submit Feedback' }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import { useFeedbackStore } from '@/stores/feedbackStore';

    const feedbackStore = useFeedbackStore();
    const submissionError = ref<string | null>(null);
    const successMessage = ref<string | null>(null);
    const isSubmitting = ref(false);

    const feedback = reactive({
        name: '',
        email: '',
        message: '',
    });

    const submitFeedback = async () => {
        try {
            isSubmitting.value = true;
            submissionError.value = null;
            successMessage.value = null;

            await feedbackStore.submitFeedback(feedback);

            // Reset form after successful submission
            feedback.name = '';
            feedback.email = '';
            feedback.message = '';

            successMessage.value = 'Thank you for your feedback! We appreciate your input.';
        } catch (error) {
            submissionError.value = typeof error === 'string' ? error : 'Failed to submit feedback. Please try again.';
        } finally {
            isSubmitting.value = false;
        }
    };
</script>

<style scoped>
    label {
        color: #ffffff;
    }
    .feedback-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
    }

    h2 {
        color: #ffffff;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .feedback-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-weight: bold;
    }

    input,
    textarea {
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
    }

    .submit-btn {
        padding: 0.75rem 1.5rem;
        background-color: #3498db;
        color: rgb(255, 255, 255);
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
        align-self: flex-start;
    }

    .submit-btn:hover:not(:disabled) {
        background-color: #2980b9;
    }

    .submit-btn:disabled {
        background-color: #95a5a6;
        cursor: not-allowed;
    }

    .error-message {
        background-color: #ffdddd;
        color: #d63031;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .success-message {
        background-color: #ddffdd;
        color: #00b894;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
</style>
