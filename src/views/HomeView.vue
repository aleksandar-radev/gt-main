<template>
    <div class="home-view">
        <section class="hero">
            <div class="hero-content">
                <p class="eyebrow">{{ t('home.eyebrow') }}</p>
                <h1>{{ t('home.welcomeTitle') }}</h1>
                <p class="lead">{{ t('home.welcomeTagline') }}</p>
                <div class="hero-actions">
                    <router-link :to="primaryGameLink" class="cta primary">{{ t('home.ctaPlay') }}</router-link>
                    <router-link to="/about" class="cta secondary">{{ t('home.ctaLearn') }}</router-link>
                </div>
                <ul class="hero-metrics">
                    <li v-for="(metric, index) in heroMetrics" :key="index">
                        <span class="metric-value">{{ metric.value }}</span>
                        <span class="metric-label">{{ metric.label }}</span>
                    </li>
                </ul>
            </div>
            <div class="hero-preview">
                <div class="preview-card">
                    <span class="preview-eyebrow">{{ t('home.spotlightLabel') }}</span>
                    <h2>{{ t('home.spotlightTitle') }}</h2>
                    <p>{{ t('home.spotlightDescription') }}</p>
                    <ul class="preview-tags">
                        <li v-for="(tag, index) in spotlightTags" :key="index">{{ tag }}</li>
                    </ul>
                    <a class="preview-link" href="https://www.ghost-team.top/endless" target="_blank" rel="noopener">
                        {{ t('home.spotlightExternal') }}
                    </a>
                </div>
            </div>
        </section>

        <section class="featured-section">
            <header class="section-header">
                <h2>{{ t('home.featured') }}</h2>
                <p>{{ t('home.featuredDescription') }}</p>
            </header>

            <div v-if="gameStore.loading" class="loading-state">{{ t('gamelist.loading') }}</div>
            <div v-else-if="gameStore.error" class="error-message">{{ gameStore.error }}</div>
            <div v-else>
                <div v-if="activeFeaturedGames.length > 0" class="games-grid">
                    <article
                        v-for="game in activeFeaturedGames"
                        :key="game.id"
                        class="game-card"
                        @click="navigateToGameDetail(game.id)"
                    >
                        <img :src="game.logoUrl" :alt="game.title" class="game-image" />
                        <div class="game-details">
                            <h3>{{ game.title }}</h3>
                            <p>{{ game.description }}</p>
                            <dl class="game-meta">
                                <div>
                                    <dt>{{ t('home.metaCategory') }}</dt>
                                    <dd>{{ game.category || t('home.metaFallback') }}</dd>
                                </div>
                                <div>
                                    <dt>{{ t('home.metaType') }}</dt>
                                    <dd>{{ game.type || t('home.metaFallback') }}</dd>
                                </div>
                            </dl>
                        </div>
                    </article>
                </div>
                <div v-else class="empty-state">
                    <h3>{{ t('home.noFeaturedTitle') }}</h3>
                    <p>{{ t('home.noFeaturedBody') }}</p>
                    <router-link class="cta tertiary" to="/games">{{ t('home.noFeaturedBrowse') }}</router-link>
                </div>
            </div>
        </section>

        <section class="guidance-section">
            <div class="guidance-card">
                <header class="section-header">
                    <h2>{{ t('home.howToPlayTitle') }}</h2>
                    <p>{{ t('home.howToPlayLead') }}</p>
                </header>
                <ol class="step-list">
                    <li v-for="(step, index) in howToPlaySteps" :key="index">
                        <span class="step-number">{{ index + 1 }}</span>
                        <p>{{ step }}</p>
                    </li>
                </ol>
            </div>
            <div class="tips-card">
                <h2>{{ t('home.proTipsTitle') }}</h2>
                <p class="tips-lead">{{ t('home.proTipsLead') }}</p>
                <ul class="tips-list">
                    <li v-for="(tip, index) in proTips" :key="index">
                        <span class="checkmark" aria-hidden="true">✔</span>
                        <span>{{ tip }}</span>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, computed } from 'vue';
    import { useGameStore } from '@/stores/gameStore';
    import { useRouter } from 'vue-router';
    import { useI18n } from '@/plugins/i18n';

    const gameStore = useGameStore();
    const router = useRouter();
    const { t } = useI18n();

    const activeFeaturedGames = computed(() => gameStore.featuredGames.filter((g) => g.status === 'active'));

    const howToPlaySteps = computed(() => [
        t('home.howToPlayStep1'),
        t('home.howToPlayStep2'),
        t('home.howToPlayStep3'),
        t('home.howToPlayStep4'),
    ]);

    const proTips = computed(() => [t('home.proTip1'), t('home.proTip2'), t('home.proTip3')]);

    const heroMetrics = computed(() => [
        { label: t('home.metricSessionLabel'), value: t('home.metricSessionValue') },
        { label: t('home.metricModeLabel'), value: t('home.metricModeValue') },
        { label: t('home.metricUpdateLabel'), value: t('home.metricUpdateValue') },
    ]);

    const spotlightTags = computed(() => [t('home.spotlightTag1'), t('home.spotlightTag2'), t('home.spotlightTag3')]);

    const primaryGameLink = computed(() => {
        const featured = activeFeaturedGames.value[0];
        if (featured) {
            return { name: 'gameDetail', params: { id: featured.id.toString() } };
        }

        const fallback = gameStore.games.find((game) => game.status === 'active');
        if (fallback) {
            return { name: 'gameDetail', params: { id: fallback.id.toString() } };
        }

        return { name: 'games' };
    });

    onMounted(() => {
        if (gameStore.featuredGames.length === 0) {
            gameStore.fetchFeaturedGames();
        }
    });

    const navigateToGameDetail = (gameId: number) => {
        router.push({ name: 'gameDetail', params: { id: gameId.toString() } });
    };
</script>

<style scoped>
    .home-view {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    .hero {
        display: grid;
        gap: 2.5rem;
        background: radial-gradient(circle at top left, #3c7bff 0%, #1a0f3b 55%, #080f1f 100%);
        padding: 3.5rem;
        border-radius: 28px;
        color: #f8fbff;
        box-shadow: 0 28px 70px rgba(5, 13, 24, 0.35);
    }

    .hero-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 700;
        color: #9ecbff;
    }

    h1 {
        font-size: clamp(2.5rem, 4vw, 3.5rem);
        margin: 0;
        line-height: 1.1;
    }

    .lead {
        font-size: 1.1rem;
        max-width: 60ch;
        color: rgba(248, 251, 255, 0.82);
    }

    .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.85rem 1.75rem;
        border-radius: 999px;
        font-weight: 600;
        text-decoration: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .cta.primary {
        background: linear-gradient(135deg, #63e6be, #3c7bff);
        color: #041225;
        box-shadow: 0 10px 30px rgba(60, 123, 255, 0.4);
    }

    .cta.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 36px rgba(60, 123, 255, 0.5);
    }

    .cta.secondary {
        background: rgba(255, 255, 255, 0.12);
        color: #f8fbff;
        border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .cta.secondary:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.2);
    }

    .cta.tertiary {
        background: linear-gradient(135deg, rgba(60, 123, 255, 0.2), rgba(122, 61, 255, 0.2));
        color: #0f1926;
        padding-inline: 1.5rem;
        border: 1px solid rgba(15, 25, 38, 0.1);
    }

    .hero-metrics {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
    }

    .hero-metrics li {
        display: flex;
        flex-direction: column;
        min-width: 140px;
    }

    .metric-value {
        font-size: 1.6rem;
        font-weight: 700;
        color: #63e6be;
    }

    .metric-label {
        font-size: 0.85rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(248, 251, 255, 0.65);
    }

    .hero-preview {
        display: grid;
        place-items: center;
    }

    .preview-card {
        background: linear-gradient(160deg, rgba(6, 14, 33, 0.85), rgba(122, 61, 255, 0.35));
        border-radius: 24px;
        padding: 2.5rem;
        max-width: 420px;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        border: 1px solid rgba(158, 203, 255, 0.25);
        box-shadow: 0 22px 60px rgba(5, 13, 24, 0.45);
    }

    .preview-eyebrow {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.28em;
        color: rgba(158, 203, 255, 0.85);
    }

    .preview-card h2 {
        margin: 0;
        font-size: 1.8rem;
        color: #f8fbff;
    }

    .preview-card p {
        margin: 0;
        color: rgba(248, 251, 255, 0.75);
        line-height: 1.6;
    }

    .preview-tags {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .preview-tags li {
        padding: 0.45rem 0.85rem;
        border-radius: 999px;
        background: rgba(60, 123, 255, 0.25);
        border: 1px solid rgba(158, 203, 255, 0.35);
        font-size: 0.85rem;
    }

    .preview-link {
        color: #9ecbff;
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
    }

    .preview-link:hover {
        text-decoration: underline;
    }

    .featured-section,
    .guidance-section {
        background: linear-gradient(135deg, rgba(8, 19, 35, 0.95), rgba(28, 11, 54, 0.9));
        border-radius: 28px;
        padding: 3rem;
        box-shadow: 0 24px 60px rgba(5, 13, 24, 0.28);
        color: #f8fbff;
    }

    .section-header {
        max-width: 70ch;
        margin-bottom: 2rem;
    }

    .section-header h2 {
        margin: 0;
        font-size: clamp(2rem, 3vw, 2.5rem);
        color: #f8fbff;
    }

    .section-header p {
        margin-top: 0.75rem;
        color: rgba(248, 251, 255, 0.7);
        font-size: 1rem;
        line-height: 1.6;
    }

    .loading-state,
    .error-message,
    .empty-state {
        text-align: center;
        padding: 2rem;
        font-size: 1.05rem;
        color: rgba(248, 251, 255, 0.75);
    }

    .error-message {
        color: #ff7675;
        background: rgba(255, 118, 117, 0.12);
        border-radius: 16px;
    }

    .games-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
    }

    .game-card {
        border-radius: 18px;
        cursor: pointer;
        overflow: hidden;
        background: rgba(6, 14, 33, 0.85);
        color: #f8fbff;
        display: flex;
        flex-direction: column;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        box-shadow: 0 20px 50px rgba(5, 13, 24, 0.35);
        border: 1px solid rgba(158, 203, 255, 0.2);
    }

    .game-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 26px 60px rgba(5, 13, 24, 0.45);
    }

    .game-image {
        width: 100%;
        height: 180px;
        object-fit: cover;
    }

    .game-details {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .game-details h3 {
        margin: 0;
        font-size: 1.3rem;
    }

    .game-details p {
        margin: 0;
        color: rgba(248, 251, 255, 0.75);
        line-height: 1.5;
        min-height: 4rem;
    }

    .game-meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
    }

    .game-meta dt {
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.7;
        margin-bottom: 0.35rem;
    }

    .game-meta dd {
        margin: 0;
        font-weight: 600;
    }

    .guidance-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2.5rem;
    }

    .guidance-card,
    .tips-card {
        background: rgba(5, 13, 24, 0.65);
        border-radius: 20px;
        padding: 2.25rem;
        box-shadow: inset 0 0 0 1px rgba(158, 203, 255, 0.12);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
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
        background: rgba(8, 19, 35, 0.85);
        padding: 1rem 1.25rem;
        border-radius: 16px;
        line-height: 1.5;
        border: 1px solid rgba(158, 203, 255, 0.12);
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

    .tips-card h2 {
        margin: 0;
        font-size: 1.6rem;
    }

    .tips-lead {
        margin: 0;
        color: rgba(248, 251, 255, 0.7);
        line-height: 1.6;
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
        background: rgba(8, 19, 35, 0.85);
        padding: 0.85rem 1.1rem;
        border-radius: 14px;
        align-items: flex-start;
        line-height: 1.5;
        border: 1px solid rgba(158, 203, 255, 0.12);
    }

    .tips-list .checkmark {
        font-size: 1.2rem;
        color: #63e6be;
        line-height: 1.2;
    }

    @media (min-width: 960px) {
        .hero {
            grid-template-columns: 3fr 2fr;
            align-items: center;
        }
    }

    @media (max-width: 768px) {
        .hero,
        .featured-section,
        .guidance-section {
            padding: 2.2rem;
            border-radius: 22px;
        }

        .hero-actions {
            flex-direction: column;
            align-items: stretch;
        }

        .hero-metrics {
            flex-direction: column;
        }

        .games-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
