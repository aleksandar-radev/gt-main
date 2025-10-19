<template>
    <div v-if="gameStore.loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>{{ t('gamedetail.loading') }}</p>
    </div>

    <div v-else-if="!game" class="error-message">{{ t('gamedetail.notFound') }}</div>

    <div v-else class="game-detail-container">
        <button class="back-button" @click="goBack">{{ t('gamedetail.back') }}</button>

        <div class="game-detail">
            <div class="game-main">
                <header class="game-hero">
                    <img :src="game.bigLogoUrl" :alt="game.title" class="game-image" />
                    <div class="game-hero-text">
                        <h1>{{ game.title }}</h1>
                        <p class="game-description">{{ game.description }}</p>
                        <dl class="game-meta">
                            <div>
                                <dt>{{ t('gamedetail.metaCategory') }}</dt>
                                <dd>{{ displayCategory }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('gamedetail.metaType') }}</dt>
                                <dd>{{ displayType }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('gamedetail.metaStatus') }}</dt>
                                <dd>{{ displayStatus }}</dd>
                            </div>
                        </dl>
                        <div class="hero-actions">
                            <button class="play-button" @click="playGame">
                                {{ t('gamedetail.playInline') }}
                            </button>
                            <a
                                v-if="game.url"
                                class="launch-link"
                                :href="game.url"
                                target="_blank"
                                rel="noopener"
                            >
                                {{ t('gamedetail.openInNewTab') }}
                            </a>
                        </div>
                        <p v-if="!hasPlayableEmbed" class="external-note">
                            {{ t('gamedetail.externalPlayNote') }}
                        </p>
                    </div>
                </header>

                <section class="info-section guidance-card">
                    <header class="info-header">
                        <h2>{{ t('gamedetail.guidanceTitle') }}</h2>
                        <p>{{ t('gamedetail.guidanceLead') }}</p>
                    </header>
                    <div class="guidance-grid">
                        <div class="guidance-column">
                            <h3>{{ t('gamedetail.howToTitle') }}</h3>
                            <ol class="step-list">
                                <li v-for="(step, index) in howToPlaySteps" :key="index">
                                    <span class="step-number">{{ index + 1 }}</span>
                                    <p>{{ step }}</p>
                                </li>
                            </ol>
                        </div>
                        <div class="guidance-column">
                            <h3>{{ t('gamedetail.tipsTitle') }}</h3>
                            <ul class="tips-list">
                                <li v-for="(tip, index) in proTips" :key="index">
                                    <span class="checkmark" aria-hidden="true">✔</span>
                                    <span>{{ tip }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section class="info-section gallery-card">
                    <header class="info-header">
                        <h2>{{ t('gamedetail.galleryTitle') }}</h2>
                        <p>{{ t('gamedetail.galleryLead') }}</p>
                    </header>
                    <div v-if="galleryImages.length > 0" class="gallery-grid">
                        <figure v-for="(image, index) in galleryImages" :key="index" class="gallery-item">
                            <img :src="image.src" :alt="image.alt" loading="lazy" />
                        </figure>
                    </div>
                    <div v-else class="gallery-empty">
                        <p>{{ t('gamedetail.galleryEmpty') }}</p>
                        <button class="gallery-add" type="button" @click="goToGameManagement">
                            {{ t('gamedetail.galleryManageCta') }}
                        </button>
                    </div>
                </section>
            </div>

            <aside class="comments-section">
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
                    <article v-for="comment in game.comments" :key="comment.id" class="comment">
                        <div class="comment-header">
                            <span class="username">{{ comment.user.username }}</span>
                            <span class="timestamp">{{ formatDate(comment.createdAt) }}</span>
                        </div>
                        <p class="comment-text">{{ comment.content }}</p>
                    </article>
                </div>

                <div class="comment-input">
                    <form class="comment-form" @submit.prevent="submitComment">
                        <label class="sr-only" :for="`comment-${gameId}`">{{ t('gamedetail.placeholder') }}</label>
                        <textarea
                            :id="`comment-${gameId}`"
                            v-model="newCommentText"
                            :placeholder="t('gamedetail.placeholder')"
                            rows="3"
                            required
                            maxlength="400"
                        ></textarea>
                        <button type="submit" :disabled="isSubmitting || newCommentText.length === 0">
                            {{ isSubmitting ? t('gamedetail.sending') : t('gamedetail.post') }}
                        </button>
                    </form>
                    <div class="character-counter" :class="{ 'limit-near': charactersRemaining <= 40 }">
                        {{ t('gamedetail.charactersLeft', { count: charactersRemaining }) }}
                    </div>
                </div>
            </aside>

            <Teleport to="body">
                <div
                    v-if="isModalOpen"
                    class="game-modal"
                    role="dialog"
                    :aria-label="t('gamedetail.modalTitle', { title: game?.title ?? '' })"
                    aria-modal="true"
                >
                    <div class="modal-backdrop"></div>
                    <div class="modal-content" role="document">
                        <header class="modal-header">
                            <h2>{{ game?.title }}</h2>
                            <button
                                ref="closeButtonRef"
                                type="button"
                                class="modal-close"
                                @click="closeModal"
                                :aria-label="t('gamedetail.closeModal')"
                            >
                                ×
                            </button>
                        </header>
                        <div v-if="hasPlayableEmbed" class="modal-frame">
                            <iframe
                                :title="iframeTitle"
                                :src="game?.url"
                                loading="lazy"
                                allow="fullscreen; gamepad; xr-spatial-tracking"
                                sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-modals allow-popups"
                            ></iframe>
                        </div>
                        <div v-else class="modal-placeholder">
                            <p>{{ t('gamedetail.noEmbedTitle') }}</p>
                            <p>{{ t('gamedetail.noEmbedBody') }}</p>
                        </div>
                    </div>
                </div>
            </Teleport>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useGameStore } from '@/stores/gameStore';
    import { useI18n } from '@/plugins/i18n';
    import type { Game } from '@/types';

    const route = useRoute();
    const router = useRouter();
    const gameStore = useGameStore();
    const { t } = useI18n();

    const gameId = computed(() => Number(route.params.id));
    const game = computed(() => gameStore.games.find((g) => g.id === gameId.value));
    const commentsLoaded = ref(false);
    const newCommentText = ref('');
    const isSubmitting = ref(false);
    const characterLimit = 400;
    const isModalOpen = ref(false);
    const closeButtonRef = ref<HTMLButtonElement | null>(null);

    const charactersRemaining = computed(() => {
        return characterLimit - newCommentText.value.length;
    });

    const displayCategory = computed(() => game.value?.category || t('gamedetail.metaFallback'));
    const displayType = computed(() => game.value?.type || t('gamedetail.metaFallback'));
    const displayStatus = computed(() =>
        game.value?.status === 'active' ? t('gamedetail.statusActive') : t('gamedetail.statusInactive'),
    );

    const iframeTitle = computed(() => t('gamedetail.iframeTitle', { title: game.value?.title ?? '' }));
    const hasPlayableEmbed = computed(() => Boolean(game.value?.url));

    const howToPlaySteps = computed(() => [
        t('gamedetail.howToStep1'),
        t('gamedetail.howToStep2'),
        t('gamedetail.howToStep3'),
    ]);

    const proTips = computed(() => [t('gamedetail.tip1'), t('gamedetail.tip2'), t('gamedetail.tip3')]);

    type ExtendedGame = Game & {
        galleryUrls?: string[];
        mediaGallery?: string[];
        screenshots?: string[];
    };

    const galleryImages = computed(() => {
        const currentGame = game.value as ExtendedGame | undefined;
        if (!currentGame) {
            return [] as { src: string; alt: string }[];
        }

        const sources = new Set<string>();
        const images: { src: string; alt: string }[] = [];

        const addImage = (src: string | undefined | null, suffix: string) => {
            if (src && !sources.has(src)) {
                sources.add(src);
                images.push({ src, alt: `${currentGame.title} ${suffix}` });
            }
        };

        const galleryCandidates = [currentGame.galleryUrls, currentGame.mediaGallery, currentGame.screenshots]
            .filter((value): value is string[] => Array.isArray(value))
            .flat();

        galleryCandidates.forEach((url, index) => addImage(url, t('gamedetail.galleryAlt', { index: index + 1 })));

        addImage(currentGame.bigLogoUrl, t('gamedetail.galleryHero'));
        addImage(currentGame.logoUrl, t('gamedetail.galleryBadge'));

        return images;
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
            const comment = {
                gameId: game.value.id,
                content: newCommentText.value,
            };

            await gameStore.addComment(comment);

            newCommentText.value = '';
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            isSubmitting.value = false;
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const goBack = () => {
        router.push({ name: 'games' });
    };

    const playGame = () => {
        if (hasPlayableEmbed.value) {
            isModalOpen.value = true;
            nextTick(() => {
                closeButtonRef.value?.focus();
            });
        } else if (game.value?.url) {
            window.open(game.value.url, '_blank');
        }
    };

    const closeModal = () => {
        isModalOpen.value = false;
    };

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isModalOpen.value) {
            closeModal();
        }
    };

    const goToGameManagement = () => {
        router.push({ name: 'gameManagement' });
    };

    onMounted(() => {
        if (gameStore.games.length === 0) {
            gameStore.fetchGames().then(() => {
                if (!game.value) {
                    router.push({ name: 'games' });
                    return;
                }
                loadComments();
            });
        } else {
            if (!game.value) {
                router.push({ name: 'games' });
                return;
            }
            loadComments();
        }

        window.addEventListener('keydown', handleKeydown);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown);
        document.body.style.overflow = '';
    });

    watch(isModalOpen, (open) => {
        document.body.style.overflow = open ? 'hidden' : '';
    });
</script>

<style scoped>
    .game-detail-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding-bottom: 2rem;
    }

    .back-button {
        align-self: flex-start;
        background: rgba(15, 25, 38, 0.08);
        border: none;
        border-radius: 999px;
        padding: 0.5rem 1.25rem;
        font-weight: 600;
        color: #0f1926;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
    }

    .back-button:hover {
        background: rgba(15, 25, 38, 0.15);
        transform: translateY(-1px);
    }

    .game-detail {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
        gap: 2.5rem;
        align-items: start;
    }

    .game-main {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }

    .game-hero {
        display: grid;
        gap: 2rem;
        background: linear-gradient(135deg, #0a1120, #1a2f4f);
        border-radius: 24px;
        padding: 2.5rem;
        box-shadow: 0 18px 45px rgba(5, 13, 24, 0.25);
        color: #f3f8ff;
    }

    .game-image {
        width: 100%;
        max-height: 320px;
        object-fit: cover;
        border-radius: 18px;
        box-shadow: 0 15px 35px rgba(5, 13, 24, 0.35);
    }

    .game-hero-text {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .game-hero-text h1 {
        margin: 0;
        font-size: clamp(2.2rem, 3vw, 2.75rem);
        color: #f6f8ff;
    }

    .game-description {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(243, 248, 255, 0.82);
    }

    .game-meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
        margin: 0;
    }

    .game-meta div {
        background: rgba(8, 19, 35, 0.45);
        padding: 0.85rem 1rem;
        border-radius: 14px;
        border: 1px solid rgba(158, 203, 255, 0.18);
    }

    .game-meta dt {
        margin: 0;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(158, 203, 255, 0.85);
    }

    .game-meta dd {
        margin: 0.35rem 0 0 0;
        font-weight: 600;
        color: #f3f8ff;
    }

    .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .play-button {
        background: linear-gradient(135deg, #63e6be, #3c7bff);
        color: #041225;
        border: none;
        border-radius: 999px;
        padding: 0.85rem 1.75rem;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 12px 34px rgba(60, 123, 255, 0.35);
    }

    .play-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 40px rgba(60, 123, 255, 0.5);
    }

    .launch-link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        border-radius: 999px;
        padding: 0.85rem 1.75rem;
        background: rgba(15, 25, 38, 0.25);
        color: #f3f8ff;
        text-decoration: none;
        font-weight: 600;
        transition: background 0.2s ease;
    }

    .launch-link:hover {
        background: rgba(15, 25, 38, 0.35);
    }

    .external-note {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(243, 248, 255, 0.65);
    }

    .info-section {
        background: linear-gradient(135deg, rgba(13, 24, 42, 0.92), rgba(41, 21, 68, 0.88));
        border-radius: 24px;
        padding: 2.25rem;
        box-shadow: 0 18px 45px rgba(5, 13, 24, 0.24);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        color: #f4f6fb;
    }

    .info-header h2 {
        margin: 0;
        font-size: 1.6rem;
    }

    .info-header p {
        margin: 0;
        color: rgba(228, 235, 252, 0.8);
        max-width: 60ch;
        line-height: 1.6;
    }

    .guidance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 2rem;
    }

    .guidance-column h3 {
        margin-top: 0;
        font-size: 1.25rem;
        color: #9ecbff;
    }

    .step-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1.25rem;
    }

    .step-list li {
        display: flex;
        gap: 1rem;
        align-items: center;
        background: rgba(11, 21, 38, 0.75);
        padding: 1rem 1.25rem;
        border-radius: 16px;
        line-height: 1.5;
        border: 1px solid rgba(158, 203, 255, 0.08);
    }

    .step-number {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 999px;
        background: #63e6be;
        color: #041225;
        display: grid;
        place-items: center;
        font-weight: 700;
        font-size: 1.1rem;
    }

    .tips-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1rem;
    }

    .tips-list li {
        display: flex;
        gap: 0.85rem;
        background: rgba(11, 21, 38, 0.75);
        padding: 0.85rem 1.1rem;
        border-radius: 14px;
        align-items: flex-start;
        line-height: 1.5;
        border: 1px solid rgba(158, 203, 255, 0.08);
    }

    .tips-list .checkmark {
        font-size: 1.2rem;
        color: #63e6be;
        line-height: 1.2;
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1.25rem;
    }

    .gallery-item {
        position: relative;
        overflow: hidden;
        border-radius: 18px;
        border: 1px solid rgba(158, 203, 255, 0.18);
        background: rgba(7, 16, 30, 0.6);
    }

    .gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.35s ease;
    }

    .gallery-item:hover img {
        transform: scale(1.05);
    }

    .gallery-empty {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        background: rgba(7, 16, 30, 0.6);
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px dashed rgba(158, 203, 255, 0.3);
    }

    .gallery-add {
        background: transparent;
        border: 1px solid rgba(158, 203, 255, 0.4);
        color: #9ecbff;
        border-radius: 999px;
        padding: 0.65rem 1.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .gallery-add:hover {
        background: rgba(158, 203, 255, 0.1);
    }

    .comments-section {
        position: sticky;
        top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background: linear-gradient(135deg, rgba(249, 249, 255, 0.92), rgba(211, 228, 255, 0.95));
        border-radius: 24px;
        padding: 2rem;
        box-shadow: 0 18px 45px rgba(5, 13, 24, 0.18);
    }

    .comments-section h2 {
        margin: 0;
        color: #071222;
    }

    .comments-loading,
    .comments-error,
    .no-comments {
        text-align: center;
        color: #3f566b;
        font-size: 0.95rem;
    }

    .comments-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .comment {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16px;
        padding: 1.25rem;
        box-shadow: 0 10px 25px rgba(8, 19, 35, 0.08);
    }

    .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    .username {
        font-weight: 600;
        color: #071222;
    }

    .timestamp {
        font-size: 0.85rem;
        color: #6b7d91;
    }

    .comment-text {
        margin: 0;
        line-height: 1.6;
        color: #071222;
    }

    .comment-input {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .comment-form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    textarea {
        width: 100%;
        border-radius: 16px;
        border: 1px solid rgba(7, 18, 34, 0.15);
        padding: 0.85rem 1rem;
        resize: vertical;
        font-family: inherit;
        font-size: 1rem;
    }

    .comment-form button {
        background: linear-gradient(135deg, #3c7bff, #7a3dff);
        color: white;
        border: none;
        border-radius: 999px;
        padding: 0.65rem 1.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
    }

    .comment-form button:hover:not(:disabled) {
        background: linear-gradient(135deg, #326af0, #6c2fff);
        transform: translateY(-1px);
    }

    .comment-form button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .character-counter {
        align-self: flex-end;
        font-size: 0.8rem;
        color: #6b7d91;
    }

    .character-counter.limit-near {
        color: #c0392b;
        font-weight: 600;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        padding: 4rem 0;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 5px solid rgba(15, 25, 38, 0.1);
        border-top-color: #3498db;
        animation: spin 1s linear infinite;
    }

    .loading-spinner.small {
        width: 28px;
        height: 28px;
        border-width: 4px;
    }

    .error-message {
        text-align: center;
        background: rgba(192, 57, 43, 0.08);
        color: #c0392b;
        padding: 2rem;
        border-radius: 16px;
        margin: 2rem 0;
    }

    .game-modal {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        z-index: 9999;
    }

    .modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(2, 10, 24, 0.85);
        backdrop-filter: blur(6px);
    }

    .modal-content {
        position: relative;
        width: min(95vw, 1400px);
        height: min(95vh, 860px);
        border-radius: 28px;
        background: linear-gradient(160deg, #050c1a, #1c2d52 65%, #2d1956);
        box-shadow: 0 30px 90px rgba(2, 10, 24, 0.8);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background: rgba(4, 12, 24, 0.65);
        color: #f5f8ff;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    .modal-close {
        background: transparent;
        border: 0;
        color: #f5f8ff;
        font-size: 2rem;
        line-height: 1;
        cursor: pointer;
        border-radius: 999px;
        width: 2.5rem;
        height: 2.5rem;
        display: grid;
        place-items: center;
        transition: background 0.2s ease;
    }

    .modal-close:hover,
    .modal-close:focus-visible {
        background: rgba(158, 203, 255, 0.18);
    }

    .modal-frame {
        flex: 1;
        position: relative;
    }

    .modal-frame iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
    }

    .modal-placeholder {
        flex: 1;
        display: grid;
        place-items: center;
        text-align: center;
        color: #f5f8ff;
        padding: 2rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 1100px) {
        .game-detail {
            grid-template-columns: 1fr;
        }

        .comments-section {
            position: static;
        }
    }

    @media (max-width: 768px) {
        .game-hero,
        .info-section,
        .comments-section {
            padding: 1.75rem;
            border-radius: 20px;
        }

        .game-hero {
            gap: 1.5rem;
        }

        .game-detail {
            gap: 2rem;
        }

        .hero-actions {
            flex-direction: column;
        }

        .modal-content {
            width: 95vw;
            height: 92vh;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
</style>
