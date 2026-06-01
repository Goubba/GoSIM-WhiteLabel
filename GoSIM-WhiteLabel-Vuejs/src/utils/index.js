import { reactive } from "vue";

const state = reactive({
  preferences: {
    currency: "dzd",
    language: "fr",
  },
});

const appStoreMock = {
  get preferences() {
    return state.preferences;
  },
  setLanguage(lang) {
    state.preferences.language = lang;
  },
  setCurrency(curr) {
    state.preferences.currency = curr.toLowerCase();
  },
  updateCurrency(curr) {
    this.setCurrency(curr);
  },
  initializePreferences() {},
  setUserData() {},
  clearUserData() {},
  initializeAuth() {},
};

export function currencyFormatter(val) {
  const currency = state.preferences.currency?.toUpperCase() || "DZD";
  const decimals = currency === "DZD" ? 0 : 2;
  const data = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);

  const isArabic = sessionStorage.getItem('lang') === 'ar';
  const displayCurrency = (currency === 'DZD' && isArabic) ? 'د.ج' : currency;

  return `${data} ${displayCurrency}`;
}

export function dateFormatterWithTime(val) {
  const data = new Date(val).toLocaleDateString("fr-fr", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return data;
}

export function dateFormatterShort(val) {
  const data = new Date(val).toLocaleDateString("fr-fr", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return data;
}

export function formatBytes(bytes, locale) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  const isArabic = (locale || state.preferences.language) === "ar";

  if (mb > 1000) {
    const gb = (mb / 1024).toFixed(0);
    return isArabic ? `\u202D${gb} GB\u202C` : `${gb} GB`;
  } else {
    const mbValue = mb.toFixed(0);
    return isArabic ? `\u202D${mbValue} MB\u202C` : `${mbValue} MB`;
  }
}

// Create the Vue plugin
export default {
  install(app) {
    // Add functions to the global properties (accessible as this.$<name>)
    app.config.globalProperties.$currencyFormatter = currencyFormatter;
    app.config.globalProperties.$dateFormatterWithTime = dateFormatterWithTime;
    app.config.globalProperties.$dateFormatterShort = dateFormatterShort;
    app.config.globalProperties.$formatBytes = formatBytes;

    // Add lightweight preferences/store replacement
    app.config.globalProperties.$appStore = appStoreMock;

    // Add global mixin so that "this.appStore" works in all Options API components
    app.mixin({
      computed: {
        appStore() {
          return this.$appStore;
        },
      },
    });
  },
};
