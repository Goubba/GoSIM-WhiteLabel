<template>
  <div class="w-full bg-gray-200 rounded-full h-3">
    <div
      :class="[
      'h-3 rounded-full',
      Progress < 33 ? 'bg-red-500' : Progress < 66 ? 'bg-yellow-400' : 'bg-green-500'
      ]"
      :style="{ width: Progress + '%' }"
    ></div>
  </div>
</template>
<script>
export default {
  name: "ProgressBar",
  props: {
    progress: {
      type: Number,
      required: true,
      default: 0,
    },
    maximum: {
      type: Number,
      required: true,
      default: 100,
    },
  },
  computed: {
    Progress() {
      return (this.progress * 100) / this.maximum == 0 ? 1 :(this.progress * 100) / this.maximum;
    },
  },
};
</script>
