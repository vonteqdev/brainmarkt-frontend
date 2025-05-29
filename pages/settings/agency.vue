<template>
  <div class="space-y-8 max-w-4xl mx-auto">
	<h1 class="text-3xl font-bold text-gray-800">Agency Settings</h1>

	<div class="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
	  <div class="border-b border-gray-200 mb-6">
		<nav class="-mb-px flex space-x-8" aria-label="Tabs">
		  <button @click="activeTab = 'profile'"
				  :class="['whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm focus:outline-none', activeTab === 'profile' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
			Agency Profile
		  </button>
		  <button @click="activeTab = 'team'"
				  :class="['whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm focus:outline-none', activeTab === 'team' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
			Team Members
		  </button>
		  </nav>
	  </div>

	  <div v-if="activeTab === 'profile'">
		<h2 class="text-xl font-semibold text-gray-800 mb-1">Agency Information</h2>
		<p class="text-sm text-gray-500 mb-6">Update your agency's profile details. This information may be used in reports.</p>
		<form v-if="!isLoadingProfile && agencyForm" @submit.prevent="updateAgencyProfile" class="space-y-6">
		  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
			<div>
			  <label for="agency-name" class="block text-sm font-medium text-gray-700">Agency Name</label>
			  <input type="text" id="agency-name" v-model="agencyForm.name" required
					 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
			</div>
			<div>
			  <label for="contact-person" class="block text-sm font-medium text-gray-700">Contact Person</label>
			  <input type="text" id="contact-person" v-model="agencyForm.contact_person_name"
					 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
			</div>
			<div>
			  <label for="contact-email" class="block text-sm font-medium text-gray-700">Contact Email</label>
			  <input type="email" id="contact-email" v-model="agencyForm.contact_email" required
					 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
			</div>
			<div>
			  <label for="phone-number" class="block text-sm font-medium text-gray-700">Phone Number</label>
			  <input type="tel" id="phone-number" v-model="agencyForm.phone_number"
					 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
			</div>
			<div class="md:col-span-2">
			  <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
			  <input type="url" id="website" v-model="agencyForm.website" placeholder="[https://youragency.com](https://youragency.com)"
					 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
			</div>
			<div class="md:col-span-2">
			  <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
			  <textarea id="address" v-model="agencyForm.address" rows="3"
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"></textarea>
			</div>
			<div>
			  <label for="timezone" class="block text-sm font-medium text-gray-700">Timezone</label>
			   <select id="timezone" v-model="agencyForm.timezone" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
					<option value="UTC">UTC</option>
					<option value="Europe/London">Europe/London</option>
					<option value="Europe/Berlin">Europe/Berlin</option>
					<option value="Europe/Bucharest">Europe/Bucharest</option>
					<option value="America/New_York">America/New_York</option>
					<option value="America/Los_Angeles">America/Los_Angeles</option>
					</select>
			</div>
			<div>
			  <label for="currency" class="block text-sm font-medium text-gray-700">Default Currency</label>
			   <select id="currency" v-model="agencyForm.currency_preference" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
					<option value="USD">USD ($)</option>
					<option value="EUR">EUR (€)</option>
					<option value="GBP">GBP (£)</option>
					<option value="RON">RON (lei)</option>
					</select>
			</div>
		  </div>
		  <div class="pt-2">
			<button type="submit" :disabled="isSavingProfile"
					class="inline-flex items-center justify-center px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg shadow-sm hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-75">
			  <LoadingSpinner v-if="isSavingProfile" size="sm" class="mr-2 -ml-1"/>
			  {{ isSavingProfile ? 'Saving Profile...' : 'Save Profile Changes' }}
			</button>
		  </div>
		   <div v-if="profileSuccessMessage" class="mt-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm">{{ profileSuccessMessage }}</div>
		   <div v-if="profileErrorMessage" class="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">{{ profileErrorMessage }}</div>
		</form>
		 <div v-else-if="isLoadingProfile" class="py-10 text-center"><LoadingSpinner size="md" /> Loading profile...</div>
		 <div v-else class="py-10 text-center text-red-500">Could not load agency profile. Please try again.</div>
	  </div>

	  <div v-if="activeTab === 'team'">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-semibold text-gray-800">Team Members</h2>
			<button @click="showInviteModal = true" class="inline-flex items-center px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
				<PlusIcon class="h-4 w-4 mr-2 -ml-1" /> Invite Team Member
			</button>
		</div>
		<p class="text-gray-500">Team member management UI and API integration placeholder. (Table to list members, edit roles, deactivate, resend invites).</p>
	  </div>
	</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/store/auth';
import { useApi } from '~/composables/useApi';
import type { Agency } from '~/interfaces/auth'; // Assuming User interface has Agency details or create separate Agency interface
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';
import { PlusIcon } from '@heroicons/vue/24/solid';

definePageMeta({ middleware: 'auth', layout: 'default' });

const authStore = useAuthStore();
const { fetchApi } = useApi();

const activeTab = ref('profile');
const agencyForm = ref<Partial<Agency>>({});
const isLoadingProfile = ref(true);
const isSavingProfile = ref(false);
const profileSuccessMessage = ref('');
const profileErrorMessage = ref('');

const showInviteModal = ref(false); // For team member invite modal

async function fetchAgencyProfile() {
  isLoadingProfile.value = true;
  profileErrorMessage.value = '';
  profileSuccessMessage.value = '';
  try {
	const agencyData = await fetchApi('/agency');
	agencyForm.value = agencyData;
  } catch (error: any) {
	console.error("Failed to fetch agency profile:", error);
	profileErrorMessage.value = error.data?.message || "Could not load agency profile.";
  } finally {
	isLoadingProfile.value = false;
  }
}

async function updateAgencyProfile() {
  isSavingProfile.value = true;
  profileSuccessMessage.value = '';
  profileErrorMessage.value = '';
  try {
	const updatedAgencyData = await fetchApi('/agency', {
	  method: 'PUT',
	  body: agencyForm.value,
	});
	// Update the agency data in the auth store if it's stored there
	if (authStore.user) {
		authStore.setUser({ ...authStore.user, agency: updatedAgencyData });
	}
	agencyForm.value = updatedAgencyData; // Update local form with response from API
	profileSuccessMessage.value = 'Agency profile updated successfully!';
	setTimeout(() => profileSuccessMessage.value = '', 3000);
  } catch (error: any) {
	profileErrorMessage.value = error.data?.message || 'Failed to update profile.';
	if (error.data?.errors) {
		// Handle validation errors display if needed by parsing error.data.errors
		console.error("Validation Errors:", error.data.errors);
	}
	console.error("Failed to update agency profile:", error);
  } finally {
	isSavingProfile.value = false;
  }
}

onMounted(() => {
  fetchAgencyProfile();
  // fetchTeamMembers(); // Implement this when team member UI is built
});
</script>
