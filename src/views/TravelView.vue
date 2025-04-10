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
          :class="[
            selectedCulture === culture.value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
            'px-4 py-2 rounded-full font-semibold border transition'
          ]">
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
        <img :src="landmark.image" @error="e => e.target.src = defaultImage" class="w-full h-48 object-cover" />
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
          v-for="mode in transportModes"
          :key="mode"
          @click="changeTransportMode(mode)"
          :class="[
            transportMode === mode
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
            'px-4 py-2 rounded-full border text-sm font-medium transition'
          ]">
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

    <!-- Animated Popup -->
    <transition name="fade-slide">
      <div
        v-if="popupLandmark"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl border border-blue-300 p-4 w-full max-w-md z-50">
        <img :src="popupLandmark.image" @error="e => e.target.src = defaultImage" class="w-full h-40 object-cover rounded-lg mb-3" />
        <h4 class="font-bold text-lg text-gray-800 mb-1">{{ popupLandmark.name }}</h4>
        <p class="text-sm text-gray-600 mb-2">{{ popupLandmark.description }}</p>
        <audio controls :src="popupAudio" class="w-full" />
        <button @click="popupLandmark = null" class="text-blue-600 hover:underline text-sm mt-2 block text-right">Close</button>
      </div>
    </transition>

    <!-- Nearby Events -->
    <div v-if="nearbyEvents.length" class="bg-white shadow-md rounded-xl p-6 mb-10">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Nearby Events</h3>
      <div v-else class="grid grid-cols-1 gap-6">
        <div v-for="event in nearbyEvents" 
             :key="event.id" 
             class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <img :src="event.image" @error="e => e.target.src = defaultImage" :alt="event.name" class="w-full h-48 object-cover">
          <div class="p-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ event.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ event.distance }}km away</p>
              </div>
              <span :class="['px-2 py-1 text-xs font-medium rounded-full', getCategoryColor(event.category)]">
                {{ event.category }}
              </span>
            </div>
            <p class="text-gray-600 text-sm mt-2">{{ event.address }}</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-sm text-gray-500">
                <i class="mdi mdi-calendar mr-1"></i>
                {{ formatDate(event.datetime) }}
              </span>
              <button 
                @click="showDirections(event)"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                {{ $t('travel.getDirections') }}
                <i class="mdi mdi-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

// ===== Constants =====
const cultures = [
  { label: '中国文化', value: 'chinese' },
  { label: '印度文化', value: 'indian' }
]

const TRANSPORT_MODES = ['TRANSIT', 'WALKING', 'DRIVING']
const TRANSPORT_MODE_LABELS = {
  TRANSIT: 'Public Transport',
  DRIVING: 'Driving',
  WALKING: 'Walking'
}

const defaultImage = '/imageerror.png'

const landmarks = {
  chinese: [
    { 
      id: 'chinatown', 
      name: '墨尔本唐人街', 
      location: 'Little Bourke St, Melbourne VIC 3000', 
      lat: -37.8115, 
      lng: 144.9711, 
      image: '/landmarks/chinatown.jpg', 
      description: '墨尔本唐人街是澳大利亚最古老的华人聚居区之一，以其丰富的中国美食和文化特色闻名。' 
    },
    { 
      id: 'chinese-museum', 
      name: '墨尔本中国博物馆', 
      location: '22 Cohen Place, Melbourne VIC 3000', 
      lat: -37.8072, 
      lng: 144.9706, 
      image: '/landmarks/chinese-museum.jpg', 
      description: '博物馆展示了澳大利亚华人的历史和文化遗产。' 
    },
    {
      id: 'box-hill',
      name: 'Box Hill 中心',
      location: 'Box Hill Central, Melbourne VIC 3128',
      lat: -37.8190,
      lng: 145.1220,
      image: '/landmarks/box-hill.jpg',
      description: '墨尔本最大的亚洲美食和购物中心之一。'
    }
  ],
  indian: [
    { 
      id: 'temple', 
      name: '希瓦毗湿奴神庙', 
      location: '52 Boundary Rd, Carrum Downs VIC 3201', 
      lat: -38.0893, 
      lng: 145.1584, 
      image: '/landmarks/shiva-temple.jpg', 
      description: '维多利亚州最大的印度教寺庙。' 
    },
    { 
      id: 'indian-museum', 
      name: '印度文化中心', 
      location: 'Federation Square, Melbourne VIC 3000', 
      lat: -37.8183, 
      lng: 144.9671, 
      image: '/landmarks/indian-museum.jpg', 
      description: '展示印度文化艺术和历史的文化中心。' 
    },
    {
      id: 'dandenong',
      name: 'Little India Dandenong',
      location: 'Foster Street, Dandenong VIC 3175',
      lat: -37.9814,
      lng: 145.2119,
      image: '/landmarks/little-india.jpg',
      description: '墨尔本最著名的印度文化区，汇集了众多印度餐厅和商店。'
    }
  ]
}

const DEFAULT_USER_LOCATION = { lat: -37.818267, lng: 144.952974 }
const EARTH_RADIUS = 6371e3 // in meters

// ===== Reactive State =====
const selectedCulture = ref('chinese')
const landmarkSearch = ref('')
const viewMode = ref('map')
const activeLandmark = ref(null)
const popupLandmark = ref(null)
const popupAudio = '/src/info.mp3'
const showPopup = ref(false)

const userLocation = ref({ ...DEFAULT_USER_LOCATION })
const landmarkRefs = {}

const transportMode = ref('TRANSIT')
const routeSteps = ref([])
const routeSummary = ref({ duration: '', distance: '', arrival: '' })

// Map related refs
const map = ref(null)
const mapMarkers = ref([])
const directionsService = ref(null)
const directionsRenderer = ref(null)

// ===== Computed Properties =====
const filteredLandmarks = computed(() => {
  const list = landmarks[selectedCulture.value] || []
  if (!landmarkSearch.value) return list
  return list.filter(l => l.name.toLowerCase().includes(landmarkSearch.value.toLowerCase()))
})

// ===== Methods =====
// Culture and view methods
function selectCulture(culture) {
  selectedCulture.value = culture
  landmarkSearch.value = ''
  updateMarkers()
}

function toggleView(mode) {
  viewMode.value = mode
}

// Landmark interaction methods
function handleLandmarkClick(landmark) {
  clearDirections()
  activeLandmark.value = landmark
  updateRouteToLandmark(landmark)
  scrollToLandmark(landmark.id)
}

function scrollToLandmark(id) {
  nextTick(() => {
    const el = landmarkRefs[id]
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-blue-500')
      setTimeout(() => el.classList.remove('ring-2', 'ring-blue-500'), 1500)
    }
  })
}

// Transport and routing methods
function changeTransportMode(mode) {
  transportMode.value = mode
  if (activeLandmark.value) updateRouteToLandmark(activeLandmark.value)
}

function updateRouteToLandmark(landmark) {
  directionsRenderer.value.set('directions', null)
  directionsService.value.route({
    origin: userLocation.value,
    destination: { lat: landmark.lat, lng: landmark.lng },
    travelMode: google.maps.TravelMode[transportMode.value]
  }, (res, status) => {
    if (status === 'OK') {
      directionsRenderer.value.setDirections(res)
      const leg = res.routes[0].legs[0]
      routeSteps.value = leg.steps.map(step => ({
        instructions: step.instructions,
        distance: step.distance.text,
        duration: step.duration.text
      }))
      routeSummary.value = {
        duration: leg.duration.text,
        distance: leg.distance.text,
        arrival: calculateArrivalTime(leg.duration.value)
      }
    }
  })
}

function calculateArrivalTime(durationInSeconds) {
  const now = new Date()
  const arrival = new Date(now.getTime() + durationInSeconds * 1000)
  return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Map methods
function updateMarkers() {
  mapMarkers.value.forEach(m => m.setMap(null))
  mapMarkers.value = []
  const bounds = new google.maps.LatLngBounds()

  filteredLandmarks.value.forEach(landmark => {
    const marker = new google.maps.Marker({
      position: { lat: landmark.lat, lng: landmark.lng },
      map: map.value,
      title: landmark.name
    })
    marker.addListener('click', () => handleLandmarkClick(landmark))
    mapMarkers.value.push(marker)
    bounds.extend(marker.getPosition())
  })

  if (filteredLandmarks.value.length) map.value.fitBounds(bounds)
}

function clearDirections() {
  if (directionsRenderer.value) {
    directionsRenderer.value.set('directions', null)
    routeSteps.value = []
  }
}

function initMap() {
  const mapOptions = {
    center: userLocation.value,
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  }
  
  map.value = new google.maps.Map(document.getElementById('map'), mapOptions)
  directionsService.value = new google.maps.DirectionsService()
  directionsRenderer.value = new google.maps.DirectionsRenderer({ 
    map: map.value, 
    suppressMarkers: false 
  })

  const { AdvancedMarkerElement } = google.maps.marker
  updateMarkersWithAdvanced(AdvancedMarkerElement)
}

function updateMarkersWithAdvanced(AdvancedMarkerElement) {
  mapMarkers.value.forEach(m => m.map = null)
  mapMarkers.value = []
  const bounds = new google.maps.LatLngBounds()

  filteredLandmarks.value.forEach(landmark => {
    const marker = new AdvancedMarkerElement({
      map: map.value,
      position: { lat: landmark.lat, lng: landmark.lng },
      title: landmark.name
    })
    
    marker.addListener('click', () => handleLandmarkClick(landmark))
    mapMarkers.value.push(marker)
    bounds.extend(marker.position)
  })

  if (filteredLandmarks.value.length) {
    map.value.fitBounds(bounds)
  }
}

// Location and proximity methods
function getDistance(loc1, loc2) {
  const φ1 = loc1.lat * Math.PI / 180
  const φ2 = loc2.lat * Math.PI / 180
  const Δφ = (loc2.lat - loc1.lat) * Math.PI / 180
  const Δλ = (loc2.lng - loc1.lng) * Math.PI / 180
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2
  return EARTH_RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function trackUserProximity() {
  setInterval(() => {
    filteredLandmarks.value.forEach(landmark => {
      const dist = getDistance(userLocation.value, landmark)
      if (dist < 100) {
        popupLandmark.value = landmark
        showPopup.value = true
      }
    })
  }, 4000)
}

function startLocationWatch() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      userLocation.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }
    })
  }
}

// PDF generation
async function savePDF() {
  try {
    const contentDiv = document.createElement('div');
    contentDiv.style.width = '600px';
    contentDiv.style.padding = '20px';
    contentDiv.style.background = 'white';
    contentDiv.style.fontFamily = 'Arial, sans-serif';

    contentDiv.innerHTML = generatePDFContent();
    document.body.appendChild(contentDiv);

    const canvas = await html2canvas(contentDiv, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    document.body.removeChild(contentDiv);

    pdf.save(`${activeLandmark.value.name}-TravelGuide.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to save PDF. Please try again.');
  }
}

function generatePDFContent() {
  return `
    <h1 style="font-size: 24px; margin-bottom: 10px;">${activeLandmark.value.name}</h1>
    <p style="margin-bottom: 8px;"><strong>Location:</strong> ${activeLandmark.value.location}</p>
    <p style="margin-bottom: 10px;"><strong>Description:</strong> ${activeLandmark.value.description}</p>
    <img src="${activeLandmark.value.image}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;" />
    <p><strong>Total Distance:</strong> ${routeSummary.value.distance}</p>
    <p><strong>Estimated Time:</strong> ${routeSummary.value.duration}</p>
    <p><strong>Expected Arrival:</strong> ${routeSummary.value.arrival}</p>
    <h2 style="font-size: 18px; margin-top: 20px; margin-bottom: 10px;">Step-by-Step Directions:</h2>
    ${generatePDFSteps()}
  `;
}

function generatePDFSteps() {
  return routeSteps.value.map((step, index) => `
    <div style="margin-bottom: 12px;">
      <div style="display: flex; align-items: flex-start;">
        <div style="width: 24px; height: 24px; background: #2563EB; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px;">
          ${index + 1}
        </div>
        <div>
          <p style="margin: 0 0 2px;">${step.instructions}</p>
          <p style="margin: 0; font-size: 13px; color: #555;">${step.distance} • ${step.duration}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== Lifecycle Hooks =====
onMounted(() => {
  startLocationWatch()
  trackUserProximity()
  
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap&loading=async`
  script.async = true
  script.defer = true
  window.initMap = initMap
  document.head.appendChild(script)
})

onUnmounted(() => {
  cleanupGoogleMapsScript()
})

// ===== Helper Functions =====
function loadGoogleMapsScript() {
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`
  script.async = true
  script.defer = true
  window.initMap = initMap
  document.head.appendChild(script)
}

function cleanupGoogleMapsScript() {
  delete window.initMap
  const script = document.querySelector('script[src*="maps.googleapis.com"]')
  if (script) script.remove()
}
</script> 