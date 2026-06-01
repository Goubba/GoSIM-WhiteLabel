import "./assets/main.css";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import axiosClient from "./axios";
import utils from "./utils";

import loader from "vue3-ui-preloader";
import "vue3-ui-preloader/dist/loader.css";

import DefaultPageHeader from "./components/DefaultPageHeader.vue";
import Swal from "sweetalert2";

import { createI18n } from "vue-i18n";
import en from "./locales/en";
import fr from "./locales/fr";
import ar from "./locales/ar";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: { fr, en, ar },
})

// Set initial HTML lang attribute based on stored locale
const initialLocale = 'fr';
const langAttribute = initialLocale === 'ar' ? 'ar-DZ' : initialLocale === 'en' ? 'en-US' : 'fr-DZ';
document.documentElement.setAttribute('lang', langAttribute);
document.documentElement.setAttribute('dir', initialLocale === 'ar' ? 'rtl' : 'ltr');

// Ensure fonts load by adding a debug class
if (initialLocale === 'ar') {
  document.body.classList.add('arabic-lang');
}

import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.config.globalProperties.$axiosClient = axiosClient;
// Add SweetAlert2 to global properties
app.config.globalProperties.$swal = Swal;

app
  .use(router)
  .use(utils)
  .use(i18n)
  .component("loader", loader)
  .component("default-page-header", DefaultPageHeader)
  .mount("#app");
