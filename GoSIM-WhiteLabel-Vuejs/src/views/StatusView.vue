<template>

  <!-- Loading State -->
  <loader v-if="loading" name="circular" loadingText="" textColor="#ffffff" textSize="1" textWeight="600"
    object="#DB143C" color1="#DB143C" color2="#DB143C" size="7" speed="2" bg="#ffffff" objectbg="#f9fafb" opacity="80"
    :disableScrolling="true" />

  <template v-else>
    <!-- Header Section -->
    <div class="p-10 md:p-16 text-center relative overflow-hidden"
      :class="isSuccess ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600' : 'bg-gradient-to-br from-red-500 via-red-500 to-orange-500'">
      <!-- Glassmorphism decorative blobs -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay">
      </div>
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay">
      </div>

      <div
        class="relative z-10 w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-[3px] border-white/40">
        <i v-if="isSuccess" class="fa-solid fa-check text-5xl md:text-6xl text-white "></i>
        <i v-else class="fa-solid fa-xmark text-5xl md:text-6xl text-white "></i>
      </div>

      <h1 class="relative z-10 text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
        {{ isSuccess ? $t('success.title') : $t('failure.title') }}
      </h1>
      <p class="relative z-10 text-lg md:text-xl text-white/90 font-medium">
        {{ isSuccess ? $t('success.subtitle') : $t('failure.subtitle') }}
      </p>
    </div>

    <!-- Content Section -->
    <div class="mt-6 text-center bg-white">
      <p class="text-gray-600 text-base md:text-lg mb-6 leading-relaxed max-w-lg mx-auto font-medium px-12">
        {{ isSuccess ? $t('success.message') : $t('failure.message') }}
      </p>

      <!-- Order Summary Details (if available) -->
      <div v-if="payment && payment.order"
        class="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 max-w-sm mx-auto">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm text-gray-500 font-medium">{{ $t('orders.orderNumber') }}:</span>
          <span class="text-sm font-bold text-gray-900">{{ payment.order.batch_id }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500 font-medium">{{ $t('orders.totalAmount') }}:</span>
          <span class="text-sm font-bold text-gray-900">{{ payment.amount }} {{ payment.extra?.currency || 'DZD'
          }}</span>
        </div>
      </div>

      <!-- eSIMs Details and QR Codes -->
      <div v-if="isSuccess && payment?.order?.esims?.length > 0" class="mb-10 space-y-6 text-left">
        <div v-for="esim in payment.order.esims" :key="esim.id"
          class="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 class="font-bold text-xl text-gray-900 mb-6 border-b border-gray-200 pb-4">{{ esim.packageName || 'eSIM' }}</h3>

          <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div class="bg-white p-4 rounded-2xl border border-gray-200 flex-shrink-0">
              <qrcode-vue v-if="esim.ac" :value="esim.ac" :size="180" level="M" />
              <div v-else
                class="w-[180px] h-[180px] flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
                -
              </div>
            </div>

            <div class="flex-1 w-full space-y-4">
              <div class="bg-white p-4 rounded-xl border border-gray-100">
                <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{{ $t('scan.activationCode') || 'Activation Code' }}</p>
                <p class="text-sm font-mono font-semibold text-gray-900 break-all">{{ esim.ac || 'N/A' }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-xl border border-gray-100">
                  <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">ICCID</p>
                  <p class="text-sm font-semibold text-gray-900 break-all">{{ esim.iccid || 'N/A' }}</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-gray-100">
                  <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{{ $t('plans.data') || 'Data' }}</p>
                  <p class="text-sm font-semibold text-gray-900">{{ esim.totalVolume ?
                    $formatBytes(esim.totalVolume) : 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <router-link :to="{ name: 'search' }" class="btn-primary">
        {{ $t('failure.backToHome') || 'Back to Home' }}
      </router-link>
    </div>
  </template>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'StatusView',
  components: {
    QrcodeVue
  },
  data() {
    return {
      loading: true,
      payment: null,
      error: null
    }
  },
  computed: {
    isSuccess() {
      // Prioritize the actual API response status if available
      if (this.payment) {
        return this.payment.status === 'success';
      }
      return this.$route.query.status === 'success';
    }
  },
  async mounted() {
    const paymentId = this.$route.params.id;
    if (!paymentId) {
      this.error = "No payment ID provided";
      this.loading = false;
      return;
    }

    try {
      const { data } = await this.$axiosClient.get(`/order/payment/${paymentId}`);
      this.payment = data.data || data;

    } catch (err) {
      console.error('Failed to fetch payment details:', err);
      this.error = "Failed to load payment details";
    } finally {
      this.loading = false;
    }
  }
}
</script>
