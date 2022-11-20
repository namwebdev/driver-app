<template>
  <div class="info-overview">
    <div class="info-overview-main">
      <div class="mb-1">
        <img class="avatar" :src="avatar" alt="avatar" />
      </div>
      <div>
        <b class="f-18">{{ name }}</b>
        <div class="mt-0-5 mb-1">{{ phone }}</div>
      </div>
      <el-button @click="show = true" type="primary" size="small"
        >Cập nhật vị trí</el-button
      >
    </div>
    <div class="info-overview-bg"></div>
  </div>

  <el-dialog v-model="show" title="Cập nhật vị trí" width="100%" center>
    <input type="text" id="location" placeholder="Nhập địa chỉ" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">Hủy</el-button>
        <el-button type="primary" @click="submit"> Cập nhật </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onUpdated, reactive, ref } from "vue";
import { useAuthStore } from "@/stores";
import userApi from "@/services/factory/user";
import { ElMessage } from "element-plus";

const auth = useAuthStore();

const show = ref(false);
const form = reactive({
  lat: "",
  lng: "",
});
const isLoadAutocomplete = ref(null);

const name = computed(() => auth.user?.name);
const phone = computed(() => auth.user?.phone);
const avatar = computed(() => auth.user?.avatar);

onUpdated(() => {
  if (!show || isLoadAutocomplete.value) return;
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("location"),
    {
      componentRestrictions: { country: "vn" },
      fields: ["address_components", "geometry", "icon", "name"],
    }
  );
  isLoadAutocomplete.value = !!autocomplete;
  autocomplete.addListener("place_changed", () => {
    if (autocomplete === null) return;
    const departure = autocomplete.getPlace().geometry.location;
    form.lat = departure.lat();
    form.lng = departure.lng();
  });
});

async function submit() {
  const formData = {
    lat: form.lat,
    lng: form.lng,
  };
  const data = await userApi.update(auth.user._id, formData);
  if (!data) return;
  ElMessage({
    type: "success",
    message: "Cập nhật vị trí thành công",
  });
  auth.update(formData);
  show.value = false;
}
</script>

<style lang="css" scoped>
.info-overview {
  width: 100%;
  height: 235px;
  display: flex;
  align-items: flex-end;
  background: blue;
  position: relative;
  background-image: url("@/assets/images/bg-login.jpg");
  background-position: center center;
  background-size: cover;
  margin-bottom: 40px;
}
.info-overview-main {
  width: 100%;
  text-align: center;
  position: absolute;
}
.info-overview-bg {
  width: 100%;
  height: 55%;
  background: white;
  border-radius: 40px 40px 0px 0px;
  margin: -2px 8px;
}
.avatar {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
  object-fit: cover;
}
</style>
