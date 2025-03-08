<template>
    <div class="auth-form-container">
        <div class="auth-form-card">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .auth-form-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 2rem;
    }

    .auth-form-card {
        background: #252525;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        padding: 2rem;
        width: 100%;
        max-width: 450px;
        border: 1px solid #444;
    }

    @media (max-width: 480px) {
        .auth-form-card {
            padding: 1.5rem;
        }
    }
</style>
