// ~/middleware/auth.ts
import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const authStore = useAuthStore();

  // Dacă nu avem user-ul încărcat și nu e deja în fetch
  if (!authStore.isAuthenticated && !authStore.isLoading) {
	await authStore.fetchUser();
  }

  // Dacă încă nu e autentificat după fetch
  if (!authStore.isAuthenticated) {
	const intendedPath = useCookie('intended_path', {
	  maxAge: 300, // 5 minute
	});

	// Salvează ruta curentă pentru redirect după login
	if (to.fullPath !== '/auth/login' && to.fullPath !== '/') {
	  intendedPath.value = to.fullPath;
	} else {
	  intendedPath.value = null;
	}

	return navigateTo('/auth/login', { replace: true });
  }
});
