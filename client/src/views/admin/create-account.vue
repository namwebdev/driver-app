<template>
  <AdminContainer>
    <el-form
      :model="form"
      status-icon
      class="login-form"
      label-position="top"
      @keyup.enter="submit()"
    >
      <el-form-item>
        <el-input
          v-model="form.username"
          placeholder="Tên tài khoản"
          type="text"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.password"
          placeholder="Mật khẩu"
          type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.name" placeholder="Tên tài xế" type="text" />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.phone"
          placeholder="Số điện thoại"
          type="text"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.avatar" placeholder="Link avatar" type="text" />
      </el-form-item>
      <el-form-item>
        <input
          type="text"
          id="location"
          class="gg-map-input"
          placeholder="Vị trí tài xế"
        />
      </el-form-item>
      <el-form-item>
        Loại xe:
        <el-radio-group v-model="form.car_type" class="ml-4">
          <el-radio :label="1" size="large">4 chỗ</el-radio>
          <el-radio :label="2" size="large">7 chỗ</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">Tạo tài khoản</el-button>
      </el-form-item>
    </el-form>
  </AdminContainer>
</template>

<script setup>
import AdminContainer from "@/components/AdminContainer.vue";
import { reactive, onMounted } from "vue";
import userApi from "@/services/factory/user";
import { ElMessage } from "element-plus";

const form = reactive({
  username: "",
  password: "",
  name: "",
  phone: "",
  avatar: "",
  lat: 10,
  lng: 10,
  car_type: 1,
});

onMounted(() => {
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("location"),
    {
      componentRestrictions: { country: "vn" },
      fields: ["address_components", "geometry", "icon", "name"],
    }
  );
  autocomplete.addListener("place_changed", () => {
    if (autocomplete === null) return;
    const departure = autocomplete.getPlace().geometry.location;
    form.lat = departure.lat();
    form.lng = departure.lng();
  });
});

async function submit() {
  const data = {
    username: form.username,
    password: form.password,
    name: form.name,
    lat: form.lat,
    lng: form.lng,
    car_type: form.car_type,
    phone: form.phone,
    avatar: form.avatar,
  };
  await userApi.register(data);
  ElMessage({
    type: "success",
    message: "Tạo tài khoản thành công",
  });
  form.username = ""
  form.password = ""
  form.name = ""
  form.lat = ""
  form.lng = ""
  form.car_type = 1
  form.phone = ""
  form.avatar = ""

}
</script>

<style lang="css" scoped></style>
