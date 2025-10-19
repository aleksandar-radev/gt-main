<template>
    <div class="about-view">
        <section class="about-hero">
            <p class="hero-eyebrow">{{ t('about.heroEyebrow') }}</p>
            <h1>{{ t('about.title') }}</h1>
            <p class="hero-lead">{{ t('about.heroLead') }}</p>
            <div class="hero-actions">
                <a class="hero-link" href="mailto:alexander.radev.96@gmail.com">{{ t('about.emailLabel') }}</a>
                <a class="hero-link" href="https://discord.gg/8rgwg2zzqc" target="_blank">{{ t('about.discordLabel') }}</a>
            </div>
            <ul class="hero-highlights">
                <li v-for="(item, index) in heroHighlights" :key="index">{{ item }}</li>
            </ul>
        </section>

        <section class="about-grid">
            <article class="panel mission">
                <h2>{{ t('about.missionTitle') }}</h2>
                <p>{{ t('about.mission') }}</p>
            </article>
            <article class="panel story">
                <h2>{{ t('about.storyTitle') }}</h2>
                <p>{{ t('about.story') }}</p>
                <p>{{ t('about.story2') }}</p>
            </article>
            <article class="panel features">
                <h2>{{ t('about.featuresTitle') }}</h2>
                <ul class="features-list">
                    <li><strong>{{ t('about.featureDiscovery') }}</strong></li>
                    <li><strong>{{ t('about.featureReviews') }}</strong></li>
                    <li><strong>{{ t('about.featureDiscussion') }}</strong></li>
                    <li><strong>{{ t('about.featureTracking') }}</strong></li>
                </ul>
            </article>
        </section>

        <section class="values-section">
            <h2>{{ t('about.valuesTitle') }}</h2>
            <div class="values-grid">
                <article v-for="(value, index) in values" :key="index" class="value-card">
                    <h3>{{ value.title }}</h3>
                    <p>{{ value.body }}</p>
                </article>
            </div>
        </section>

        <section class="timeline-section">
            <h2>{{ t('about.timelineTitle') }}</h2>
            <div class="timeline">
                <div v-for="(entry, index) in timeline" :key="index" class="timeline-item">
                    <span class="timeline-dot"></span>
                    <div class="timeline-content">
                        <h3>{{ entry.title }}</h3>
                        <p>{{ entry.body }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="contact-section">
            <h2>{{ t('about.contactTitle') }}</h2>
            <p class="contact-lead">{{ t('about.contact') }}</p>
            <div class="contact-grid">
                <article class="contact-card">
                    <h3>{{ t('about.emailLabel') }}</h3>
                    <a href="mailto:alexander.radev.96@gmail.com">alexander.radev.96@gmail.com</a>
                    <p>{{ t('about.ctaEmail') }}</p>
                </article>
                <article class="contact-card">
                    <h3>{{ t('about.discordLabel') }}</h3>
                    <a href="https://discord.gg/8rgwg2zzqc" target="_blank">{{ t('about.joinServer') }}</a>
                    <p>{{ t('about.ctaDiscord') }}</p>
                </article>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from '@/plugins/i18n';
    import { computed } from 'vue';

    const { t } = useI18n();

    const heroHighlights = computed(() => [
        t('about.heroHighlight1'),
        t('about.heroHighlight2'),
        t('about.heroHighlight3'),
    ]);

    const values = computed(() => [
        { title: t('about.value1Title'), body: t('about.value1Body') },
        { title: t('about.value2Title'), body: t('about.value2Body') },
        { title: t('about.value3Title'), body: t('about.value3Body') },
    ]);

    const timeline = computed(() => [
        { title: t('about.timelineStartTitle'), body: t('about.timelineStartBody') },
        { title: t('about.timelinePresentTitle'), body: t('about.timelinePresentBody') },
        { title: t('about.timelineFutureTitle'), body: t('about.timelineFutureBody') },
    ]);
</script>

<style scoped>
    .about-view {
        display: flex;
        flex-direction: column;
        gap: 3.5rem;
        padding-bottom: 3rem;
    }

    .about-hero {
        background: radial-gradient(circle at top, rgba(60, 123, 255, 0.35), rgba(18, 5, 45, 0.95));
        padding: 3.5rem;
        border-radius: 28px;
        color: #f4f6fb;
        box-shadow: 0 30px 70px rgba(5, 13, 24, 0.35);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .hero-eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.26em;
        font-size: 0.75rem;
        color: rgba(158, 203, 255, 0.85);
    }

    h1 {
        margin: 0;
        font-size: clamp(2.4rem, 4vw, 3.4rem);
        line-height: 1.1;
    }

    .hero-lead {
        margin: 0;
        max-width: 70ch;
        font-size: 1.1rem;
        color: rgba(244, 246, 251, 0.78);
        line-height: 1.7;
    }

    .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .hero-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        border-radius: 999px;
        background: rgba(244, 246, 251, 0.12);
        color: #f4f6fb;
        text-decoration: none;
        font-weight: 600;
        border: 1px solid rgba(244, 246, 251, 0.3);
        transition: background 0.2s ease, transform 0.2s ease;
    }

    .hero-link:hover {
        background: rgba(244, 246, 251, 0.22);
        transform: translateY(-2px);
    }

    .hero-highlights {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.75rem;
    }

    .hero-highlights li {
        background: rgba(9, 18, 38, 0.55);
        border-radius: 16px;
        padding: 0.85rem 1.1rem;
        border: 1px solid rgba(158, 203, 255, 0.2);
    }

    .about-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 2rem;
    }

    .panel {
        background: linear-gradient(140deg, rgba(6, 14, 33, 0.9), rgba(28, 11, 54, 0.85));
        border-radius: 24px;
        padding: 2.5rem;
        box-shadow: 0 22px 55px rgba(5, 13, 24, 0.3);
        color: #f8fbff;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .panel h2 {
        margin: 0;
        font-size: 1.75rem;
    }

    .panel p {
        margin: 0;
        line-height: 1.6;
        color: rgba(248, 251, 255, 0.75);
    }

    .features-list {
        padding-left: 1.2rem;
        margin: 0;
        display: grid;
        gap: 0.75rem;
    }

    .features-list li {
        line-height: 1.5;
    }

    .values-section {
        background: linear-gradient(150deg, rgba(8, 19, 35, 0.95), rgba(46, 22, 85, 0.9));
        padding: 3rem;
        border-radius: 28px;
        box-shadow: 0 24px 60px rgba(5, 13, 24, 0.28);
        color: #f8fbff;
    }

    .values-section h2 {
        margin-top: 0;
        margin-bottom: 2rem;
        font-size: clamp(2rem, 3vw, 2.5rem);
    }

    .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.75rem;
    }

    .value-card {
        background: rgba(5, 13, 24, 0.7);
        border-radius: 20px;
        padding: 1.75rem;
        border: 1px solid rgba(158, 203, 255, 0.18);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .value-card h3 {
        margin: 0;
        color: #9ecbff;
    }

    .value-card p {
        margin: 0;
        color: rgba(248, 251, 255, 0.75);
        line-height: 1.6;
    }

    .timeline-section {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background: linear-gradient(160deg, rgba(6, 14, 33, 0.9), rgba(28, 11, 54, 0.9));
        padding: 3rem;
        border-radius: 28px;
        box-shadow: 0 24px 60px rgba(5, 13, 24, 0.28);
        color: #f8fbff;
    }

    .timeline-section h2 {
        margin: 0;
        font-size: clamp(2rem, 3vw, 2.4rem);
    }

    .timeline {
        position: relative;
        padding-left: 2rem;
        display: grid;
        gap: 1.75rem;
    }

    .timeline::before {
        content: '';
        position: absolute;
        left: 0.75rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(180deg, rgba(158, 203, 255, 0.2), rgba(158, 203, 255, 0.6));
    }

    .timeline-item {
        position: relative;
        display: flex;
        gap: 1.5rem;
    }

    .timeline-dot {
        position: absolute;
        left: -1.2rem;
        top: 0.35rem;
        width: 12px;
        height: 12px;
        border-radius: 999px;
        background: #63e6be;
        box-shadow: 0 0 0 4px rgba(99, 230, 190, 0.18);
    }

    .timeline-content h3 {
        margin: 0 0 0.5rem 0;
        color: #9ecbff;
    }

    .timeline-content p {
        margin: 0;
        line-height: 1.6;
        color: rgba(248, 251, 255, 0.75);
    }

    .contact-section {
        background: radial-gradient(circle at top right, rgba(99, 230, 190, 0.2), rgba(8, 19, 35, 0.9));
        padding: 3rem;
        border-radius: 28px;
        box-shadow: 0 24px 60px rgba(5, 13, 24, 0.28);
        color: #f8fbff;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .contact-section h2 {
        margin: 0;
        font-size: clamp(2rem, 3vw, 2.4rem);
    }

    .contact-lead {
        margin: 0;
        color: rgba(248, 251, 255, 0.75);
        max-width: 60ch;
        line-height: 1.6;
    }

    .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.75rem;
    }

    .contact-card {
        background: rgba(5, 13, 24, 0.75);
        border-radius: 20px;
        padding: 1.75rem;
        border: 1px solid rgba(158, 203, 255, 0.18);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .contact-card h3 {
        margin: 0;
        color: #9ecbff;
    }

    .contact-card a {
        color: #63e6be;
        font-weight: 600;
        text-decoration: none;
    }

    .contact-card a:hover {
        text-decoration: underline;
    }

    .contact-card p {
        margin: 0;
        color: rgba(248, 251, 255, 0.7);
        line-height: 1.6;
    }

    @media (max-width: 768px) {
        .about-hero,
        .values-section,
        .timeline-section,
        .contact-section {
            padding: 2.2rem;
            border-radius: 22px;
        }

        .about-grid {
            gap: 1.5rem;
        }

        .panel {
            padding: 2rem;
        }
    }
</style>
