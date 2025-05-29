<template>
  <div>
	<slot name="title">
	  <h2 class="mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
		Create your Agency Account
	  </h2>
	</slot>
	<form class="mt-8 space-y-6" @submit.prevent="handleRegister">
	  <div v-if="errorMessage" class="p-3 mb-4 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
		{{ errorMessage }}
		<ul v-if="validationErrors" class="list-disc list-inside mt-1">
			<li v-for="(errors, field) in validationErrors" :key="field">
				<span class="font-medium">{{ field.replace(/_/g, ' ') }}:</span> {{ errors.join(', ') }}
			</li>
		</ul>
	  </div>

	  <div class="rounded-md shadow-sm -space-y-px">
		<div>
		  <label for="agency-name" class="sr-only">Agency Name</label>
		  <input id="agency-name" type="text" required v-model="details.agency_name" placeholder="Agency Name"
				 class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
		</div>
		<div>
		  <label for="full-name" class="sr-only">Your Full Name</label>
		  <input id="full-name" type="text" required v-model="details.name" placeholder="Your Full Name"
				 class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
		</div>
		<div>
		  <label for="email-address" class="sr-only">Email address</label>
		  <input id="email-address" type="email" autocomplete="email" required v-model="details.email" placeholder="Email address"
				 class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
		</div>
		<div>
		  <label for="password" class="sr-only">Password</label>
		  <input id="password" type="password" autocomplete="new-password" required v-model="details.password" placeholder="Password (min. 8 characters)"
				 class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
		</div>
		<div>
		  <label for="password-confirmation" class="sr-only">Confirm Password</label>
		  <input id="password-confirmation" type="password" autocomplete="new-password" required v-model="details.password_confirmation" placeholder="Confirm Password"
				 class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
		</div>
		<div>
		  <label for="timezone" class="sr-only">Timezone</label>
		  <select id="timezone" name="timezone" required v-model="details.timezone"
				  class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
			<option value="" disabled>Select your timezone</option>
			<option value="Europe/Bucharest">Europe/Bucharest</option>
			<option value="UTC">UTC</option>
			</select>
		</div>
	  </div>
	  <div class="flex items-start">
		<div class="flex items-center h-5">
			<input id="agree-terms" name="agree_terms" type="checkbox" required v-model="agreeToTerms"
				class="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-300 rounded">
		</div>
		<div class="ml-3 text-sm">
			<label for="agree-terms" class="font-medium text-gray-700">I agree to the</label>
			<NuxtLink to="/terms" target="_blank" class="font-medium text-brand-primary hover:text-indigo-500"> Terms of Service </NuxtLink>
			and
			<NuxtLink to="/privacy" target="_blank" class="font-medium text-brand-primary hover:text-indigo-500"> Privacy Policy</NuxtLink>.
		</div>
	  </div>
	  <div>
		<button type="submit" :disabled="authStore.isLoading || !agreeToTerms"
				class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-75 disabled:cursor-not-allowed">
		  <LoadingSpinner v-if="authStore.isLoading" class="h-5 w-5 mr-2" />
		  {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
		</button>
	  </div>
	</form>
	 <p class="mt-8 text-center text-sm text-gray-600">
	  Already have an account?
	  <NuxtLink to="/auth/login" class="font-medium text-brand-primary hover:text-indigo-500"> Sign In </NuxtLink>
	</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/store/auth';
import type { RegisterDetails } from '~/interfaces/auth';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';

definePageMeta({ layout: 'auth', middleware: 'guest' });

const authStore = useAuthStore();
const details = ref<RegisterDetails>({
  agency_name: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  timezone: 'UTC', // Default or auto-detect
});
const agreeToTerms = ref(false);
const errorMessage = ref<string | null>(null);
const validationErrors = ref<Record<string, string[]> | null>(null); // For Laravel validation errors

async function handleRegister() {
  errorMessage.value = null;
  validationErrors.value = null;
  if (!agreeToTerms.value) {
	errorMessage.value = "You must agree to the terms and privacy policy.";
	return;
  }
  try {
	await authStore.register(details.value);
	// Navigation is handled within the store's register action upon success (e.g., to login)
  } catch (error: any) {
	if (error.data && error.data.errors) { // Handle Laravel validation errors
		validationErrors.value = error.data.errors;
		errorMessage.value = error.data.message || "Please check the form for errors.";
	} else {
		errorMessage.value = error.data?.message || error.message || 'An unexpected error occurred during registration.';
	}
	console.error(error);
  }
}
</script>
