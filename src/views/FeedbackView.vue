<template>
    <div class="feedback-container">
        <h2>Share Your Feedback</h2>
        <form class="feedback-form" @submit.prevent="submitFeedback">
            <div class="form-group">
                <label for="name">Name</label>
                <input id="name" v-model="feedback.name" type="text" placeholder="Your name" />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="feedback.email" type="text" placeholder="Your email" />
            </div>

            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" v-model="feedback.message" placeholder="Your feedback" rows="5"></textarea>
            </div>

            <button type="submit" class="submit-btn">Submit Feedback</button>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';

    const feedback = reactive({
        name: '',
        email: '',
        message: '',
    });

    const submitFeedback = () => {
        console.log('Feedback submitted:', feedback);
        // Here you would typically send the feedback to your backend
        // Reset form after submission
        feedback.name = '';
        feedback.email = '';
        feedback.message = '';
        alert('Thank you for your feedback!');
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

    .submit-btn:hover {
        background-color: #2980b9;
    }
</style>
