<template>
  <div class="events-view">
    <h1 class="text-3xl font-bold mb-8">{{ $t('events.title') }}</h1>
    <p class="text-gray-600 mb-8">{{ $t('events.subtitle') }}</p>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1">
        <EventFilters @filter="handleFilter" />
      </div>
      
      <div class="lg:col-span-2">
        <Calendar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Calendar from '@/components/Calendar.vue'
import EventFilters from '@/components/EventFilters.vue'

const handleFilter = (filters: any) => {
  console.log('Applied filters:', filters)
  // TODO: Set up the filtering part
}
</script>

<style scoped>
.events-view {
  min-height: calc(100vh - 4rem);
}
</style> 