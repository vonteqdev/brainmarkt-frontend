// ~/middleware/guest.ts
import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const authStore = useAuthStore();

  if (!authStore.user && !authStore.isLoading && !authStore.isAuthenticated) {
    await authStore.fetchUser();
  }

  if (authStore.isAuthenticated) {
    return navigateTo('/', { replace: true });
  }
});
