<template>
  <div class="d-fl">
    <AdminMenu />
    <div class="admin-container">
      <slot />
    </div>
  </div>
</template>

<script setup>
import AdminMenu from "@/components/AdminMenu.vue";
</script>

<style lang="css" scoped>
.admin-container {
  margin-left: 50px;
  margin-top: 20px;
}
</style>
