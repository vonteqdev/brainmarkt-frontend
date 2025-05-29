<template>
  <div class="flex h-screen bg-gray-50 text-gray-800">
	<AppSidebar /> <div class="flex-1 flex flex-col overflow-hidden">
	  <AppHeader /> <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
		<slot /> </main>
	</div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '~/components/layout/AppSidebar.vue';
import AppHeader from '~/components/layout/AppHeader.vue';

// Potentially fetch initial user data or check auth status here if needed globally for layout
// const authStore = useAuthStore();
// if (!authStore.isAuthenticated) {
//   await authStore.fetchUser();
// }
</script>

<style scoped>
/* Scoped styles for the default layout if needed */
</style>
