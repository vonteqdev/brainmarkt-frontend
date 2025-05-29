<template>
  <div v-if="isLoadingClient" class="flex justify-center items-center h-64">
	<LoadingSpinner size="lg" color="text-brand-primary" />
  </div>
  <div v-else-if="clientLoadError" class="bg-red-50 p-6 rounded-lg shadow text-center">
	<ExclamationTriangleIcon class="h-12 w-12 mx-auto text-red-400 mb-3" />
	<h3 class="text-xl font-medium text-red-700">Error Loading Client Data</h3>
	<p class="text-red-600 mt-1">{{ clientLoadError }}</p>
	<NuxtLink to="/" class="mt-4 inline-block text-sm text-brand-primary hover:underline">Go back to Agency Dashboard</NuxtLink>
  </div>
  <div v-else-if="client" class="space-y-8">
	<div class="flex flex-wrap justify-between items-center gap-4">
	  <div>
		<h1 class="text-3xl font-bold text-gray-800">Dashboard: {{ client.name }}</h1>
		<p v-if="client.website" class="text-sm text-gray-500">
			<a :href="client.website" target="_blank" rel="noopener noreferrer" class="hover:text-brand-primary">{{ client.website }} <ArrowTopRightOnSquareIcon class="h-3 w-3 inline"/></a>
		</p>
	  </div>
	  <div class="bg-white p-2 rounded-md shadow">
		<span class="text-sm text-gray-600">[Date Range Selector Component Here]</span>
	  </div>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
	  <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
		<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue (GA4)</h3>
		<p class="mt-1 text-3xl font-semibold text-gray-900">{{ clientSummary?.totalRevenue || 'N/A' }}</p>
		</div>
	  <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
		<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Ad Spend</h3>
		<p class="mt-1 text-3xl font-semibold text-gray-900">{{ clientSummary?.totalAdSpend || 'N/A' }}</p>
	  </div>
	  <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
		<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Overall ROAS</h3>
		<p class="mt-1 text-3xl font-semibold text-gray-900">{{ clientSummary?.overallROAS || 'N/A' }}</p>
	  </div>
	  <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
		<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Conversions</h3>
		<p class="mt-1 text-3xl font-semibold text-gray-900">{{ clientSummary?.totalConversions || 'N/A' }}</p>
	  </div>
	</div>

	<div class="bg-white p-6 rounded-xl shadow-lg text-center">
	  <NuxtLink :to="`/clients/${client.id}/analytics/business-overview`" class="text-brand-primary hover:text-indigo-700 font-medium inline-flex items-center text-lg">
		View Full Business Overview Dashboard <ArrowRightIcon class="ml-2 h-5 w-5" />
	  </NuxtLink>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="bg-white p-6 rounded-xl shadow-lg">
		  <h2 class="text-xl font-semibold text-gray-800 mb-3">Data Sources Status</h2>
		  <p class="text-gray-600">Active Feeds: <span class="font-medium">{{ clientSummary?.activeFeedsCount || 0 }}</span></p>
		  <p v-if="clientSummary?.feedErrorsCount > 0" class="text-red-500 font-medium">Feed Errors: {{ clientSummary.feedErrorsCount }}</p>
		  <NuxtLink :to="`/clients/${client.id}/data-sources`" class="mt-3 inline-block text-sm text-brand-primary hover:text-indigo-700 font-medium">Manage Data Sources &rarr;</NuxtLink>
		</div>
		 <div class="bg-white p-6 rounded-xl shadow-lg">
		  <h2 class="text-xl font-semibold text-gray-800 mb-3">Recent Alerts</h2>
		  <p class="text-gray-500">No critical alerts at the moment.</p>
		   <NuxtLink :to="`/clients/${client.id}/optimizations`" class="mt-3 inline-block text-sm text-brand-primary hover:text-indigo-700 font-medium">View All Optimizations & Alerts &rarr;</NuxtLink>
		</div>
	</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Client } from '~/interfaces/client';
import { useApi } from '~/composables/useApi';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';
import { ArrowRightIcon, ExclamationTriangleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

definePageMeta({ middleware: 'auth', layout: 'default' });

const route = useRoute();
const { fetchApi } = useApi();
const clientId = route.params.id as string;

const client = ref<Client | null>(null);
const clientSummary = ref<any | null>({ /* Mock data for now */ totalRevenue: '$0.00', activeFeedsCount: 0, feedErrorsCount: 0, totalAdSpend: '$0.00', overallROAS: '0.00', totalConversions: '0' });
const isLoadingClient = ref(true);
const clientLoadError = ref<string | null>(null);

async function fetchClientData() {
  isLoadingClient.value = true;
  clientLoadError.value = null;
  try {
	client.value = await fetchApi(`/clients/${clientId}`);
	// TODO: Fetch client summary dashboard data from a dedicated API endpoint
	// clientSummary.value = await fetchApi(`/clients/${clientId}/dashboard-summary`);
	// For now, using mock data for clientSummary
  } catch (error: any) {
	console.error("Failed to fetch client data:", error);
	clientLoadError.value = error.data?.message || "Could not load client information.";
  } finally {
	isLoadingClient.value = false;
  }
}

onMounted(fetchClientData);
</script>
