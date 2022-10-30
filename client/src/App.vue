<script setup>
import SocketIOService from "@/services/socket/";
import authApi from "@/services/factory/auth";
import { useAuthStore } from "@/stores";
import { onMounted, ref } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  libraries: ["places", "geometry"],
});
const auth = useAuthStore();
const loading = ref(true);

init();
onMounted(() => {
  loader.load().finally(() => (loading.value = false));
});

async function init() {
  try {
    SocketIOService.initialize();
    const data = await authApi.get();
    if (!data) return;

    auth.set(data);
    SocketIOService.setup(auth.user._id);
  } catch (e) {
    if (e?.response?.status === 401) return;
    console.error("fetchUserData ", e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <RouterView v-if="!loading" />
</template>

<style scoped></style>
