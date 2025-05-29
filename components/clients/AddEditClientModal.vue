<template>
  <TransitionRoot appear :show="isOpen" as="template">
	<Dialog as="div" @close="closeModal" class="relative z-50">
	  <TransitionChild
		as="template"
		enter="duration-300 ease-out"
		enter-from="opacity-0"
		enter-to="opacity-100"
		leave="duration-200 ease-in"
		leave-from="opacity-100"
		leave-to="opacity-0"
	  >
		<div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
	  </TransitionChild>

	  <div class="fixed inset-0 overflow-y-auto">
		<div class="flex min-h-full items-center justify-center p-4 text-center">
		  <TransitionChild
			as="template"
			enter="duration-300 ease-out"
			enter-from="opacity-0 scale-95"
			enter-to="opacity-100 scale-100"
			leave="duration-200 ease-in"
			leave-from="opacity-100 scale-100"
			leave-to="opacity-0 scale-95"
		  >
			<DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
			  <DialogTitle as="h3" class="text-xl font-semibold leading-6 text-gray-900 mb-6">
				{{ modalTitle }}
			  </DialogTitle>
			  <form @submit.prevent="saveClient" class="space-y-5">
				<div v-if="errorMessage" class="p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
				  {{ errorMessage }}
				   <ul v-if="validationErrors" class="list-disc list-inside mt-1">
					  <li v-for="(errors, field) in validationErrors" :key="field">
						  <span class="font-medium">{{ field.replace(/_/g, ' ') }}:</span> {{ errors.join(', ') }}
					  </li>
				  </ul>
				</div>
				<div>
				  <label for="client-name" class="block text-sm font-medium text-gray-700 mb-1">Client Name <span class="text-red-500">*</span></label>
				  <input type="text" id="client-name" v-model="form.name" required
						 class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
				</div>
				<div>
				  <label for="client-website" class="block text-sm font-medium text-gray-700 mb-1">Client Website (Optional)</label>
				  <input type="url" id="client-website" v-model="form.website"
						 class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="[https://example.com](https://example.com)">
				</div>
				 <div>
				  <label for="client-industry" class="block text-sm font-medium text-gray-700 mb-1">Industry (Optional)</label>
				  <input type="text" id="client-industry" v-model="form.industry"
						 class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
				</div>
				<div>
				  <label for="client-contact-person" class="block text-sm font-medium text-gray-700 mb-1">Contact Person (Optional)</label>
				  <input type="text" id="client-contact-person" v-model="form.contact_person"
						 class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
				</div>
				 <div>
				  <label for="client-notes" class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
				  <textarea id="client-notes" v-model="form.notes" rows="3"
						 class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"></textarea>
				</div>
				 <div class="pt-1">
					<label for="client-is_active" class="flex items-center cursor-pointer">
						<input type="checkbox" id="client-is_active" v-model="form.is_active"
							   class="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded">
						<span class="ml-2 text-sm text-gray-700">Active Client</span>
					</label>
				</div>

				<div class="mt-8 flex justify-end space-x-3 border-t pt-5">
				  <button type="button" @click="closeModal"
						  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-colors">
					Cancel
				  </button>
				  <button type="submit" :disabled="isSaving"
						  class="inline-flex items-center justify-center rounded-md border border-transparent bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary disabled:opacity-75 transition-colors">
					<LoadingSpinner v-if="isSaving" size="sm" class="mr-2 -ml-1"/>
					{{ isSaving ? 'Saving...' : (clientToEdit ? 'Update Client' : 'Add Client') }}
				  </button>
				</div>
			  </form>
			</DialogPanel>
		  </TransitionChild>
		</div>
	  </div>
	</Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import type { Client, ClientFormData } from '~/interfaces/client';
import { useApi } from '~/composables/useApi';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';

const props = defineProps<{
  clientToEdit?: Client | null;
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'client-saved']);
const { fetchApi } = useApi();

const initialFormState: ClientFormData = {
  name: '',
  website: '',
  industry: '',
  contact_person: '',
  notes: '',
  is_active: true,
};
const form = ref<ClientFormData>({ ...initialFormState });

const isSaving = ref(false);
const errorMessage = ref<string | null>(null);
const validationErrors = ref<Record<string, string[]> | null>(null);

const modalTitle = computed(() => props.clientToEdit ? 'Edit Client Details' : 'Add New Client');

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
	errorMessage.value = null;
	validationErrors.value = null;
	if (props.clientToEdit) {
	  form.value = {
		name: props.clientToEdit.name,
		website: props.clientToEdit.website || '',
		industry: props.clientToEdit.industry || '',
		contact_person: props.clientToEdit.contact_person || '',
		notes: props.clientToEdit.notes || '',
		is_active: props.clientToEdit.is_active !== undefined ? props.clientToEdit.is_active : true,
	  };
	} else {
	  form.value = { ...initialFormState };
	}
  }
});

function closeModal() {
  emit('close');
}

async function saveClient() {
  isSaving.value = true;
  errorMessage.value = null;
  validationErrors.value = null;
  try {
	if (props.clientToEdit && props.clientToEdit.id) {
	  await fetchApi(`/clients/${props.clientToEdit.id}`, {
		method: 'PUT',
		body: form.value,
	  });
	} else {
	  await fetchApi('/clients', {
		method: 'POST',
		body: form.value,
	  });
	}
	emit('client-saved');
	closeModal();
  } catch (error: any) {
	if (error.data && error.data.errors) { // Laravel validation errors
		validationErrors.value = error.data.errors;
		errorMessage.value = error.data.message || "Please check the form for errors.";
	} else {
		errorMessage.value = error.data?.message || 'Failed to save client.';
	}
	console.error("Failed to save client:", error);
  } finally {
	isSaving.value = false;
  }
}
</script>
