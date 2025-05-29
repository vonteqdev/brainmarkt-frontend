<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
	  <div>
		<img class="mx-auto h-10 w-auto" src="/logo-placeholder.svg" alt="BrainMarkt">
		<slot name="title">
		  <h2 class="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
			Welcome to BrainMarkt
		  </h2>
		</slot>
	  </div>
	  <slot /> </div>
  </div>
</template>

<script setup lang="ts">
// No specific script needed for this simple layout
</script>
