<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// You can add global head metadata here if needed
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - BrainMarkt` : 'BrainMarkt';
  }
})
</script>