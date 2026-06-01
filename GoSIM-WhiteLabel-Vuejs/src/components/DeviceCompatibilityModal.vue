<template>
  <!-- Device Compatibility Check Modal -->
  <swipe-modal v-model="isVisible" snapPoint="70vh" @update:modelValue="handleModalChange">
    <div class="flex flex-col gap-4 py-6 px-6 max-w-md mx-auto">
      <div class="flex items-start justify-between">
        <h3 class="text-xl font-extrabold text-gray-900">{{ $t('orders.deviceCompatibilityTitle') }}</h3>
        <button @click="closeModal" :class="$i18n.locale === 'ar' ? 'absolute md:static top-4 left-4' : 'absolute md:static top-4 right-4'">
          <i class="fa-solid fa-circle-xmark text-gray-400 hover:text-gray-600 transition-colors text-3xl"></i>
        </button>
      </div>

      <div class="flex flex-col items-center gap-6 mt-2">
        <!-- Premium SVG Device Check Representation -->
        <div class="flex items-center justify-center w-24 h-24 rounded-full bg-red-50 border border-red-100 text-red-500 animate-pulse">
          <i class="fa-solid fa-mobile-screen text-4xl"></i>
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-2 text-center">
          <p class="text-sm text-gray-600 leading-relaxed">{{ $t('orders.compatibilityModalDescription') }}</p>
        </div>

        <!-- Instructions -->
        <div class="bg-gray-50 rounded-2xl p-4 w-full border border-gray-100">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 rounded-full bg-red-100 text-[#DB143C] text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
              <p class="text-xs text-gray-700 font-medium leading-relaxed">{{ $t('orders.compatibilityStep1') }}</p>
            </div>
          </div>
        </div>

        <!-- Check Button -->
        <button
          @click="checkDeviceCompatibility"
          class="bg-[#DB143C] w-full hover:bg-red-700 text-white px-6 py-4 rounded-xl font-semibold text-sm transition-colors shadow-md hover:shadow-lg active:scale-[0.98] transform duration-150"
        >
          {{ $t('orders.checkCompatibilityButton') }}
        </button>
      </div>
    </div>
  </swipe-modal>
</template>

<script>
export default {
  name: 'DeviceCompatibilityModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    autoCheckOnClose: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'compatibility-checked', 'modal-closed'],
  data() {
    return {
      isVisible: this.modelValue
    }
  },
  watch: {
    modelValue(newValue) {
      this.isVisible = newValue;
    },
    isVisible(newValue) {
      this.$emit('update:modelValue', newValue);
      if (!newValue) {
        this.handleModalClose();
      }
    }
  },
  methods: {
    closeModal() {
      this.isVisible = false;
    },
    handleModalChange(newValue) {
      this.isVisible = newValue;
    },
    handleModalClose() {
      this.$emit('modal-closed');

      if (this.autoCheckOnClose) {
        this.$emit('compatibility-checked');
      }
    },
    checkDeviceCompatibility() {
      try {
        const dialLink = 'tel:*%2306%23'; // URL encoded version of *#06#

        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          window.location.href = dialLink;
        } else {
          this.$emit('show-info', {
            title: this.$t('orders.compatibilityDesktopTitle', 'Device Check'),
            message: this.$t('orders.compatibilityDesktopMessage', 'On your mobile device, dial *#06# to check if EID is available.')
          });
        }

        setTimeout(() => {
          this.closeModal();
          this.$emit('compatibility-checked');
        }, 1000);

      } catch (error) {
        console.error('Error opening dialer:', error);

        this.$emit('show-info', {
          title: this.$t('orders.compatibilityFallbackTitle', 'Manual Check'),
          message: this.$t('orders.compatibilityFallbackMessage', 'Please manually dial *#06# on your device to check EID availability.')
        });

        setTimeout(() => {
          this.closeModal();
          this.$emit('compatibility-checked');
        }, 2000);
      }
    }
  }
}
</script>

<style scoped>
/* High-end micro-animations */
.animate-pulse {
  animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: .9;
    transform: scale(1.03);
  }
}
</style>
