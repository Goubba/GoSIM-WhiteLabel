import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    { path: "/", redirect: "/search" },
    { path: "/search", name: "search", component: () => import("../views/SearchView.vue") },
    {
      path: "/packages/:code",
      name: "packages",
      component: () => import("../views/packagesList/PackagesListView.vue"),
    },

    { path: "/status/:id", name: "status", component: () => import("../views/StatusView.vue") },
  ],
});

export default router;
