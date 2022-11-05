<template>
  Tài xế đã chấp nhận chuyến xe
  <div v-for="driver in drivers" :key="driver._id">
    <el-card :class="{ active: activeId === driver._id }">
      <el-avatar :src="driver.avatar" />
      {{ driver.name }} - {{ driver.phone }} - Xe
      {{ carType[driver.car_type] }} chỗ
    </el-card>
  </div>
</template>

<script setup>
import { CAR_TYPE } from "@/config/";
import { computed, onMounted, ref } from "vue";
import SocketIOService from "@/services/socket/";

const props = defineProps({
  drivers: Array,
});

const activeId = ref(null);

const carType = computed(() => CAR_TYPE);

onMounted(() => {
  SocketIOService.on("submit-driver-for-trip", (id) => {
    activeId.value = id;
  });
});
</script>

<style lang="css" scoped>
.active {
  background: var(--el-color-primary-light-3);
    color: white;
}
</style>
