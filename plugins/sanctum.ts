// plugins/sanctum.ts
import { useAuthStore } from '~/store/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  // Access Pinia instance from nuxtApp if needed, or it should be auto-available
  const authStore = useAuthStore(nuxtApp.$pinia);

  // Fetch CSRF cookie for Sanctum on initial app load if on client
  if (process.client) {
	try {
	  await $fetch(`${config.public.laravelBaseUrl}/sanctum/csrf-cookie`, {
		// No specific headers needed usually, browser handles cookies
	  });
	} catch (error) {
	  console.error("Failed to fetch CSRF cookie:", error);
	}

	// Attempt to fetch user details if no user is currently in the store.
	// This helps re-establish session on page refresh if user was previously logged in.
	if (!authStore.isAuthenticated && !authStore.isLoading) {
	  await authStore.fetchUser();
	}
  }
});
