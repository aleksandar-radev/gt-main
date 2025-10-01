<template>
    <transition name="consent-fade">
        <section v-if="visible" class="consent-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
            <div class="consent-text">
                <h2 class="consent-title">{{ t('consent.title') }}</h2>
                <p class="consent-message">
                    {{ t('consent.description') }}
                    <router-link class="consent-link" to="/privacy">{{ t('consent.learnMore') }}</router-link>
                </p>
            </div>
            <div class="consent-actions">
                <button class="consent-button primary" type="button" @click="onAccept">
                    {{ t('consent.accept') }}
                </button>
                <button class="consent-button ghost" type="button" @click="onDecline">
                    {{ t('consent.decline') }}
                </button>
            </div>
        </section>
    </transition>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useI18n } from '@/plugins/i18n';

    const props = defineProps<{ visible: boolean }>();

    const emit = defineEmits<{
        (e: 'accept'): void;
        (e: 'decline'): void;
    }>();

    const { t } = useI18n();

    const onAccept = () => emit('accept');
    const onDecline = () => emit('decline');

    const visible = computed(() => props.visible);
</script>

<style scoped>
    .consent-banner {
        position: fixed;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(26, 26, 26, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
        color: #f5f5f5;
        max-width: min(640px, 92vw);
        padding: 1.5rem;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 1.25rem;
        z-index: 100;
    }

    .consent-title {
        font-size: 1.1rem;
        margin: 0 0 0.5rem;
    }

    .consent-message {
        margin: 0;
        line-height: 1.5;
        color: #d7d7d7;
        font-size: 0.95rem;
    }

    .consent-link {
        color: #6fb7ff;
        font-weight: 600;
        margin-left: 0.35rem;
    }

    .consent-link:hover,
    .consent-link:focus {
        text-decoration: underline;
    }

    .consent-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .consent-button {
        border-radius: 999px;
        border: 1px solid transparent;
        padding: 0.6rem 1.6rem;
        cursor: pointer;
        font-weight: 600;
        transition:
            background-color 0.2s ease,
            color 0.2s ease,
            border 0.2s ease;
    }

    .consent-button.primary {
        background: linear-gradient(135deg, #2c82f6, #0f62d6);
        color: #fff;
    }

    .consent-button.primary:hover,
    .consent-button.primary:focus {
        background: linear-gradient(135deg, #5199ff, #2c82f6);
    }

    .consent-button.ghost {
        background: transparent;
        border-color: rgba(255, 255, 255, 0.25);
        color: #f5f5f5;
    }

    .consent-button.ghost:hover,
    .consent-button.ghost:focus {
        border-color: #6fb7ff;
        color: #6fb7ff;
    }

    .consent-fade-enter-active,
    .consent-fade-leave-active {
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }

    .consent-fade-enter-from,
    .consent-fade-leave-to {
        opacity: 0;
        transform: translate(-50%, 12px);
    }

    @media (min-width: 640px) {
        .consent-banner {
            grid-template-columns: minmax(0, 2fr) auto;
            align-items: center;
        }

        .consent-actions {
            justify-content: flex-end;
        }
    }

    @media (max-width: 520px) {
        .consent-banner {
            padding: 1.2rem;
            bottom: 1rem;
        }

        .consent-button {
            width: 100%;
            justify-content: center;
        }

        .consent-actions {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
</style>
