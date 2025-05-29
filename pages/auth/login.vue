<template>
  <div>
	<slot name="title">
	  <h2 class="mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
		Sign in to BrainMarkt
	  </h2>
	</slot>
	<form class="mt-8 space-y-6" @submit.prevent="handleLogin">
	  <div v-if="errorMessage" class="p-3 mb-4 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
		{{ errorMessage }}
	  </div>
	  <div class="rounded-md shadow-sm -space-y-px">
		<div>
		  <label for="email-address" class="sr-only">Email address</label>
		  <input id="email-address" name="email" type="email" autocomplete="email" required
				 v-model="credentials.email"
				 class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
				 placeholder="Email address">
		</div>
		<div>
		  <label for="password" class="sr-only">Password</label>
		  <input id="password" name="password" type="password" autocomplete="current-password" required
				 v-model="credentials.password"
				 class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
				 placeholder="Password">
		</div>
	  </div>

	  <div class="flex items-center justify-between text-sm">
		<div class="flex items-center">
		  <input id="remember-me" name="remember-me" type="checkbox" v-model="credentials.remember_me"
				 class="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded">
		  <label for="remember-me" class="ml-2 block text-gray-900"> Remember me </label>
		</div>
		<div >
		  <NuxtLink to="/auth/forgot-password" class="font-medium text-brand-primary hover:text-indigo-500"> Forgot your password? </NuxtLink>
		</div>
	  </div>

	  <div>
		<button type="submit" :disabled="authStore.isLoading"
				class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-75 disabled:cursor-not-allowed">
		  <LoadingSpinner v-if="authStore.isLoading" class="h-5 w-5 mr-2" />
		  {{ authStore.isLoading ? 'Signing In...' : 'Sign In' }}
		</button>
	  </div>
	</form>
	<p class="mt-8 text-center text-sm text-gray-600">
	  Don't have an account?
	  <NuxtLink to="/auth/register" class="font-medium text-brand-primary hover:text-indigo-500"> Sign Up </NuxtLink>
	</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/store/auth';
import type { LoginCredentials } from '~/interfaces/auth';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';

definePageMeta({ layout: 'auth', middleware: 'guest' }); // guest middleware redirects if already logged in

const authStore = useAuthStore();
const credentials = ref<LoginCredentials>({ email: '', password: '', remember_me: false });
const errorMessage = ref<string | null>(null);

async function handleLogin() {
  errorMessage.value = null;
  try {
	await authStore.login(credentials.value);
	// Navigation is handled within the store's login action upon success
  } catch (error: any) {
	errorMessage.value = error.data?.message || error.message || 'Login failed. Please check your credentials.';
	console.error(error);
  }
}
</script>
