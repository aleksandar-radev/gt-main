<template>
    <div class="privacy-container">
        <header class="privacy-header">
            <h1>{{ t('privacy.title') }}</h1>
            <p class="privacy-revision">{{ t('privacy.updated', { date: formattedRevisionDate }) }}</p>
            <p class="privacy-intro">{{ t('privacy.intro') }}</p>
        </header>

        <section class="privacy-section">
            <h2>{{ t('privacy.collection.title') }}</h2>
            <p>{{ t('privacy.collection.intro') }}</p>
            <ul>
                <li>{{ t('privacy.collection.list.account') }}</li>
                <li>{{ t('privacy.collection.list.usage') }}</li>
                <li>{{ t('privacy.collection.list.feedback') }}</li>
            </ul>
        </section>

        <section class="privacy-section">
            <h2>{{ t('privacy.usage.title') }}</h2>
            <p>{{ t('privacy.usage.paragraph1') }}</p>
            <p>{{ t('privacy.usage.paragraph2') }}</p>
        </section>

        <section class="privacy-section">
            <h2>{{ t('privacy.sharing.title') }}</h2>
            <p>{{ t('privacy.sharing.paragraph') }}</p>
            <ul>
                <li>{{ t('privacy.sharing.list.serviceProviders') }}</li>
                <li>{{ t('privacy.sharing.list.legal') }}</li>
                <li>{{ t('privacy.sharing.list.business') }}</li>
            </ul>
        </section>

        <section class="privacy-section">
            <h2>{{ t('privacy.cookies.title') }}</h2>
            <p>{{ t('privacy.cookies.paragraph1') }}</p>
            <p>{{ t('privacy.cookies.paragraph2') }}</p>
        </section>

        <section class="privacy-section">
            <h2>{{ t('privacy.rights.title') }}</h2>
            <p>{{ t('privacy.rights.intro') }}</p>
            <ul>
                <li>{{ t('privacy.rights.list.access') }}</li>
                <li>{{ t('privacy.rights.list.update') }}</li>
                <li>{{ t('privacy.rights.list.delete') }}</li>
                <li>{{ t('privacy.rights.list.withdraw') }}</li>
            </ul>
        </section>

        <section class="privacy-section">
            <h2>{{ t('privacy.retention.title') }}</h2>
            <p>{{ t('privacy.retention.paragraph') }}</p>
        </section>

        <section class="privacy-section">
            <h2>{{ t('privacy.contact.title') }}</h2>
            <p>{{ t('privacy.contact.description') }}</p>
            <p class="privacy-contact">
                <strong>{{ t('privacy.contact.emailLabel') }}:</strong>
                <a href="mailto:privacy@gtplatform.example">alexander.radev.96@gmail.com</a>
            </p>
        </section>

        <section class="privacy-section">
            <h2>{{ t('privacy.changes.title') }}</h2>
            <p>{{ t('privacy.changes.paragraph') }}</p>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useI18n } from '@/plugins/i18n';

    const { t, state } = useI18n();
    const revisionDateISO = '2025-01-10T00:00:00Z';

    const formattedRevisionDate = computed(() => {
        try {
            return new Intl.DateTimeFormat(state.locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date(revisionDateISO));
        } catch (error) {
            console.warn('Failed to format revision date', error);
            return '2025-01-10';
        }
    });
</script>

<style scoped>
    .privacy-container {
        max-width: 840px;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
        color: var(--color-text, #f5f5f5);
    }

    .privacy-header {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    .privacy-header h1 {
        font-size: 2.2rem;
        margin-bottom: 0.5rem;
        color: #96aabe;
    }

    .privacy-revision {
        margin: 0.25rem 0 1.5rem;
        font-size: 0.95rem;
        color: #b5c6d7;
    }

    .privacy-intro {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.7;
    }

    .privacy-section {
        background: rgba(255, 255, 255, 0.05);
        padding: 1.75rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        margin-bottom: 1.75rem;
        backdrop-filter: blur(6px);
    }

    .privacy-section h2 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #f7f9fb;
        font-size: 1.35rem;
    }

    .privacy-section p {
        margin: 0 0 1rem;
        line-height: 1.65;
        color: #e0e6ed;
    }

    .privacy-section ul {
        padding-left: 1.25rem;
        margin: 0;
        color: #d1dae4;
        line-height: 1.7;
    }

    .privacy-section li + li {
        margin-top: 0.5rem;
    }

    .privacy-contact a {
        color: #6fb7ff;
        text-decoration: none;
    }

    .privacy-contact a:hover,
    .privacy-contact a:focus {
        text-decoration: underline;
    }

    @media (max-width: 640px) {
        .privacy-container {
            padding: 1.5rem 1rem 3rem;
        }

        .privacy-section {
            padding: 1.4rem;
        }

        .privacy-header h1 {
            font-size: 1.8rem;
        }
    }
</style>
