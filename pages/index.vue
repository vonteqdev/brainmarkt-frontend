<template>
  <div class="space-y-6">
	<div class="flex flex-wrap justify-between items-center gap-4">
	  <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Agency Account Center</h1>
	  <button @click="openAddClientModal(null)"
			  class="inline-flex items-center justify-center px-5 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-lg shadow-sm hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition duration-150 ease-in-out">
		<PlusIcon class="h-5 w-5 mr-2 -ml-1" /> Add New Client
	  </button>
	</div>

	<div class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
	  <input type="text" v-model="searchQuery" placeholder="Search by Client Name or Website..."
			 class="w-full md:w-2/3 lg:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
	</div>

	<div v-if="isLoadingClients" class="text-center py-20">
	  <LoadingSpinner size="lg" color="text-brand-primary" />
	  <p class="mt-4 text-gray-600 text-lg">Loading clients...</p>
	</div>
	<div v-else-if="filteredClients.length === 0 && !searchQuery" class="text-center py-20 bg-white rounded-lg shadow-md">
	  <DocumentTextIcon class="h-16 w-16 mx-auto text-gray-400 mb-4" />
	  <h3 class="text-xl font-medium text-gray-700">No clients yet.</h3>
	  <p class="text-gray-500 mt-1">Click "Add New Client" to get started and manage their performance!</p>
	</div>
	 <div v-else-if="filteredClients.length === 0 && searchQuery" class="text-center py-20 bg-white rounded-lg shadow-md">
	  <MagnifyingGlassIcon class="h-16 w-16 mx-auto text-gray-400 mb-4" />
	  <h3 class="text-xl font-medium text-gray-700">No clients found</h3>
	  <p class="text-gray-500 mt-1">No clients match your search for "{{ searchQuery }}". Try a different term.</p>
	</div>
	<div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
	  <div v-for="client in filteredClients" :key="client.id"
		   class="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between">
		<div>
		  <div class="flex items-start justify-between mb-3">
			<div class="flex items-center gap-3">
			  <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-brand-primary text-xl font-semibold shrink-0">
				{{ client.name.substring(0,1).toUpperCase() }}
			  </div>
			  <div>
				<NuxtLink :to="`/clients/${client.id}/dashboard`" class="block text-lg font-semibold text-gray-800 hover:text-brand-primary leading-tight" :title="client.name">
				  {{ client.name }}
				</NuxtLink>
				<a v-if="client.website" :href="client.website" target="_blank" rel="noopener noreferrer" class="text-xs text-gray-500 hover:text-brand-primary inline-flex items-center">
				  {{ client.website }} <ArrowTopRightOnSquareIcon class="h-3 w-3 ml-1" />
				</a>
			  </div>
			</div>
			<Menu as="div" class="relative shrink-0">
			  <MenuButton class="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary">
				<EllipsisVerticalIcon class="h-5 w-5" />
			  </MenuButton>
			  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
				<MenuItems class="absolute right-0 mt-1 w-48 origin-top-right bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
				  <div class="py-1">
					<MenuItem v-slot="{ active }">
					  <NuxtLink :to="`/clients/${client.id}/dashboard`" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">View Dashboard</NuxtLink>
					</MenuItem>
					<MenuItem v-slot="{ active }">
					  <button @click="openAddClientModal(client)" :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']">Edit Details</button>
					</MenuItem>
					<MenuItem v-slot="{ active }">
					  <NuxtLink :to="`/clients/${client.id}/data-sources`" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Manage Data Sources</NuxtLink>
					</MenuItem>
					</div>
				</MenuItems>
			  </transition>
			</Menu>
		  </div>
		  <div class="text-sm space-y-1 my-3 text-gray-600">
			<p v-if="client.industry"><span class="font-medium">Industry:</span> {{ client.industry }}</p>
			</div>
		</div>
		<div class="mt-auto pt-4 border-t border-gray-200">
		   <NuxtLink :to="`/clients/${client.id}/dashboard`" class="w-full text-center block px-4 py-2 bg-slate-50 text-sm font-medium text-brand-primary rounded-md hover:bg-indigo-100 transition duration-150">
			Go to Client Dashboard &rarr;
		  </NuxtLink>
		</div>
	  </div>
	</div>

	<AddEditClientModal v-if="showClientModal" :isOpen="showClientModal" :clientToEdit="editingClient" @close="showClientModal = false" @client-saved="handleClientSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AddEditClientModal from '~/components/clients/AddEditClientModal.vue';
import type { Client } from '~/interfaces/client';
import { useApi } from '~/composables/useApi';
import { PlusIcon, EllipsisVerticalIcon, ArrowTopRightOnSquareIcon, DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';

definePageMeta({ middleware: 'auth', layout: 'default' });

const { fetchApi } = useApi();
const clients = ref<Client[]>([]);
const isLoadingClients = ref(true);
const showClientModal = ref(false);
const editingClient = ref<Client | null>(null);
const searchQuery = ref('');

async function fetchClients() {
  isLoadingClients.value = true;
  try {
	const response = await fetchApi('/clients', { params: { per_page: 100 } }); // Fetch more for local filtering for now
	clients.value = response.data || response; // Adjust if API response structure is { data: [], links: {}, meta: {} }
  } catch (error: any) {
	console.error("Failed to fetch clients:", error);
	// Use a toast notification for user-facing error
	// For example: useToast().error(error.data?.message || "Failed to load clients.");
  } finally {
	isLoadingClients.value = false;
  }
}

const filteredClients = computed(() => {
  if (!searchQuery.value.trim()) {
	return clients.value;
  }
  return clients.value.filter(client =>
	client.name.toLowerCase().includes(searchQuery.value.toLowerCase().trim()) ||
	(client.website && client.website.toLowerCase().includes(searchQuery.value.toLowerCase().trim()))
  );
});

function openAddClientModal(client: Client | null = null) {
  editingClient.value = client;
  showClientModal.value = true;
}

function handleClientSaved() {
  fetchClients(); // Re-fetch the list after a client is saved
  // Optionally show a success toast notification
}

onMounted(fetchClients);
</script>
