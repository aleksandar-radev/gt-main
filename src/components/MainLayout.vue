<template>
    <div class="website-container">
        <!-- Navigation Header -->
        <nav class="header">
            <router-link to="/" class="logo">
                <img width="150px" src="/main-logo-wide-transparent.png" alt="Company Logo" />
            </router-link>
            <div class="nav-links">
                <router-link to="/games" class="nav-link">{{ t('main.games') }}</router-link>
                <router-link to="/about" class="nav-link">{{ t('main.about') }}</router-link>
                <router-link to="/feedback" class="nav-link">{{ t('main.feedback') }}</router-link>
                <!-- Admin-only link -->
                <router-link
                    v-if="authStore.user && authStore.user.role === 'admin'"
                    to="/admin/feedback"
                    class="nav-link admin-link"
                >
                    {{ t('main.manageFeedback') }}
                </router-link>
                <router-link
                    v-if="authStore.user && authStore.user.role === 'admin'"
                    to="/admin/games"
                    class="nav-link admin-link"
                >
                    {{ t('main.manageGames') }}
                </router-link>
            </div>
            <div class="auth-section">
                <!-- Show user info and logout button when logged in -->
                <template v-if="authStore.user">
                    <span class="username">{{ t('main.whatsUp', { name: authStore.user?.username ?? '' }) }}</span>
                    <button class="logout-btn" @click="handleLogout">{{ t('main.logout') }}</button>
                </template>
                <!-- Show login/register links when logged out -->
                <template v-else>
                    <router-link to="/login" class="auth-link">{{ t('main.login') }}</router-link>
                    <router-link to="/register" class="auth-link">{{ t('main.register') }}</router-link>
                </template>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <router-view></router-view>
        </main>

        <CookieConsentBanner
            :visible="showConsentBanner"
            @accept="handleConsentAccept"
            @decline="handleConsentDecline"
        />

        <!-- Footer (Slimmer Version) -->
        <footer class="footer">
            <div class="slim-footer-content">
                <div ref="langWrapper" class="language-selector">
                    <button
                        ref="langButton"
                        class="lang-trigger"
                        :aria-expanded="isLangOpen ? 'true' : 'false'"
                        aria-haspopup="listbox"
                        @click="toggleLangMenu"
                    >
                        <span
                            v-if="currentLanguage && currentLanguage.flag"
                            :class="['fi', `fi-${currentLanguage.flag}`]"
                            aria-hidden="true"
                        ></span>
                        <span class="lang-trigger-label">{{ currentLanguageLabel }}</span>
                        <span class="chevron" :class="{ open: isLangOpen }">▾</span>
                    </button>
                    <div v-if="isLangOpen" ref="langDropdown" class="lang-dropdown" :class="{ up: openUp }">
                        <input
                            ref="langSearchInput"
                            v-model="languageSearch"
                            type="text"
                            class="lang-search-input"
                            placeholder="Search..."
                            @keydown.down.prevent="move(1)"
                            @keydown.up.prevent="move(-1)"
                            @keydown.esc.prevent="closeLangMenu()"
                        />
                        <ul
                            class="lang-options"
                            role="listbox"
                            :aria-activedescendant="activeOptionId || undefined"
                            @keydown.down.prevent="move(1)"
                            @keydown.up.prevent="move(-1)"
                            @keydown.enter.prevent="chooseActive()"
                            @keydown.esc.prevent="closeLangMenu()"
                        >
                            <li
                                v-for="(lang, idx) in filteredLanguages"
                                :id="`lang-opt-${lang.code}`"
                                :key="lang.code"
                                role="option"
                                :aria-selected="selectedLang === lang.code"
                                :class="[
                                    'lang-option',
                                    {
                                        active: idx === hoverIndex,
                                        selected: selectedLang === lang.code,
                                    },
                                ]"
                                @click="chooseLanguage(lang.code)"
                                @mouseenter="hoverIndex = idx"
                            >
                                <span :class="['fi', `fi-${lang.flag}`]" aria-hidden="true"></span>
                                <span class="lang-label">{{ lang.labelText }}</span>
                            </li>
                            <li v-if="filteredLanguages.length === 0" class="lang-option empty" aria-disabled="true">
                                {{ noResultsText }}
                            </li>
                        </ul>
                    </div>
                </div>
                <p class="copyright">{{ t('main.copyright') }}</p>
                <div class="social-links">
                    <router-link to="/privacy">{{ t('main.privacy') }}</router-link>
                    <a href="https://discord.gg/8rgwg2zzqc" target="_blank" rel="noopener">{{ t('main.discord') }}</a>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore';
    import { useConsentStore } from '@/stores/consentStore';
    import { useRouter } from 'vue-router';
    import { onMounted, ref, watch, computed, nextTick } from 'vue';
    import { useI18n } from '@/plugins/i18n';
    import 'flag-icons/css/flag-icons.min.css';
    import CookieConsentBanner from '@/components/CookieConsentBanner.vue';

    const authStore = useAuthStore();
    const consentStore = useConsentStore();
    const router = useRouter();
    const { t, setLocale, state } = useI18n();

    interface LanguageOption {
        code: string; // locale key
        labelText: string; // human readable label
        flag: string; // ISO 3166-1 alpha-2 (lowercase) used by flag-icons
    }

    const languages: LanguageOption[] = [
        { code: 'en', labelText: 'English', flag: 'gb' },
        { code: 'es', labelText: 'Español', flag: 'es' },
        { code: 'fr', labelText: 'Français', flag: 'fr' },
        { code: 'de', labelText: 'Deutsch', flag: 'de' },
        { code: 'zh', labelText: '中文', flag: 'cn' },
    ];

    const selectedLang = ref(state.locale);
    const languageSearch = ref('');
    const filteredLanguages = computed(() => {
        const term = languageSearch.value.trim().toLowerCase();
        if (!term) return languages;
        return languages.filter((l) => l.code.toLowerCase().includes(term) || l.labelText.toLowerCase().includes(term));
    });

    // Custom dropdown state & behaviors
    const isLangOpen = ref(false);
    const hoverIndex = ref(-1);
    const langWrapper = ref<HTMLElement | null>(null);
    const langSearchInput = ref<HTMLInputElement | null>(null);
    const langButton = ref<HTMLButtonElement | null>(null);
    const langDropdown = ref<HTMLElement | null>(null);
    const openUp = ref(false);
    const activeOptionId = computed(() => {
        const item = filteredLanguages.value[hoverIndex.value];
        return item ? `lang-opt-${item.code}` : undefined;
    });

    const currentLanguage = computed(() => languages.find((l) => l.code === selectedLang.value));
    const currentLanguageLabel = computed(() => currentLanguage.value?.labelText || selectedLang.value);
    const showConsentBanner = consentStore.shouldPrompt;

    const adjustDropdownDirection = () => {
        if (!langButton.value || !langDropdown.value) return;
        const btnRect = langButton.value.getBoundingClientRect();
        const ddRect = langDropdown.value.getBoundingClientRect();
        const spaceBelow = window.innerHeight - btnRect.bottom;
        const spaceAbove = btnRect.top;
        openUp.value = spaceBelow < ddRect.height + 8 && spaceAbove > ddRect.height;
    };
    const openLangMenu = () => {
        if (isLangOpen.value) return;
        isLangOpen.value = true;
        languageSearch.value = '';
        hoverIndex.value = filteredLanguages.value.findIndex((l) => l.code === selectedLang.value);
        requestAnimationFrame(async () => {
            await nextTick();
            adjustDropdownDirection();
            langSearchInput.value?.focus();
        });
        addOutsideListener();
        window.addEventListener('resize', adjustDropdownDirection, { passive: true });
        window.addEventListener('scroll', adjustDropdownDirection, { passive: true });
    };
    const closeLangMenu = () => {
        if (!isLangOpen.value) return;
        isLangOpen.value = false;
        removeOutsideListener();
        langButton.value?.focus();
        window.removeEventListener('resize', adjustDropdownDirection);
        window.removeEventListener('scroll', adjustDropdownDirection);
    };
    const toggleLangMenu = () => (isLangOpen.value ? closeLangMenu() : openLangMenu());

    const move = (dir: number) => {
        if (!isLangOpen.value) return;
        const list = filteredLanguages.value;
        if (!list.length) return;
        let idx = hoverIndex.value;
        if (idx < 0) idx = list.findIndex((l) => l.code === selectedLang.value);
        idx = (idx + dir + list.length) % list.length;
        hoverIndex.value = idx;
        // ensure visible (simple scroll into view)
        const code = list[idx].code;
        const el = document.getElementById(`lang-opt-${code}`);
        el?.scrollIntoView({ block: 'nearest' });
    };
    const chooseActive = () => {
        if (hoverIndex.value >= 0 && hoverIndex.value < filteredLanguages.value.length) {
            chooseLanguage(filteredLanguages.value[hoverIndex.value].code);
        }
    };
    const chooseLanguage = (code: string) => {
        selectedLang.value = code;
        closeLangMenu();
    };
    const noResultsText = computed(() => (t ? t('main.noResults') || 'No results' : 'No results'));

    const onClickOutside = (e: Event) => {
        if (!langWrapper.value) return;
        if (!langWrapper.value.contains(e.target as Node)) {
            closeLangMenu();
        }
    };
    const addOutsideListener = () => document.addEventListener('mousedown', onClickOutside);
    const removeOutsideListener = () => document.removeEventListener('mousedown', onClickOutside);
    onMounted(() => {
        // cleanup on unmount
        return () => removeOutsideListener();
    });

    watch(selectedLang, (newLocale) => {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
    });

    // Check authentication status when component mounts
    onMounted(async () => {
        try {
            await authStore.getCurrentUser();
            // console.log('Current user:', authStore.user);
        } catch (error) {
            console.error('Failed to get current user:', error);
        }
    });

    const handleLogout = () => {
        authStore.logout();
        router.push('/login');
    };

    const handleConsentAccept = () => {
        consentStore.accept();
    };

    const handleConsentDecline = () => {
        consentStore.decline();
    };
</script>

<style scoped>
    /* Styles remain unchanged */
    .website-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #1a1a1a;
        color: white;
    }

    .nav-links {
        display: flex;
        gap: 2rem;
    }

    .nav-link,
    .auth-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
    }

    .nav-link.router-link-active {
        color: #3498db;
        font-weight: bold;
    }

    .auth-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .username {
        color: white;
        font-weight: bold;
    }

    .logout-btn {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .logout-btn:hover {
        background-color: #c0392b;
    }

    .main-content {
        flex: 1;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
    }

    /* New slimmer footer styles */
    .footer {
        background-color: #1a1a1a;
        color: white;
        padding: 1rem 2rem;
        margin-top: auto;
    }

    .slim-footer-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .language-selector {
        position: relative;
    }
    .lang-trigger {
        background: #1a1a1a;
        color: #fff;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 0.4rem 0.6rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.85rem;
    }
    .lang-trigger:hover,
    .lang-trigger:focus {
        border-color: #3498db;
        outline: none;
    }
    .lang-trigger .chevron {
        transition: transform 0.2s;
    }
    .lang-trigger .chevron.open {
        transform: rotate(180deg);
    }
    .lang-dropdown {
        position: absolute;
        top: 110%;
        left: 0;
        background: #1a1a1a;
        border: 1px solid #444;
        border-radius: 6px;
        padding: 0.5rem;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        width: 200px;
        z-index: 30;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        max-height: 260px;
    }
    .lang-dropdown.up {
        top: auto;
        bottom: 110%;
    }
    .lang-search-input {
        background: #111;
        color: #fff;
        border: 1px solid #333;
        border-radius: 4px;
        padding: 0.35rem 0.5rem;
        font-size: 0.8rem;
    }
    .lang-search-input:focus {
        outline: 1px solid #3498db;
    }
    .lang-options {
        list-style: none;
        margin: 0;
        padding: 0;
        overflow-y: auto;
        scrollbar-width: thin;
        max-height: 180px; /* fixed scrollable area */
    }
    .lang-option {
        padding: 0.35rem 0.45rem;
        cursor: pointer;
        border-radius: 4px;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }
    .lang-option .fi {
        font-size: 1rem;
    }
    .lang-trigger .fi {
        font-size: 1rem;
    }
    .lang-trigger-label {
        white-space: nowrap;
    }
    .lang-option:hover,
    .lang-option.active {
        background: #242b33;
    }
    .lang-option.selected {
        background: #3498db33;
    }
    .lang-option.empty {
        cursor: default;
        opacity: 0.7;
    }

    .social-links {
        display: flex;
        gap: 1rem;
    }

    .social-links a {
        color: #ccc;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
    }

    .social-links a:hover {
        color: #3498db;
    }

    .copyright {
        font-size: 0.8rem;
        color: #888;
        margin: 0;
    }

    @media (max-width: 768px) {
        .language-selector,
        .social-links {
            flex-wrap: wrap;
            justify-content: center;
        }

        .nav-links {
            display: none;
        }
    }

    .admin-link {
        background-color: #e74c3c;
        border-radius: 4px;
        padding: 0.3rem 0.7rem;
        font-weight: bold;
    }

    .admin-link:hover {
        background-color: #c0392b;
    }
</style>
