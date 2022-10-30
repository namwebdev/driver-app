<template>
  <div v-for="driver in drivers" :key="driver._id">
    {{ driver.name }} - {{ driver.phone }} - Xe
    {{ carType[driver.car_type] }} chỗ
  </div>
</template>

<script setup>
import { CAR_TYPE } from "@/config/";
import { computed } from "vue";

const props = defineProps({
  drivers: Array,
});
const carType = computed(() => CAR_TYPE);
</script>

<style lang="scss" scoped></style>
