<template>
  <div class="bg-gray-50 border border-gray-100 rounded-3xl p-4 md:p-6">
    <h3 class="hidden md:block text-lg font-bold text-gray-900 mb-5">{{ $t("orders.summary") }}</h3>

    <form v-if="selectedPackage.id" class="md:space-y-2" @submit.prevent="submitOrder">
      <!-- Selected Package Specs -->
      <div class="hidden md:flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl">
        <img :src="location.image" class="w-11 h-11 object-cover rounded-full" />
        <div>
          <p class="font-bold text-sm text-gray-900">{{ location.name }}</p>
          <p class="text-xs text-gray-500 font-medium mt-0.5">
            {{ selectedPackage.duration === 1 ? $t("plans.duration.unlimitedData") + ' ' +
              $formatBytes(selectedPackage.volume) :
              $formatBytes(selectedPackage.volume) }}
          </p>
        </div>
      </div>

      <!-- Quantity Modifier -->
      <div :class="['md:flex', step === 1 ? 'flex' : 'hidden']"
        class="items-center justify-between pt-1 pb-2 md:pt-3 md:pb-6 border-b border-gray-200/50">
        <span class="text-sm font-bold text-gray-700">{{ $t("orders.quantity") }}</span>
        <div class="flex items-center gap-3">
          <button type="button"
            class="w-8 h-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            @click="quantity > 1 ? $emit('update:quantity', quantity - 1) : null">
            <i class="fa-solid fa-minus text-xs"></i>
          </button>
          <span class="font-black text-base w-6 text-center text-gray-900">{{ quantity }}</span>
          <button type="button"
            class="w-8 h-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            @click="$emit('update:quantity', quantity + 1)">
            <i class="fa-solid fa-plus text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Days Modifier -->
      <div v-if="selectedPackage.duration === 1"
        class="hidden md:flex items-center justify-between pt-3 pb-6 border-b border-gray-200/50">
        <span class="text-sm font-bold text-gray-700">{{ days === 1 ? $t("plans.duration.day") : $t("orders.days")
          }}</span>
        <div class="flex items-center gap-3">
          <button type="button"
            class="size-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            @click="days > 1 ? $emit('update:days', days - 1) : null">
            <i class="fa-solid fa-minus text-xs"></i>
          </button>
          <span class="font-black text-base w-6 text-center text-gray-900">{{ days }}</span>
          <button type="button"
            class="size-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            @click="days < 30 ? $emit('update:days', days + 1) : null">
            <i class="fa-solid fa-plus text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Subtotal -->
      <div class="hidden md:flex items-center justify-between pt-3 pb-6 border-b border-gray-200/50">
        <span class="text-sm font-bold text-gray-700">{{ $t("orders.subTotal") }}</span>
        <div class="flex flex-col items-end">
          <span class="font-black text-base text-gray-900">
            {{ $currencyFormatter(getDiscountedPrice(selectedPackage, selectedPackage.duration === 1 ? days : 1) *
              quantity) }}
          </span>
          <span v-if="selectedPackage.duration === 1 && getDiscount(selectedPackage, days) > 0"
            class="text-xs line-through text-gray-400">
            {{ $currencyFormatter(selectedPackage.price * days * quantity) }}
          </span>
        </div>
      </div>

      <!-- Customer Form (Visible on desktop, and on mobile if step === 2) -->
      <div :class="['md:block', step === 1 ? 'hidden' : 'block']"
        class="pt-3 pb-6 md:border-b border-gray-200/50 space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-gray-900 mb-2">{{ $t("orders.billingInformation") }}</h4>
          <button v-if="step === 2" @click="step = 1"
            class="inline-flex items-center justify-center text-gray-500 border rounded-xl border-gray-300 bg-white size-8">
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-2">{{ $t("orders.deliveryMethod", "Delivery Method")
            }}</label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" v-model="deliveryMethod" value="email" class="text-primary focus:ring-primary" />
              <span>{{ $t("orders.email", "Email") }}</span>
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" v-model="deliveryMethod" value="whatsapp" class="text-primary focus:ring-primary" />
              <span>{{ $t("orders.whatsapp", "WhatsApp") }}</span>
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" v-model="deliveryMethod" value="phone" class="text-primary focus:ring-primary" />
              <span>{{ $t("orders.sms", "SMS") }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">{{ $t("orders.fullName") }} <span
              class="text-red-500">*</span></label>
          <input v-model="customer.name" type="text" required
            class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            :placeholder="$t('orders.namePlaceholder')" />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">{{ $t("orders.emailAddress") }} <span
              class="text-red-500">*</span></label>
          <input v-model="customer.email" type="email" required
            class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            :placeholder="$t('orders.emailPlaceholder')" />
        </div>

        <div v-if="deliveryMethod === 'whatsapp' || deliveryMethod === 'phone'">
          <label class="block text-xs font-bold text-gray-700 mb-1">{{ $t("orders.phoneNumber") }} <span
              class="text-red-500">*</span></label>
          <div class="flex gap-2">
            <select v-model="selectedCoutryCode" type="text"
              class="w-24 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.code }}
              </option>
            </select>
            <input v-model="customer.phone" type="tel" required
              class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              :placeholder="$t('orders.phonePlaceholder')" pattern="[567][0-9]{8}" maxlength="9" />
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="hidden md:flex items-center justify-between pt-3 pb-6 border-gray-200/50">
        <span>{{ $t("orders.total") }}</span>
        <div class="flex flex-col items-end">
          <span class="font-black text-lg text-gray-900">
            {{ $currencyFormatter(getDiscountedPrice(selectedPackage, selectedPackage.duration === 1 ? days : 1) *
              quantity) }}
          </span>
          <span v-if="selectedPackage.duration === 1 && getDiscount(selectedPackage, days) > 0"
            class="text-sm line-through text-gray-400">
            {{ $currencyFormatter(selectedPackage.price * days * quantity) }}
          </span>
        </div>
      </div>

      <!-- Order Submission -->
      <button type="submit" class="btn-primary w-full hidden md:flex mt-4" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
        <span v-else>{{ $t("orders.placeOrder") }}</span>
      </button>

      <!-- Mobile Actions -->
      <button v-if="step === 1" type="button" @click="step = 2" class="btn-primary w-full md:hidden mt-2">
        {{ $t("common.continue") }}
      </button>
      <button v-else type="submit" class="btn-primary w-full md:hidden mt-2" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
        <template v-else>
          {{ $t("orders.placeOrder") }} {{
            $currencyFormatter(getDiscountedPrice(selectedPackage, selectedPackage.duration === 1 ? days : 1) *
              quantity) }}
        </template>
      </button>

      <!-- Exclusive notice -->
      <p class="text-[11px] text-gray-400 font-semibold text-center hidden md:block mt-2">
        {{ $t("orders.appExclusiveRates") }}
      </p>
    </form>

    <!-- Empty State -->
    <div v-else class="text-center py-10 text-gray-500 text-sm font-medium">
      <i class="fa-light fa-wallet text-3xl text-gray-300 mb-3 block"></i>
      {{ $t('orders.emptySummaryState') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedPackage: Object,
    quantity: Number,
    days: Number,
    location: Object,
    loading: {
      type: Boolean,
      default: true
    }
  },
  emits: ['submit', 'update:quantity', 'update:days'],
  data() {
    return {
      step: 1,
      deliveryMethod: 'email',
      customer: {
        name: '',
        email: '',
        phone: '',
        whatsapp: ''
      },
      selectedCoutryCode: "+213",
      countries: [
        {
          code: "+213",
          name: "algeria",
        },
      ]
      // countries: [
      //   {
      //     code: "+971",
      //     name: "United Arab Emirates",
      //   },
      //   {
      //     code: "+91",
      //     name: "India",
      //   },
      //   {
      //     code: "+1",
      //     name: "United States",
      //   },
      //   {
      //     code: "+44",
      //     name: "United Kingdom",
      //   },
      //   {
      //     code: "+49",
      //     name: "Germany",
      //   },
      //   {
      //     code: "+81",
      //     name: "Japan",
      //   },
      //   {
      //     code: "+33",
      //     name: "France",
      //   },
      //   {
      //     code: "+39",
      //     name: "Italy",
      //   },
      //   {
      //     code: "+34",
      //     name: "Spain",
      //   },
      //   {
      //     code: "+55",
      //     name: "Brazil",
      //   },
      // ],
    }
  },
  methods: {
    getDiscount(pack, days) {
      if (!pack.daily_discounts || !pack.daily_discounts.length) return 0;
      let applicable = pack.daily_discounts.filter(d => days >= d.day);
      if (applicable.length > 0) {
        return Math.max(...applicable.map(d => d.discount));
      }
      return 0;
    },
    getDiscountedPrice(pack, days) {
      let total = pack.price * days;
      let discount = this.getDiscount(pack, days);
      return total * (1 - discount / 100);
    },
    submitOrder() {
      const payload = {
        name: this.customer.name,
        email: this.customer.email,
      };

      if (this.deliveryMethod === 'phone') {
        payload.phone = this.selectedCoutryCode + this.customer.phone;
      } else if (this.deliveryMethod === 'whatsapp') {
        payload.whatsapp = this.selectedCoutryCode + this.customer.phone;
      }

      this.$emit('submit', payload);
    }
  }
}
</script>
