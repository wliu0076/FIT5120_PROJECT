<template>
  <div class="filters">
    <h3>{{ t('events.filters.title') }}</h3>
    <div class="filter-group">
      <label>{{ t('events.filters.eventType') }}</label>
      <select v-model="selectedType">
        <option value="">{{ t('events.filters.allEvents') }}</option>
        <option value="concert">{{ t('events.types.concert') }}</option>
        <option value="sports">{{ t('events.types.sports') }}</option>
        <option value="exhibition">{{ t('events.types.exhibition') }}</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label>{{ t('events.filters.venue') }}</label>
      <select v-model="selectedVenue">
        <option value="">{{ t('events.filters.allVenues') }}</option>
        <option value="stadium">{{ t('events.venues.stadium') }}</option>
        <option value="theater">{{ t('events.venues.theater') }}</option>
        <option value="gallery">{{ t('events.venues.gallery') }}</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label>{{ t('events.filters.price') }}</label>
      <select v-model="selectedPrice">
        <option value="">{{ t('events.filters.allPrices') }}</option>
        <option value="free">{{ t('events.prices.free') }}</option>
        <option value="paid">{{ t('events.prices.paid') }}</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label>{{ t('events.filters.audience') }}</label>
      <select v-model="selectedAudience">
        <option value="">{{ t('events.filters.allAudience') }}</option>
        <option value="family">{{ t('events.audience.family') }}</option>
        <option value="adult">{{ t('events.audience.adult') }}</option>
        <option value="children">{{ t('events.audience.children') }}</option>
      </select>
    </div>
    
    <div class="filter-actions">
      <button @click="applyFilters" class="apply-btn">
        {{ t('events.filters.apply') }}
      </button>
      <button @click="clearFilters" class="clear-btn">
        {{ t('events.filters.clear') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const selectedType = ref('')
const selectedVenue = ref('')
const selectedPrice = ref('')
const selectedAudience = ref('')

const emit = defineEmits(['filter'])

const applyFilters = () => {
  emit('filter', {
    type: selectedType.value,
    venue: selectedVenue.value,
    price: selectedPrice.value,
    audience: selectedAudience.value
  })
}

const clearFilters = () => {
  selectedType.value = ''
  selectedVenue.value = ''
  selectedPrice.value = ''
  selectedAudience.value = ''
  applyFilters()
}
</script>

<style scoped>
.filters {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.filter-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.apply-btn {
  background-color: #4CAF50;
  color: white;
}

.apply-btn:hover {
  background-color: #45a049;
}

.clear-btn {
  background-color: #f44336;
  color: white;
}

.clear-btn:hover {
  background-color: #da190b;
}
</style> 