import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: null,
    isLogin: false,
  }),
  actions: {
    set(user) {
      this.user = user;
      this.isLogin = true;
    },
    update(user) {
      const currentInfo = this.user;
      this.user = { ...currentInfo, ...user };
    },
    logout() {
      localStorage.removeItem("token");
      this.user = null;
      this.isLogin = false;
    },
  },
});
