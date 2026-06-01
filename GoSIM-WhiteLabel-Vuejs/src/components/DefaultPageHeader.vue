<template>
  <div class="md:hidden sticky top-0 inset-x-0 bg-white z-50 px-2 max-w-lg mx-auto">
    <div :class="[classes]" class=" pb-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button v-if="showArrow" @click="goBack()">
          <i class="fa-solid fa-angle-left text-2xl text-black " :class="[$i18n.locale == 'ar' ? 'rotate-180' : '']" />
        </button>
        <h1 class="text-xl font-bold">{{ title }}</h1>
      </div>
      <div class="flex items-center gap-1">
        <!-- Currency Display -->
        <button v-if="showCurrency && currencyCode && currencySymbol" @click="openCurrencyModal"
          class="text-gray-500 text-xs font-bold bg-gray-100 rounded-full px-2 py-2 hover:bg-gray-200 transition-colors">
          {{ currencySymbol + " - " + currencyCode }} <i class="fa-solid fa-chevron-down text-[10px]"></i>
        </button>
        <!-- Action Slot (for QR Scanner or other custom actions) -->
        <slot name="header-action">
        </slot>
      </div>
    </div>
  </div>

  <!-- Currency Selection Modal -->
  <swipe-modal v-model="showCurrencyModal" snapPoint="40vh">
    <div class="flex flex-col gap-4 py-6 px-6 max-w-md mx-auto">
      <div class="flex items-start justify-between">
        <h2 class="text-xl font-extrabold">{{ $t('common.selectCurrency') }}</h2>
        <button @click="showCurrencyModal = false" :class="$i18n.locale === 'ar'
            ? 'absolute md:static top-4 left-4'
            : 'absolute md:static top-4 right-4'
          ">
          <i class="fa-solid fa-circle-xmark text-black text-3xl"></i>
        </button>
      </div>

      <div class="space-y-3">
        <button v-for="currency in availableCurrencies" :key="currency.code" @click="selectCurrency(currency)"
          class="w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between" :class="currentCurrency === currency.code
              ? 'border-primary bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
            ">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
              <img :src="currency.image" :alt="currency.name" class="w-8 h-8">
            </div>
            <div class="text-left">
              <p class="font-bold text-lg text-gray-900">{{ currency.name }}</p>
              <p class="text-base text-gray-500">{{ currency.code }}</p>
            </div>
          </div>
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            :class="currentCurrency === currency.code ? 'border-primary bg-primary' : 'border-gray-300'">
            <div v-if="currentCurrency === currency.code" class="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </button>
      </div>
    </div>
  </swipe-modal>
</template>

<script>
export default {
  data() {
    return {
      showCurrencyModal: false,
      availableCurrencies: [
        {
          code: 'DZD',
          name: 'Algerian Dinar',
          symbol: 'دج',
          image: '/assets/dzd.png',
        },
        {
          code: 'USD',
          name: 'US Dollar',
          symbol: '$',
          image: '/assets/usd.png',
          color: '#059669'
        },
        // {
        //   code: 'EUR',
        //   name: 'Euro',
        //   symbol: '€',
        //   image: '/assets/euro.png',
        //   color: '#7C3AED'
        // }
      ]
    }
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
    backRoute: {
      type: String,
      default: null,
    },
    customBackAction: {
      type: Function,
      default: null,
    },
    classes: {
      type: String,
      default: "flex items-center gap-3",
    },
    showCurrency: {
      type: Boolean,
      default: false,
    },
    currencyCode: {
      type: String,
      default: "",
    },
    currencySymbol: {
      type: String,
      default: "",
    },
    showQRScanner: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentCurrency() {
      return this.appStore.preferences.currency?.toUpperCase() || 'DZD'
    }
  },
  methods: {
    goBack() {
      if (this.customBackAction) {
        this.customBackAction();
      } else if (this.backRoute) {
        this.$router.push(this.backRoute);
      } else {
        this.$router.go(-1);
      }
    },
    openQRScanner() {
      this.$router.push({ name: 'qr-scanner' });
    },
    openCurrencyModal() {
      this.showCurrencyModal = true;
    },
    selectCurrency(currency) {
      // Update currency in store
      this.appStore.updateCurrency(currency.code.toLowerCase());

      // Emit event to parent components
      this.$emit('currency-changed', currency.code);

      // Close modal
      this.showCurrencyModal = false;
    }
  }
}
</script>

<style scoped></style>
