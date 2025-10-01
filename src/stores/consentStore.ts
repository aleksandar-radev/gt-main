import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import type { ConsentState } from '@/types';
import { disableAnalytics, enableAnalytics } from '@/services/analytics';

export const CONSENT_COOKIE_KEY = 'gt-consent';
export const CONSENT_VERSION = '2025-01-10';

function readConsentFromCookie(): ConsentState | null {
    const rawValue = Cookies.get(CONSENT_COOKIE_KEY);
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawValue) as ConsentState;
        if (parsed.version !== CONSENT_VERSION) {
            Cookies.remove(CONSENT_COOKIE_KEY);
            return null;
        }
        return parsed;
    } catch (error) {
        console.warn('Failed to parse consent cookie', error);
        Cookies.remove(CONSENT_COOKIE_KEY);
        return null;
    }
}

function persistConsent(value: ConsentState | null) {
    if (!value) {
        Cookies.remove(CONSENT_COOKIE_KEY);
        return;
    }

    Cookies.set(CONSENT_COOKIE_KEY, JSON.stringify(value), {
        expires: 180,
        sameSite: 'Lax',
    });
}

export const useConsentStore = defineStore('consent', () => {
    const record = ref<ConsentState | null>(readConsentFromCookie());

    const shouldPrompt = computed(() => record.value === null);
    const hasConsented = computed(() => record.value?.accepted === true);
    const hasDeclined = computed(() => record.value?.accepted === false);

    const applySideEffects = () => {
        if (hasConsented.value) {
            enableAnalytics();
        } else {
            disableAnalytics();
        }
    };

    if (record.value) {
        applySideEffects();
    }

    const updateConsent = (accepted: boolean) => {
        const value: ConsentState = {
            accepted,
            version: CONSENT_VERSION,
            timestamp: new Date().toISOString(),
        };
        record.value = value;
        persistConsent(value);
        applySideEffects();
    };

    const resetConsent = () => {
        record.value = null;
        persistConsent(null);
        disableAnalytics();
    };

    return {
        record,
        shouldPrompt,
        hasConsented,
        hasDeclined,
        updateConsent,
        accept: () => updateConsent(true),
        decline: () => updateConsent(false),
        resetConsent,
    };
});
