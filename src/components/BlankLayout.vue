<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
    // Blank layout: renders only slot content, no header/footer
</script>

<style scoped>
    /* Optionally, add minimal background styling */
    :host {
        display: block;
        min-height: 100vh;
        background: #222;
    }
</style>
