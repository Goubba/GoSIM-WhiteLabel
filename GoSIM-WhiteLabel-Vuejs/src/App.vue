<template>
  <!-- Desktop Header Navbar -->
  <header v-if="showHeader"
    class="hidden md:block py-3 px-4 bg-white sticky top-0 inset-x-0 z-50 border-b border-gray-200">
    <nav class="flex items-center justify-between max-w-6xl mx-auto">
      <!-- Logo -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center">
          <img src="/src/assets/logo.png" alt="GoSIM" class="h-10 w-auto" />
        </router-link>
      </div>
      <div class="flex items-center justify-between gap-2">
        <!-- Desktop Navigation Menu -->
        <div class="hidden md:flex items-center space-x-5 font-medium">
        </div>
        <!-- Language Selector -->
        <select :value="currentLanguage" @change="selectLanguage($event.target.value)"
          class="bg-transparent border-none outline-none focus:ring-0 cursor-pointer pr-1 text-xs py-2">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.icon }} {{ lang.name }}
          </option>
        </select>
      </div>
    </nav>
  </header>

  <!-- Main Content -->
  <main class="max-w-6xl mx-auto p-4">
    <router-view />
  </main>

  <!-- Desktop Footer -->
  <DesktopFooter v-if="showFooter" />


</template>

<script>
import DesktopFooter from "@/components/DesktopFooter.vue";
import { useIndexStore } from '@/stores/index';

export default {
  name: 'App',
  components: {
    DesktopFooter,
  },
  data() {
    return {
      loading: false
    }
  },

  computed: {
    showHeader() {
      return useIndexStore().header;
    },
    showFooter() {
      return useIndexStore().footer;
    },
    currentLanguage() {
      return this.$i18n.locale;
    },
    languages() {
      return [
        {
          code: "ar",
          name: "العربية",
          icon: "🇩🇿",
        },
        {
          code: "fr",
          name: "Français",
          icon: "🇫🇷",
        },
        {
          code: "en",
          name: "English",
          icon: "🇺🇸",
        },
      ];
    },
  },
  mounted() {
    this.appStore.initializePreferences();

    const urlParams = new URLSearchParams(window.location.search);
    const indexStore = useIndexStore();

    if (urlParams.has('language')) {
      const lang = urlParams.get('language');
      if (['ar', 'en', 'fr'].includes(lang)) {
        this.selectLanguage(lang);
      }
    }
    if (urlParams.has('api-key')) {
      indexStore.setPublicKey(urlParams.get('api-key'));
    }
    if (urlParams.has('header')) {
      indexStore.setHeader(urlParams.get('header'));
    }
    if (urlParams.has('footer')) {
      indexStore.setFooter(urlParams.get('footer'));
    }
    if (urlParams.has('color')) {
      indexStore.setColor(urlParams.get('color'));
    } else if (indexStore.color) {
      indexStore.setColor(indexStore.color);
    }
    if (urlParams.has('host')) {
      indexStore.setHost(urlParams.get('host'));
    }
    if (urlParams.has('currency')) {
      const curr = urlParams.get('currency');
      indexStore.setCurrency(curr);
      if (this.appStore && typeof this.appStore.updateCurrency === 'function') {
        this.appStore.updateCurrency(curr.toLowerCase());
      }
    }

    const langAttribute = this.currentLanguage === 'ar' ? 'ar-DZ' : this.currentLanguage === 'en' ? 'en-US' : 'fr-DZ';
    document.documentElement.setAttribute('lang', langAttribute);
    if (this.currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('arabic-lang');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('arabic-lang');
    }
  },
  methods: {
    async selectLanguage(languageCode) {
      try {
        this.loading = true;

        this.appStore.setLanguage(this.getLanguageName(languageCode));
        const indexStore = useIndexStore();
        indexStore.setLang(languageCode);
        this.$i18n.locale = languageCode;

        const query = { ...this.$route.query, language: languageCode };
        this.$router.replace({ query }).catch(() => {});

        const langAttribute = languageCode === 'ar' ? 'ar-DZ' : languageCode === 'en' ? 'en-US' : 'fr-DZ';
        document.documentElement.setAttribute('lang', langAttribute);

        if (languageCode === 'ar') {
          document.documentElement.setAttribute('dir', 'rtl');
          document.body.classList.add('arabic-lang');
        } else {
          document.documentElement.setAttribute('dir', 'ltr');
          document.body.classList.remove('arabic-lang');
        }
      } catch (error) {
        console.error('Error updating language:', error);
        alert(this.$t("fail.operationFailed"));
      } finally {
        this.loading = false;
      }
    },
    getLanguageName(code) {
      const languageMap = {
        'ar': 'arabic',
        'en': 'english',
        'fr': 'french'
      };
      return languageMap[code] || 'english';
    }
  }
};
</script>
