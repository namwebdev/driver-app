<template>
  <div class="mb-3 tc">
    <div class="mb-1 f-18"><b>Số chuyến xe đã hoàn thành</b></div>
    <el-progress
      type="circle"
      :percentage="trips.length ? 100 : 0"
    >
      <b class="f-28"> {{ trips.length }}</b>
    </el-progress>
  </div>
  <div v-if="trips.length">
    <div class="f-14 mb-1">Các chuyến xe đã hoàn thành gần nhất</div>
    <div v-for="trip in trips" :key="trip._id">
      <div class="f-12 mb-1">
        <b>{{ $filter.formatDate(trip.created_at) }}</b>
      </div>
      <el-timeline>
        <el-timeline-item hide-timestamp>
          {{ trip.departure }}
        </el-timeline-item>
        <el-timeline-item hide-timestamp>
          {{ trip.destination }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  trips: { type: Array },
});
</script>

<style lang="css" scoped></style>
