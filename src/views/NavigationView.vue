<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="bg-white shadow-lg rounded-xl p-6 mb-8">
      <h2 class="text-3xl font-extrabold text-gray-800 mb-4">Explore Cultural Landmarks</h2>

      <!-- Chips -->
      <div class="flex flex-wrap gap-3 mb-4">
        <button
          v-for="culture in cultures"
          :key="culture.value"
          @click="selectCulture(culture.value)"
          :class="[ selectedCulture === culture.value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
            'px-4 py-2 rounded-full font-semibold border transition']">
          {{ culture.label }}
        </button>
      </div>

      <!-- Search -->
      <input
        v-model="landmarkSearch"
        type="text"
        placeholder="Search landmark..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <!-- View Toggle -->
    <div class="bg-white shadow-md rounded-xl p-4 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-700">View</h3>
        <div class="flex space-x-2">
          <button
            @click="toggleView('map')"
            :class="[viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800', 'px-4 py-1 rounded-lg']">
            Map
          </button>
          <button
            @click="toggleView('list')"
            :class="[viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800', 'px-4 py-1 rounded-lg']">
            List
          </button>
        </div>
      </div>
      <div v-show="viewMode === 'map'" class="rounded-lg shadow h-96 overflow-hidden">
        <div id="map" class="w-full h-full rounded-lg" />
      </div>
    </div>

    <!-- Landmark Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10" v-show="viewMode === 'list'">
      <div
        v-for="landmark in filteredLandmarks"
        :key="landmark.id"
        :ref="el => landmarkRefs[landmark.id] = el"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
        @click="handleLandmarkClick(landmark)">
        <img :src="landmark.image" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-bold text-gray-800">{{ landmark.name }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ landmark.location }}</p>
        </div>
      </div>
    </div>

    <!-- Directions Section -->
    <div v-if="routeSteps.length" class="bg-white shadow-md rounded-xl p-6 mb-10">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">Directions to {{ activeLandmark?.name }}</h3>
        <button
          @click="savePDF"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <i class="mdi mdi-download"></i>
          <span>Save PDF</span>
        </button>
      </div>

      <div class="flex space-x-3 mb-4">
        <button
          v-for="mode in ['TRANSIT', 'WALKING', 'DRIVING']"
          :key="mode"
          @click="changeTransportMode(mode)"
          :class="[ transportMode === mode
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
            'px-4 py-2 rounded-full border text-sm font-medium transition']">
          {{ transportModeLabels[mode] }}
        </button>
      </div>

      <div class="text-sm text-gray-600 mb-6">
        <p><strong>Distance:</strong> {{ routeSummary.distance }}</p>
        <p><strong>Time:</strong> {{ routeSummary.duration }}</p>
        <p><strong>Arrival:</strong> {{ routeSummary.arrival }}</p>
      </div>

      <div class="space-y-4">
        <div
          v-for="(step, index) in routeSteps"
          :key="index"
          class="flex items-start space-x-4">
          <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {{ index + 1 }}
          </div>
          <div>
            <p v-html="step.instructions" class="font-medium text-gray-800"></p>
            <p class="text-sm text-gray-500">{{ step.distance }} • {{ step.duration }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 合并后的脚本已包含在上个回复中，请插入完整的合并 script 内容
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
