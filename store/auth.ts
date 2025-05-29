// ~/store/auth.ts
import { defineStore } from 'pinia';
import type { User, LoginCredentials, RegisterDetails } from '~/interfaces/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
	user: null as User | null,
	isAuthenticated: false,
	isLoading: false,
  }),
  getters: {
	currentUser: (state) => state.user,
	isLoggedIn: (state) => state.isAuthenticated,
  },
  actions: {
	async fetchUser() {
	  if (this.user) return this.user;
	  this.isLoading = true;
	  try {
		const config = useRuntimeConfig();
		const data = await $fetch<User>(`${config.public.apiBaseUrl}/user`, {
		  credentials: 'include',
		  headers: {
			Accept: 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
		  },
		});
		this.user = data;
		this.isAuthenticated = true;
	  } catch {
		this.user = null;
		this.isAuthenticated = false;
	  } finally {
		this.isLoading = false;
	  }
	},

	setUser(userData: User | null) {
	  this.user = userData;
	  this.isAuthenticated = !!userData;
	},

	async login(credentials: LoginCredentials) {
	  this.isLoading = true;
	  const config = useRuntimeConfig();
	  try {
		// 🔐 Important: get CSRF cookie first
		await $fetch(`${config.public.laravelBaseUrl}/sanctum/csrf-cookie`, {
		  credentials: 'include',
		});

		await $fetch(`${config.public.apiBaseUrl}/login`, {
		  method: 'POST',
		  body: credentials,
		  credentials: 'include',
		  headers: {
			Accept: 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
		  },
		});

		await this.fetchUser();

		if (this.isAuthenticated) {
		  const intendedPath = useCookie('intended_path');
		  const redirectPath = intendedPath.value || '/';
		  intendedPath.value = null;
		  navigateTo(redirectPath);
		} else {
		  throw new Error('Login succeeded but failed to fetch user details.');
		}
	  } catch (error: any) {
		this.user = null;
		this.isAuthenticated = false;
		console.error('Login error:', error);
		throw error;
	  } finally {
		this.isLoading = false;
	  }
	},

	async register(details: RegisterDetails) {
	  this.isLoading = true;
	  const config = useRuntimeConfig();
	  try {
		await $fetch(`${config.public.laravelBaseUrl}/sanctum/csrf-cookie`, {
		  credentials: 'include',
		});

		await $fetch(`${config.public.apiBaseUrl}/register`, {
		  method: 'POST',
		  body: details,
		  credentials: 'include',
		  headers: {
			Accept: 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
		  },
		});

		navigateTo('/auth/login?registered=true');
	  } catch (error: any) {
		console.error('Registration error:', error);
		throw error;
	  } finally {
		this.isLoading = false;
	  }
	},

	async logout() {
	  this.isLoading = true;
	  const config = useRuntimeConfig();
	  try {
		await $fetch(`${config.public.apiBaseUrl}/logout`, {
		  method: 'POST',
		  credentials: 'include',
		});
	  } catch (error: any) {
		console.warn('Logout error (ignored):', error);
	  } finally {
		this.user = null;
		this.isAuthenticated = false;
		this.isLoading = false;
		navigateTo('/auth/login');
	  }
	},
  },
});
