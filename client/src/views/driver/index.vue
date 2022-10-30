<template>
  <DriverInfo />
  <div class="container">
    <DriverTripsCompleted v-show="!show" :trips="driverTrips" />
    <transition v-show="show">
      <div>
        <div class="mb-1" v-show="isOnTrip">
          <el-alert
            title="Bạn đã nhận chuyến xe. Nhấn 'Hoàn thành' khi bạn đã đưa khách hàng đến đúng điểm đón'"
            type="success"
            :closable="false"
          />
        </div>
        <div class="mb-2 f-18"><b>Thông tin chuyến xe:</b></div>
        <div v-show="isOnTrip" class="f-14 tc mb-1-5">
          Số điện thoại khách hàng: <b>{{ tripInfo.client_phone_number }}</b>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in timeline"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :hollow="activity.hollow"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </transition>
  </div>
  <!-- <div v-show="show" v-loading="loading">
  
      <div class="trip-info">
        <div class="tc">
          <div class="trip-info-title">Điểm đón:</div>
          <div>{{ tripInfo.departure }}</div>
        </div>
        <div class="tc">
          <div class="trip-info-title">Điểm đến</div>
          <div>{{ tripInfo.destination }}</div>
        </div>
      </div>
      <div class="tr">
        <el-button @click="finishTrip" v-if="isOnTrip"> Hoàn thành </el-button>
        <el-button @click="submitTrip" v-else> Chấp nhận </el-button>
      </div>
    </div> -->
  <div v-loading="loading" v-show="show" class="btns">
    <el-button @click="finishTrip" type="primary" v-if="isOnTrip" size="large">
      Hoàn thành
    </el-button>
    <el-button @click="submitTrip" type="primary" v-else size="large">
      Chấp nhận
    </el-button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import SocketIOService from "@/services/socket/";
import { useAuthStore } from "@/stores";
import tripApi from "@/services/factory/trip";
import { ElMessage } from "element-plus";
import DriverInfo from "@/components/DriverInfo.vue";
import DriverTripsCompleted from "@/components/DriverTripsCompleted.vue";

const auth = useAuthStore();

const show = ref(false);
const driverTrips = ref([]);
const tripInfo = ref({
  departure:
    "115 Nghĩa Thục, phường 5, Quận 5, Thành phố Hồ Chí Minh, Việt Nam",
  destination:
    "275 Đường Nguyễn Trãi, Thanh Xuân Trung, Thanh Xuân, Hà Nội, Việt Nam",
  client_phone_number: "0343811945",
});
const tripId = ref(null);
const loading = ref(false);
const isOnTrip = ref(false);
const userId = computed(() => auth.user?._id);

init();

async function init() {
  getTrips();
  SocketIOService.on("book-car", async (trip_id) => {
    const { trip } = await tripApi.get(trip_id);
    if (!trip) return;
    tripInfo.value = trip;
    const { lat, lng } = auth.user;
    const info = { id: userId.value, lat, lng, trip };
    SocketIOService.emit("send-location", JSON.stringify(info));
  });
  SocketIOService.on("send-trip-info", (trip_info) => {
    const trip = JSON.parse(trip_info);
    if (trip.some((t) => t.id === userId.value)) {
      tripId.value = trip[0].trip._id;
      show.value = true;
      ElMessage({
        message: "Bạn vừa nhận được 1 chuyến xe",
      });
      return;
    }
    tripInfo.value = {};
  });
  SocketIOService.on("submit-driver-for-trip", (id) => {
    if (userId.value == id) {
      isOnTrip.value = true;
      ElMessage({
        message: `Hệ thống đã chọn bạn làm tài xế phù hợp cho chuyến xe.<br/>Hãy bắt đầu chuyên xe!`,
        type: "success",
        duration: 5000,
      });
    } else {
      show.value = false;
      ElMessage({
        message: `Hệ thống đã chọn tài xế phù hợp cho chuyến xe.<br/>Hãy chờ chuyên xe tiếp theo`,
        duration: 5000,
      });
    }
    loading.value = false;
  });
}
async function getTrips() {
  const { trip } = await tripApi.getByDriverId(userId.value);
  driverTrips.value = trip;
}
function submitTrip() {
  const info = {
    trip_id: tripId.value,
    driver: {
      id: userId.value,
      lat: auth.user.lat,
      lng: auth.user.lng,
    },
  };
  SocketIOService.emit("submit-trip", JSON.stringify(info));
  ElMessage({
    message: "Bạn đã chấp nhận chuyến xe. Vui lòng đợi hệ thống xử lí.",
    type: "success",
    duration: 5000,
  });
  loading.value = true;
}
async function finishTrip() {
  try {
    loading.value = true;
    const data = await tripApi.update(tripId.value, { status: 2 });
    if (data) {
      show.value = false;
      isOnTrip.value = false;
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="css" scoped>
.container {
  margin: 0 8px;
  padding: 0 12px;
}

/* Button bottom */
.btns {
  position: fixed;
  width: 100%;
  height: 60px;
  bottom: 0;
  left: 0;
}
.el-button--large {
  width: 100%;
  height: 100%;
  font-size: 22px;
}
</style>
