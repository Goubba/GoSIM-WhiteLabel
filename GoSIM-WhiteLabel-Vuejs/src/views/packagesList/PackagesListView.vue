<template>

  <loader v-if="loading" name="circular" loadingText="" textColor="#ffffff" textSize="1" textWeight="600"
    object="#DB143C" color1="#DB143C" color2="#DB143C" size="7" speed="2" bg="#ffffff" objectbg="#f9fafb" opacity="80"
    :disableScrolling="true" />

  <!-- Main View -->
  <div v-else class="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-32 md:pb-4">
    <!-- Left Column: Packages and Information -->
    <div class="lg:col-span-2 space-y-4 min-w-0">
      <!-- Back to Search Link -->
      <router-link to="/" class="inline-flex items-center gap-2 text-sm text-gray-500 font-medium">
        <i class="fa-solid fa-arrow-left text-xs"></i>
        <span>{{ $t("navigation.home") }}</span>
      </router-link>

      <!-- Location Header Banner -->
      <div class="space-y-2">
        <div class="flex items-center gap-5 bg-gray-50/50 border border-gray-100 rounded-3xl p-6">
          <img :src="location.image" class="w-16 h-16 object-cover rounded-full border border-white shrink-0" />
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl font-black text-gray-900 truncate">{{ location.name }}</h1>
            <div class="flex gap-2 overflow-x-auto w-full mt-1.5 pb-1 no-scrollbar">
              <template v-for="(network, i) in networks" :key="i">
                <span v-for="(operator, j) in network.operatorList" :key="j"
                  class="bg-gray-100 py-1 px-3 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 shrink-0 whitespace-nowrap">
                  {{ operator.operatorName }} {{ operator.networkType }}
                </span>
              </template>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="fa-light fa-gauge-max text-lg"></i>
            </div>
            <p class="text-xs font-semibold text-gray-700">{{ $t("plans.planDetailTwo") }}</p>
          </div>
          <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="fa-light fa-signal-stream text-lg"></i>
            </div>
            <p class="text-xs font-semibold text-gray-700">{{ $t("plans.planDetailThree") }}</p>
          </div>
          <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="fa-light fa-globe text-lg"></i>
            </div>
            <p class="text-xs font-semibold text-gray-700">{{ $t("plans.supportedNetwork") }}</p>
          </div>
        </div>
      </div>

      <!-- Plans Segment -->
      <div>
        <h3 class="text-lg font-bold text-gray-900">{{ $t("plans.plansTitle") }}</h3>
        <p class="text-sm text-gray-600">{{ $t("plans.plansText") }}</p>

        <!-- Duration Category Badges (Unlimited / Fixed Plans) -->
        <div class="flex my-4 rounded-2xl bg-gray-100">
          <button v-if="unlimitedPackages.length > 0" @click="type = 'unlimited'"
            class="w-full py-2 rounded-2xl font-bold text-center cursor-pointer" :class="type === 'unlimited'
              ? 'bg-primary text-white'
              : ''
              ">
            {{ $t('plans.duration.unlimited') }}
          </button>
          <button v-if="fixedPackages.length > 0" @click="type = 'fixed'"
            class="w-full py-2 rounded-2xl font-bold text-center cursor-pointer" :class="type === 'fixed'
              ? 'bg-primary text-white'
              : ''
              ">
            {{ $t('plans.fixedPlans') }}
          </button>
        </div>

        <!-- Packages Listing Grid -->
        <div class="grid gap-4">
          <div v-for="pack in (type === 'unlimited' ? unlimitedPackages : fixedPackages)" :key="pack.id"
            @click="selectedPackage = pack"
            class="border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 group hover:border-primary select-none"
            :class="selectedPackage.id === pack.id
              ? 'border-primary'
              : 'border-gray-200'
              ">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <!-- Check Indicator -->
                <div class="w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0" :class="selectedPackage.id === pack.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300'
                  ">
                  <i v-if="selectedPackage.id === pack.id" class="fa-solid fa-check text-[10px]"></i>
                </div>
                <div>
                  <h4 class="font-bold text-lg text-gray-900 group-hover:text-primary" :class="selectedPackage.id === pack.id
                    ? 'text-primary'
                    : ''
                    ">
                    {{ pack.duration === 1 ? $formatBytes(pack.volume) + ' ' + $t("plans.duration.unlimitedData") :
                      $formatBytes(pack.volume) }}
                  </h4>
                  <p class="text-xs text-gray-500 font-medium mt-0.5">
                    {{ pack.duration === 1 ? $t("plans.duration.perDay") : $t("plans.duration.days", {
                      count:
                        pack.duration
                    })
                    }}
                  </p>
                </div>
              </div>
              <div class="text-right flex flex-col items-end">
                <span class="font-black text-xl text-gray-900">
                  {{ selectedPackage.id === pack.id && pack.duration === 1 ? $currencyFormatter(getDiscountedPrice(pack,
                    days)) : $currencyFormatter(pack.price) }}
                </span>
                <span v-if="selectedPackage.id === pack.id && pack.duration === 1 && getDiscount(pack, days) > 0"
                  class="text-sm text-gray-400 line-through mt-0.5">
                  {{ $currencyFormatter(pack.price * days) }}
                </span>
              </div>
            </div>
            <div v-if="selectedPackage.id === pack.id && selectedPackage.duration === 1"
              class="md:hidden flex justify-between items-center pb-0 border-t-[0.5px] pt-4 mt-4 border-primary">
              <button @click.stop="days > 1 ? days-- : null" :disabled="days === 1" class="py-1 px-6">
                <i class="fa-solid fa-minus text-lg"></i>
              </button>
              <span>{{ days }} {{ days === 1 ? $t('plans.duration.day') : $t('orders.days') }}</span>
              <button @click.stop="days < 30 ? days++ : null" :disabled="days === 30" class="py-1 px-6">
                <i class="fa-solid fa-plus text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Live Sticky Summary Desktop-->
    <div class="w-full lg:sticky lg:top-24 self-start hidden md:block">
      <SummaryForm :selectedPackage="selectedPackage" v-model:quantity="quantity" v-model:days="days"
        :location="location" @submit="submit" :loading="paymentLoading" />
    </div>

  </div>

  <!-- Right Column: Live Sticky Summary Mobile-->
  <div v-if="!loading" class="fixed bottom-0 inset-x-0 md:hidden z-50">
    <SummaryForm :selectedPackage="selectedPackage" v-model:quantity="quantity" v-model:days="days" :location="location"
      @submit="submit" :loading="paymentLoading" />
  </div>
</template>

<script>
import SummaryForm from "./components/SummaryForm.vue";
import { useIndexStore } from '@/stores/index';

export default {
  components: {
    SummaryForm
  },
  data() {
    return {
      loading: false,
      paymentLoading: false,
      selectedPackage: {},
      location: {},
      packages: [],
      quantity: 1,
      days: 1,
      type: "",
    };
  },
  watch: {
    type(value) {
      if (value === "unlimited") {
        this.selectedPackage = this.unlimitedPackages[0];
      } else {
        this.selectedPackage = this.fixedPackages[0];
      }
    }
  },
  computed: {
    currentCurrency() {
      return this.appStore.preferences.currency.toUpperCase();
    },
    unlimitedPackages() {
      return this.packages.filter((pkg) => pkg.duration === 1);
    },
    fixedPackages() {
      return this.packages.filter((pkg) => pkg.duration > 1);
    },
    networks() {
      return this.packages?.[0]?.locationNetworkList
    }
  },
  mounted() {
    this.getPackages();
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
    submit(customer) {
      this.paymentLoading = true;

      try {
        const indexStore = useIndexStore();
        indexStore.setPendingOrderData({
          location: this.location,
          packageData: this.selectedPackage
        });

        const currentCurrency = this.appStore.preferences.currency?.toUpperCase() || "DZD";

        const orderData = {
          package: this.selectedPackage.id,
          quantity: this.quantity,
          days: this.selectedPackage.duration === 1 ? this.days : null,
          payment_method: 5,
          promo_codes: [],
          currency: currentCurrency.toUpperCase(),
          email: customer.email,
          name: customer.name,
          phone: customer.phone || customer.whatsapp,
          country: "DZ",
          country_phone_code: customer.country_phone_code,
          delivery: customer
        };

        this.$axiosClient.post("/order/initiate/unauth/external", orderData)
          .then(({ data }) => {
            console.log(data);

            const paymentId = data.data?.data?.payment?.id;
            this.$router.push({ name: 'status', params: { id: paymentId }, query: { status: "success" } });
          }).catch((error) => {
            console.error("Payment initiation error:", error);
            this.$swal.fire({
              icon: 'error',
              title: this.$t("fail.operationFailed"),
              text: this.$t("fail.tryAgainLater")
            });
          }).finally(() => {
            this.paymentLoading = false;
          });

      } catch (error) {
        console.error("Payment initiation error:", error);
        this.$swal.fire({
          icon: 'error',
          title: this.$t("fail.operationFailed"),
          text: this.$t("fail.tryAgainLater")
        });
        this.paymentLoading = false;
      }
    },
    getPackages() {
      this.loading = true;
      this.$axiosClient
        .post("/packages", {
          code: this.$route.params.code,
          currency: this.currentCurrency.toLowerCase()
        })
        .then(({ data }) => {
          this.loading = false;
          this.packages = data.data.packages || [];
          this.location = data.data.location || {};
        })
        .then(() => {
          if (this.unlimitedPackages.length > 0) {
            this.type = "unlimited";
          } else {
            this.type = "fixed";
          }

          const availablePackages = this.type === 'unlimited' ? this.unlimitedPackages : this.fixedPackages;
          this.selectedPackage = availablePackages.length > 0 ? availablePackages[0] : null;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
