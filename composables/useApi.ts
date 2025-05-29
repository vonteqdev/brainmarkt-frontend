import { useAuthStore } from '~/store/auth';

export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const customFetch = $fetch.create({
	baseURL: apiBaseUrl,
	credentials: 'include', // very important for cookie-based auth

	onRequest({ options }) {
	  options.headers = (options.headers || {}) as Record<string, string>;
	  options.headers['Accept'] = 'application/json';
	  options.headers['X-Requested-With'] = 'XMLHttpRequest';

	  // ✅ CSRF header from XSRF-TOKEN cookie
	  if (process.client) {
		const token = useCookie('XSRF-TOKEN').value;
		if (token) {
		  options.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
		}
	  }
	},

	async onResponseError({ request, response }) {
	  console.error(`[API Fetch Error] ${response.status} ${request.toString()}:`, response._data || response.statusText);

	  if ((response.status === 401 || response.status === 419) && process.client) {
		const authStore = useAuthStore();
		const currentPath = useRouter().currentRoute.value.path;

		if (currentPath !== '/auth/login' && request.toString() !== `${apiBaseUrl}/user`) {
		  console.warn('API session expired or unauthorized. Redirecting to login.');
		  await authStore.logout();
		} else if (request.toString() === `${apiBaseUrl}/user` && currentPath !== '/auth/login') {
		  navigateTo('/auth/login');
		}
	  }

	  throw {
		status: response.status,
		message: response._data?.message || `API Error: ${response.status}`,
		data: response._data,
	  };
	}
  });

  return {
	fetchApi: customFetch,
  };
};
