import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores";
import authApi from "@/services/factory/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/views/admin/index.vue"),
      beforeEnter: [protectAdminRoute],
    },
    {
      path: "/admin/create-account",
      name: "create-account",
      component: () => import("@/views/admin/create-account.vue"),
      beforeEnter: [protectAdminRoute],
    },
    {
      path: "/",
      name: "driver",
      component: () => import("@/views/driver/index.vue"),
      beforeEnter: [protectDriverRoute],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login.vue"),
      beforeEnter: [protectLoginRoute],
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: import("@/views/404.vue") },
  ],
});

async function protectAdminRoute(to, from, next) {
  const username = useAuthStore()?.user?.username;
  if (username) {
    if (username === "admin") next();
    else next({ name: "driver" });
  }
  const token = localStorage.getItem("token");
  if (!token) next({ name: "login" });

  try {
    const data = await authApi.get();
    if (data) {
      const username = data?.username;
      useAuthStore().set(data);
      if (username === "admin") next();
      else next({ name: "driver" });
    }
  } catch (e) {
    localStorage.removeItem("token");
    next({ name: "login" });
  }
}

async function protectDriverRoute(to, from, next) {
  const username = useAuthStore()?.user?.username;
  if (username) {
    if (username === "admin") next({ name: "admin" });
    else next();
  }
  const token = localStorage.getItem("token");
  if (!token) next({ name: "login" });

  try {
    const data = await authApi.get();
    if (data) {
      const username = data?.username;
      useAuthStore().set(data);
      if (username === "admin") next({ name: "admin" });
      else next();
    }
  } catch (e) {
    localStorage.removeItem("token");
    next({ name: "login" });
  }
}

async function protectLoginRoute(to, from, next) {
  const directBelongToName = (username) => {
    if (username === "admin") next({ name: "admin" });
    else next({ name: "driver" });
  };
  const username = useAuthStore()?.user?.username;
  if (username) {
    directBelongToName(username);
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) next();

  try {
    const data = await authApi.get();
    if (data) {
      const username = data?.username;
      useAuthStore().set(data);
      directBelongToName(username);
    }
  } catch (e) {
    localStorage.removeItem("token");
    next();
  }
}

export default router;
