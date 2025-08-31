<template>
    <div class="about-container">
        <h1>{{ t('about.title') }}</h1>

        <div class="about-content">
            <section class="about-section">
                <h2>{{ t('about.missionTitle') }}</h2>
                <p>{{ t('about.mission') }}</p>
            </section>

            <section class="about-section">
                <h2>{{ t('about.storyTitle') }}</h2>
                <p>{{ t('about.story') }}</p>
                <p>{{ t('about.story2') }}</p>
            </section>

            <section class="about-section">
                <h2>{{ t('about.featuresTitle') }}</h2>
                <ul class="features-list">
                    <li>
                        <strong>{{ t('about.featureDiscovery') }}</strong>
                    </li>
                    <li>
                        <strong>{{ t('about.featureReviews') }}</strong>
                    </li>
                    <li>
                        <strong>{{ t('about.featureDiscussion') }}</strong>
                    </li>
                    <li>
                        <strong>{{ t('about.featureTracking') }}</strong>
                    </li>
                </ul>
            </section>

            <section class="about-section">
                <h2>{{ t('about.contactTitle') }}</h2>
                <p>{{ t('about.contact') }}</p>
                <p>
                    Email:
                    <a href="mailto:alexander.radev.96@gmail.com">alexander.radev.96@gmail.com</a>
                    <br />
                    Discord:
                    <a href="https://discord.gg/8rgwg2zzqc" target="_blank">Join our server</a>
                </p>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from '@/plugins/i18n';
    const { t } = useI18n();
</script>

<style scoped>
    .about-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: #96aabe;
    }

    .about-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .about-section {
        background-color: rgb(179, 177, 177);
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    h2 {
        color: #f7f7f7;
        margin-top: 0;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
    }

    p {
        line-height: 1.6;
        color: var(--color-text);
    }

    .features-list {
        padding-left: 1.5rem;
    }

    .features-list li {
        margin-bottom: 1rem;
        line-height: 1.4;
    }

    a {
        color: #0e3e5e;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .about-container {
            padding: 1rem;
        }

        .about-section {
            padding: 1rem;
        }
    }
</style>
