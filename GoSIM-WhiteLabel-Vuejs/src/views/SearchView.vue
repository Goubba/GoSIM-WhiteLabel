<template>
  <!-- Search Bar -->
  <div class="relative w-full border border-gray-100 rounded-2xl">
    <input type="search" v-model="search"
      class="border-none rounded-2xl pl-10 py-3 w-full bg-gray-50 placeholder:text-sm placeholder:text-gray-500"
      :placeholder="$t('home.searchCountry')" />
    <div class="absolute left-0 inset-y-0 rounded-l-lg flex items-center justify-center px-4">
      <i class="fa-solid fa-magnifying-glass text-gray-400"></i>
    </div>
  </div>

  <!-- Tabs Selector -->
  <div class="flex my-4 rounded-2xl bg-gray-100">
    <button @click="activeTab = 'countries'" class="w-full py-2 rounded-2xl font-bold text-center cursor-pointer"
      :class="activeTab === 'countries' ? 'bg-primary text-white' : ''">
      {{ $t("home.countries") }}
    </button>
    <button @click="activeTab = 'regions'" class="w-full py-2 rounded-2xl font-bold text-center cursor-pointer"
      :class="activeTab === 'regions' ? 'bg-primary text-white' : ''">
      {{ $t("home.regions") }}
    </button>
  </div>

  <div>
    <!-- Countries Loading Skeleton -->
    <div v-if="loading" class="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
      <div v-for="i in 8" :key="i" class="rounded-2xl bg-gray-100 animate-pulse">
        <div class="w-full h-42">
          <div class="h-full w-full rounded-t-2xl bg-gray-200 border border-gray-300"></div>
        </div>
        <div class="flex gap-2 items-center justify-start p-3">
          <div class="h-12 w-12 rounded-full bg-gray-300 border border-gray-300 shrink-0"></div>
          <div class="flex flex-col gap-2 w-full">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Display when not loading -->
    <div v-else>
      <!-- Countries Tab Content -->
      <div>
        <!-- No Results State -->
        <div v-if="countries.length == 0" class="text-center pt-16 pb-8 flex flex-col items-center">
          <div class="flex items-center justify-center bg-gray-100 rounded-xl w-32 h-32 relative">
            <i class="fa-light fa-map-location-dot text-gray-400 text-4xl"></i>
            <i class="fa-light fa-slash text-gray-400 text-4xl absolute"></i>
          </div>
          <div class="mt-8">
            <h3 class="">{{ $t("home.noResult") }}</h3>
            <p class="text-gray-600 mt-2 max-w-80">
              {{ $t("home.noResultText") }}
            </p>
          </div>
          <button @click="search = ''" class="btn-primary w-full mt-8">
            {{ $t("home.noResultButton") }}
          </button>
        </div>

        <!-- List -->
        <div v-else class="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          <router-link v-for="location in activeTab === 'countries' ? countries : combinedRegions" :key="location.code"
            :to="{
              name: 'packages',
              params: { code: location.code },
            }">
            <div class="rounded-2xl bg-gray-100 hover:bg-gray-100 transition-colors">
              <div class="w-full h-42">
                <img :src="location.cover" class="h-full w-full rounded-t-2xl object-cover border border-gray-400" />
              </div>
              <div class="flex gap-2 items-center justify-start  font-medium text-sm p-3 text-gray-700 ">
                <img :src="location.image"
                  class="size-10 sm:size-12 rounded-full object-cover border border-gray-400" />
                <div class="rtl:text-right text-left">
                  <p class="line-clamp-1"> {{ location.name }} </p>
                  <span class="text-xs sm:text-sm line-clamp-1" v-if="location.fromPrice">
                    {{ $t('home.startingAt') }} {{ $currencyFormatter(location.fromPrice) }}
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeTab: "countries",
      loading: false,
      search: "",
      countries: [],
      regions: [],
      glob: []
    };
  },
  computed: {
    combinedRegions() {
      return [...this.glob, ...this.regions];
    }
  },
  mounted() {
    this.getLocations();
  },
  watch: {
    search() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.getLocations();
      }, 300);
    },
    '$i18n.locale'() {
      this.getLocations();
    },
  },
  methods: {
    getLocations() {
      this.loading = true;
      this.$axiosClient
        .get(`/locations${this.search ? `?search=${encodeURIComponent(this.search)}` : ""}`)
        .then(({ data }) => {
          this.loading = false;
          this.countries = data.data.countries || [];
          this.regions = data.data.regions || [];
          this.glob = data.data.glob || [];
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
