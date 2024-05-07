<script setup lang="tsx">
import { ElRow, ElCol } from 'element-plus'
</script>
<template>
  <ElRow>
    <ElCol :span="12">
      <div style="width: fit-content">
        <slot name="left"></slot>
      </div>
    </ElCol>
    <ElCol :span="12">
      <div class="float-right mb-15px">
        <slot name="right"> </slot>
      </div>
    </ElCol>
  </ElRow>
</template>
<style scoped></style>
