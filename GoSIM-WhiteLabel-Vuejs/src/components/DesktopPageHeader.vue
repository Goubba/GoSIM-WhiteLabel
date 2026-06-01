<template>
  <div class="hidden md:block my-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button v-if="showArrow" @click="goBack()" class="text-gray-600 hover:text-gray-900 transition-colors">
          <i class="fa-solid fa-angle-left text-2xl" :class="[$i18n.locale == 'ar' ? 'rotate-180' : '']" />
        </button>
        <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
      </div>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesktopPageHeader',
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
  },
};
</script>
