<template>
  <AdminContainer>
    <el-form @keyup.enter="submit">
      <el-form-item>
        <el-input
          v-model="form.client_phone_number"
          type="text"
          placeholder="Số điện thoại khách hàng"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <input
          class="gg-map-input"
          type="text"
          placeholder="Địa chỉ điểm đón"
          id="departure"
        />
      </el-form-item>
      <el-form-item>
        <input
          class="gg-map-input"
          type="text"
          placeholder="Địa chỉ điểm đến"
          id="destination"
        />
      </el-form-item>
      Loại xe:
      <el-radio-group v-model="form.car_type" class="ml-4">
        <el-radio :label="1" size="large">4 chỗ</el-radio>
        <el-radio :label="2" size="large">7 chỗ</el-radio>
      </el-radio-group>
      <el-form-item>
        <el-button @click="submit" type="primary" :loading="loading"
          >Đặt chuyến</el-button
        >
      </el-form-item>
    </el-form>
    <div v-if="phoneBooked" class="">
      <DriversAccepted :drivers="driversAccepted" />
      <div class="mt-3">
        Các địa chỉ khách hàng sử dụng số điện thoại <b>{{ phoneBooked }}</b> đã đi gần
        đây
        <div v-for="destination in clientDesination" :key="destination._id" class="mb-1 mt-1">
          - {{destination.destination}}
        </div>
      </div>
    </div>
  </AdminContainer>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import tripApi from "@/services/factory/trip";
import userApi from "@/services/factory/user";
import SocketIOService from "@/services/socket/";
import DriversAccepted from "@/components/DriversAccepted/Index.vue";
import AdminContainer from "@/components/AdminContainer.vue";
import { ElMessage } from "element-plus";

const loading = ref(false);
const form = reactive({
  lat: "",
  lng: "",
  client_phone_number: "",
  car_type: 1,
});
const driversAccepted = ref([]);
const phoneBooked = ref("");
const clientDesination = ref([]);

init();

onMounted(() => {
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("departure"),
    {
      componentRestrictions: { country: "vn" },
      fields: ["address_components", "geometry", "icon", "name"],
    }
  );
  new google.maps.places.Autocomplete(document.getElementById("destination"), {
    componentRestrictions: { country: "vn" },
    fields: ["address_components", "geometry", "icon", "name"],
  });
  autocomplete.addListener("place_changed", () => {
    if (autocomplete === null) return;
    const departure = autocomplete.getPlace().geometry.location;
    form.lat = departure.lat();
    form.lng = departure.lng();
  });
});

function init() {
  SocketIOService.on("send-driver-info", async (id) => {
    const { user } = await userApi.getById(id);
    if (user) driversAccepted.value.push(user);
  });
  SocketIOService.on("finish-trip", () => {
    phoneBooked.value = false
  })
}
async function submit() {
  if (!isVietnamesePhoneNumber(form.client_phone_number)) {
    ElMessage({
      type: "error",
      message: "Số điện thoại không đúng định dạng",
    });
    return
  }

  loading.value = true;
  try {
    const departure = document.getElementById("departure").value;
    const destination = document.getElementById("destination").value;
    if (!(departure && destination && form.client_phone_number)) return;

    const formData = {
      departure,
      departure_lat: form.lat,
      departure_lng: form.lng,
      destination,
      status: 0,
      client_phone_number: form.client_phone_number,
      car_type: form.car_type,
    };
    const { trip } = await tripApi.book(formData);
    if (!trip) return;
    SocketIOService.emit("book-car", trip._id);
    getLatestDestination();
    form.lat = "";
    form.lng = "";
    document.getElementById("departure").value = "";
    document.getElementById("destination").value = "";
    form.client_phone_number = "";
    form.car_type = 1;
  } finally {
    loading.value = false;
  }
}
async function getLatestDestination() {
  phoneBooked.value = form.client_phone_number;
  const { trip } = await tripApi.getByPhone(phoneBooked.value);
  if (trip) clientDesination.value = trip;
}
function isVietnamesePhoneNumber(number) {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}
</script>

<style lang="css" scoped></style>
