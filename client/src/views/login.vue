<template>
  <div class="bg-login"></div>
  <el-form
    ref="formRef"
    :model="form"
    status-icon
    class="login-form"
    label-position="top"
    @keyup.enter="submit(formRef)"
  >
    <div>
      Chào mừng đến
      <el-link type="primary" :underline="false"><b>ZDriver</b></el-link>
    </div>
    <div class="login-title">Đăng nhập</div>
    <el-form-item
      prop="username"
      label="Tên tài khoản"
      :rules="[
        {
          required: true,
          message: 'Vui lòng nhập tên tài khoản',
          trigger: ['blur', 'change'],
        },
      ]"
    >
      <el-input v-model="form.username" type="text" autocomplete="off" />
    </el-form-item>
    <el-form-item
      prop="password"
      label="Mật khẩu"
      :rules="[
        {
          required: true,
          message: 'Vui lòng nhập mật khẩu',
          trigger: ['blur', 'change'],
        },
      ]"
    >
      <el-input v-model="form.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="large"
        :loading="loading"
        @click="submit(formRef)"
        >Đăng nhập</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from "vue";
import authApi from "@/services/factory/auth";
import { useAuthStore } from "@/stores/";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const formRef = ref(null);
const form = reactive({
  username: "",
  password: "",
});
const loading = ref(false);

function submit(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      login();
      return true;
    }
    return false;
  });
}
async function login() {
  const noti = (title, message, type = "success") =>
    ElMessage({
      message,
      type,
    });
  try {
    loading.value = true;
    const { token } = await authApi.login(form.username, form.password);
    if (!token) {
      noti("Lỗi", "Có lỗi xảy ra, vui lòng thử lại sau", "error");
      return;
    }
    localStorage.setItem("token", token);
    await fetchUser();

    noti("Thành công", "Đăng nhập thành công");
  } catch {
    noti("Lỗi", "Tên tài khoản hoặc mật khẩu không đúng", "error");
  } finally {
    loading.value = false;
  }
}
async function fetchUser() {
  try {
    const data = await authApi.get();
    auth.set(data);
    const route = data.username === "admin" ? "admin" : "";
    router.push("/" + route);
  } catch (e) {
    throw e;
  }
}
</script>

<style scpoed>
.bg-login {
  background-image: url("@/assets/images/bg-login.jpg");
  background-position: center center;
  height: 100vh;
  background-size: cover;
}
.login-form {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 10px 15px;
  border-radius: 10px;
  background: hsla(0, 0%, 100%, 0.3);
  backdrop-filter: blur(25px);
}
.login-title {
  font-size: 32px;
  font-weight: bold;
  padding: 10px 0 25px;
}
.el-button--large {
  margin-top: 15px;
  width: 100%;
}
</style>
