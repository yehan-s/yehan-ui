<template>
    <button>按钮</button>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'

defineComponent({
    name: 'YButton'
})

defineExpose({
    name: 'YButton'
})
</script>

<style scoped>

</style>