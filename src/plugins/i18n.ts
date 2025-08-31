import { inject, reactive } from 'vue';
import type { App } from 'vue';

export type Messages = Record<string, Record<string, string>>;

const I18N_SYMBOL = Symbol('i18n');

export interface I18nOptions {
    locale: string;
    messages: Messages;
}

function createI18n(options: I18nOptions) {
    const state = reactive({
        locale: options.locale,
        messages: options.messages,
    });

    const t = (key: string, vars?: Record<string, string | number>): string => {
        const msg = state.messages[state.locale]?.[key] || key;
        return msg.replace(/\{(\w+)\}/g, (_, k) => String(vars?.[k] ?? ''));
    };

    const setLocale = (locale: string) => {
        if (state.messages[locale]) {
            state.locale = locale;
        }
    };

    return { t, setLocale, state };
}

export const i18nPlugin = {
    install(app: App, options: I18nOptions) {
        const i18n = createI18n(options);
        app.provide(I18N_SYMBOL, i18n);
        app.config.globalProperties.$t = i18n.t;
    },
};

export function useI18n() {
    const i18n = inject(I18N_SYMBOL) as ReturnType<typeof createI18n> | undefined;
    if (!i18n) {
        throw new Error('i18n plugin not installed');
    }
    return i18n;
}
