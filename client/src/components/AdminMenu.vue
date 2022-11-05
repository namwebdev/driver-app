<template>
  <el-menu :default-active="activeMenu" class="el-menu-vertical-demo">
    <el-menu-item index="1" @click="handleClick(true)">
      <el-icon><icon-menu /></el-icon>
      <template #title>Đặt xe</template>
    </el-menu-item>
    <el-menu-item index="2" @click="handleClick(false)">
      <el-icon><document /></el-icon>
      <template #title>Tạo tài khoản</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import { computed } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const activeMenu = computed(() => {
  if (route.path === "/admin") return "1";
  else return "2";
});

function handleClick(val) {
  const route = val ? "/admin" : "/admin/create-account";
  router.push(route);
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
  /* min-height: 400px; */
}
</style>
