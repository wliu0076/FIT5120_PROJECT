<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10 px-4 sm:px-6 lg:px-8" style="background-image: url('/new-background.png'); background-size: cover;">
    <!-- Location Permission Alert - 只在权限被拒绝且尚未手动禁用时显示 -->
    <div v-if="showLocationAlert && locationPermissionStatus !== 'granted'" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg shadow-md">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <i class="mdi mdi-alert-circle text-2xl text-yellow-500 mr-3"></i>
        </div>
        <div>
          <p class="font-medium">Location access is disabled</p>
          <p class="text-sm">We need your location to provide accurate navigation. Please enable location access in your browser settings.</p>
        </div>
        <button @click="dismissLocationAlert" class="ml-auto text-yellow-500 hover:text-yellow-700">
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>
    </div>
    
    <div class="bg-gray-100 shadow-xl rounded-2xl p-8 mb-10" style="background-image: url('/landmarkbc.png'); background-size: cover;">
      <h2 class="text-4xl font-extrabold text-gray-900 mb-6">Cultural Landmarks</h2>
      <p class="text-lg text-gray-700 mb-8">Explore the rich cultural landmarks around you.</p>

      <div class="flex flex-wrap gap-4 mb-6">
        <button v-for="culture in cultures" :key="culture.value" @click="selectCulture(culture.value)"
          :class="[selectedCulture === culture.value ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300', 'px-5 py-3 rounded-full font-semibold border transition-all duration-300 transform hover:scale-105 shadow-md']">
          {{ culture.label }}
        </button>
      </div>

      <div class="relative mb-8" style="background-image: url('/landmarkbc.png'); background-size: cover;">
        <input 
          v-model="landmarkSearch" 
          type="text" 
          placeholder="Search for landmarks..."
          class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="handleSearchInput"
        />
        <div v-if="placeSuggestions.length > 0" 
          class="absolute z-50 bg-white border border-gray-300 rounded-lg mt-2 w-full max-h-60 overflow-auto shadow-lg">
          <div v-for="prediction in placeSuggestions" 
            :key="prediction.place_id" 
            @click="selectPlacePrediction(prediction)"
            class="px-4 py-3 cursor-pointer hover:bg-gray-100 text-gray-900">
            {{ prediction.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Location Permission Status Banner (when denied) -->
    <div v-if="locationPermissionDenied" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center shadow-sm">
      <i class="mdi mdi-map-marker-off text-2xl text-red-500 mr-3"></i>
      <div>
        <p class="font-medium text-red-800">Location access denied</p>
        <p class="text-sm text-red-700">Without location access, we'll use a default position in Melbourne CBD for your starting point.</p>
      </div>
      <div class="ml-auto flex space-x-2">
        <button @click="requestLocationPermission" class="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors">
          Try Again
        </button>
        <button v-if="manuallyDisabled" @click="enableLocation" class="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors">
          Enable Location
        </button>
      </div>
    </div>

    <!-- Location Permission Controls -->
    <div v-if="locationPermissionStatus === 'granted'" class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center shadow-sm">
      <i class="mdi mdi-map-marker text-2xl text-blue-500 mr-3"></i>
      <div>
        <p class="font-medium text-blue-800">Location access is enabled</p>
        <p class="text-sm text-blue-700">We're using your current location to provide accurate navigation.</p>
      </div>
      <button @click="disableLocation" class="ml-auto bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors">
        Disable Location
      </button>
    </div>

    <div class="bg-gray-100 shadow-lg rounded-2xl p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-800">View Mode</h3>
        <div class="flex space-x-3">
          <button @click="toggleView('list')" :class="[viewMode === 'list' ? 'bg-blue-700 text-white' : 'bg-gray-300 text-gray-900', 'px-5 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md']">List</button>
          <button @click="toggleView('map')" :class="[viewMode === 'map' ? 'bg-blue-700 text-white' : 'bg-gray-300 text-gray-900', 'px-5 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md']">Map</button>
        </div>
      </div>
      <div v-show="viewMode === 'map'" class="rounded-lg shadow h-96 overflow-hidden mb-8">
        <div id="map" class="w-full h-full rounded-lg" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" v-show="viewMode === 'list'">
        <div v-for="landmark in paginatedLandmarks" :key="landmark.id" :ref="el => landmarkRefs[landmark.id] = el"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer w-full h-96"
          @click="handleLandmarkClick(landmark)">
          <img :src="landmark.image" @error="e => e.target.src = defaultImage"
            class="w-full h-52 object-cover" />
          <div class="p-5 pb-16 relative h-44">
            <h2 class="text-xl font-bold text-gray-900 mb-2 truncate">{{ landmark.name }}</h2>
            <p class="text-sm text-gray-600 line-clamp-2">{{ landmark.location }}</p>
            <div class="absolute bottom-4 right-4">
              <button 
                @click.stop="navigateToLandmark(landmark)"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 w-36 justify-center transform hover:scale-105 shadow-lg"
              >
                <i class="mdi mdi-navigation mr-2"></i>
                Navigate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center items-center space-x-3 mb-12">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="px-5 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="px-5 py-3 text-gray-800">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="px-5 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <div v-if="routeSteps.length" class="bg-white shadow-lg rounded-2xl p-8 mb-12" ref="directionsSection">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-gray-900">Directions to {{ activeLandmark?.name }}</h3>
        <div class="flex justify-end gap-4">
          <button @click="playAudioGuide"
            class="bg-indigo-700 text-white px-5 py-3 rounded-lg hover:bg-indigo-800 transition-all duration-300 flex items-center space-x-2">
            <i class="mdi mdi-volume-high"></i><span>Audio Guide</span>
          </button>
          <button @click="savePDF"
            class="bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800 transition-all duration-300 flex items-center space-x-2">
            <i class="mdi mdi-download"></i><span>Save PDF</span>
          </button>
        </div>
        <audio ref="audioRef" :src="popupAudio" class="hidden" />
      </div>

      <div class="flex space-x-4 mb-6">
        <button v-for="mode in ['TRANSIT', 'WALKING', 'DRIVING']" :key="mode"
          @click="changeTransportMode(mode)"
          :class="[transportMode === mode ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300', 'px-5 py-3 rounded-full border text-sm font-medium transition-all duration-300']">
          {{ transportModeLabels[mode] }}
        </button>
      </div>

      <div class="text-sm text-gray-700 mb-8">
        <p><strong>Distance:</strong> {{ routeSummary.distance }}</p>
        <p><strong>Time:</strong> {{ routeSummary.duration }}</p>
        <p><strong>Arrival:</strong> {{ routeSummary.arrival }}</p>
      </div>

      <div class="space-y-5">
        <div v-for="(step, index) in routeSteps" :key="index" class="flex items-start space-x-5">
          <div class="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-semibold">
            {{ index + 1 }}
          </div>
          <div>
            <p v-html="step.instructions" class="font-medium text-gray-900"></p>
            <p class="text-sm text-gray-600">{{ step.distance }} • {{ step.duration }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const map = ref(null)
const placesService = ref(null)
const directionsService = ref(null)
const directionsRenderer = ref(null)
const autocompleteService = ref(null)
const mapMarkers = ref([])

// Location permission state
const locationPermissionDenied = ref(false)
const showLocationAlert = ref(false)
const locationPermissionStatus = ref('prompt') // 'prompt', 'granted', 'denied'
const manuallyDisabled = ref(false)

const selectedCulture = ref('chinese')
const landmarkSearch = ref('')
const viewMode = ref('list')
const landmarks = ref([])
const placeSuggestions = ref([])
const routeSteps = ref([])
const activeLandmark = ref(null)
const userLocation = ref({ lat: -37.818267, lng: 144.952974 }) // Default to Melbourne CBD
const transportMode = ref('TRANSIT')
const routeSummary = ref({ duration: '', distance: '', arrival: '' })
const popupAudio = '/src/info.mp3'

const landmarkRefs = {}
const directionsSection = ref(null)
const defaultImage = '/imageerror.png'
const audioRef = ref(null)

const router = useRouter()

// Function to dismiss location alert
function dismissLocationAlert() {
  showLocationAlert.value = false
  localStorage.setItem('locationAlertDismissed', 'true')
}

// Function to check location permission status
async function checkLocationPermission() {
  try {
    if (!navigator.permissions) {
      return 'prompt'
    }
    
    const permission = await navigator.permissions.query({ name: 'geolocation' })
    return permission.state // 'granted', 'denied', or 'prompt'
  } catch (error) {
    console.error('Error checking location permission:', error)
    return 'prompt'
  }
}

// Function to request location permission
function requestLocationPermission() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        userLocation.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
        locationPermissionDenied.value = false
        locationPermissionStatus.value = 'granted'
        
        // 成功获取到位置后，隐藏位置访问禁用通知
        showLocationAlert.value = false
        
        // Update map center if map exists
        if (map.value) {
          map.value.setCenter(userLocation.value)
          
          // Refetch landmarks with new location
          fetchLandmarks()
        }
      },
      error => {
        console.warn('获取用户位置失败:', error)
        locationPermissionDenied.value = true
        locationPermissionStatus.value = 'denied'
        showLocationAlert.value = true
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  } else {
    console.warn('Geolocation is not supported by this browser')
    locationPermissionDenied.value = true
  }
}

const transportModeLabels = {
  TRANSIT: t('landmarks.directions.transit'),
  DRIVING: t('landmarks.directions.driving'),
  WALKING: t('landmarks.directions.walking')
}

const cultures = [
  { label: t('landmarks.filters.chinese'), value: 'chinese' },
  { label: t('landmarks.filters.indian'), value: 'indian' }
]

// Culture category queries
const fetchLandmarks = async () => {
  const queries = selectedCulture.value === 'chinese'
    ? ['chinese museum', 'place_of_worship', 'chinese restaurant', 'tourist_attraction', 'store']
    : ['hindu_temple', 'india restaurant', 'tourist_attraction Melbourne', 'store']

  try {
    const promises = queries.map(q => searchPlaces(q))
    const results = await Promise.all(promises)
    const flat = results.flat()
    const unique = []
    const seen = new Set()

    flat.forEach(p => {
      if (!seen.has(p.id)) {
        seen.add(p.id)
        unique.push(p)
      }
    })

    landmarks.value = unique
    console.log('获取到的地标:', landmarks.value)
    updateMarkers()
  } catch (error) {
    console.error("Error fetching landmarks:", error)
    // 如果API调用失败，使用本地数据作为备份
    landmarks.value = getFallbackLandmarks()
    updateMarkers()
  }
}

function searchPlaces(query) {
  return new Promise((resolve) => {
    if (!placesService.value || !google?.maps?.places) {
      console.error("Places service not available")
      resolve([])
      return
    }

    const victoriaBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-39.2, 140.8), // Southwest corner (near Portland)
      new google.maps.LatLng(-33.9, 149.0)  // Northeast corner (near Wodonga)
    )

    const request = {
      query,
      bounds: victoriaBounds,
      location: userLocation.value,
      radius: 20000  // You can increase this if you're not seeing enough results
    }

    placesService.value.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const formatted = results.map(place => ({
          id: place.place_id,
          name: place.name,
          location: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          image: place.photos?.[0]?.getUrl({ maxWidth: 400 }) || defaultImage,
          description: place.types?.join(', ') || 'No description available'
        }))

        // Keep only results that are in Victoria, Australia
        const victoriaOnly = formatted.filter(p =>
          /vic|victoria/i.test(p.location)
        )

        resolve(victoriaOnly)
      } else {
        resolve([])
      }
    })
  })
}

// Autocomplete
watch(landmarkSearch, async (val) => {
  if (!val || !autocompleteService.value || !google?.maps?.places) {
    placeSuggestions.value = []
    return
  }

  autocompleteService.value.getPlacePredictions({
    input: val,
    location: new google.maps.LatLng(userLocation.value.lat, userLocation.value.lng),
    radius: 10000
  }, (predictions, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
      placeSuggestions.value = predictions
    } else {
      placeSuggestions.value = []
    }
  })
})

function selectPlacePrediction(prediction) {
  if (!placesService.value || !google?.maps?.places) {
    console.error("Places service not available")
    return
  }

  const request = {
    placeId: prediction.place_id,
    fields: ['name', 'geometry', 'formatted_address', 'photos', 'types']
  }

  placesService.value.getDetails(request, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && place) {
      const landmark = {
        id: place.place_id,
        name: place.name,
        location: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        image: place.photos?.[0]?.getUrl({ maxWidth: 400 }) || defaultImage,
        description: place.types?.join(', ') || 'No description available'
      }

      placeSuggestions.value = []
      landmarkSearch.value = place.name
      handleLandmarkClick(landmark, true)
    }
  })
}

const filteredLandmarks = computed(() => {
  if (!landmarkSearch.value) return landmarks.value
  return landmarks.value.filter(l => 
    l.name.toLowerCase().includes(landmarkSearch.value.toLowerCase())
  )
})

function toggleView(mode) {
  viewMode.value = mode
  if (mode === 'map' && map.value) {
    // Trigger map resize if needed
    google.maps.event.trigger(map.value, 'resize')
  }
}

function selectCulture(culture) {
  selectedCulture.value = culture
  landmarkSearch.value = ''
  
  clearMapMarkers()
  
  activeLandmark.value = null
  routeSteps.value = []
  
  fetchLandmarks()
  
  if (viewMode.value === 'list') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function navigateToLandmark(landmark) {
  event.stopPropagation();
  console.log('导航到地标，传递的数据:', landmark);

  if (!landmark || !landmark.id || !landmark.name || !landmark.location) {
    console.error('地标数据不完整:', landmark);
    return;
  }
  
  router.push({
    name: 'landmark-navigation',
    query: {
      landmark: encodeURIComponent(JSON.stringify({
        id: landmark.id,
        name: landmark.name,
        location: landmark.location,
        description: landmark.description,
        image: landmark.image,
        lat: landmark.lat,
        lng: landmark.lng
      }))
    }
  });
}

function handleLandmarkClick(landmark, scroll = false) {
  clearDirections()
  activeLandmark.value = landmark
  updateRouteToLandmark(landmark)
  
  if (scroll && directionsSection.value) {
    nextTick(() => {
      directionsSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  } else {
    scrollToLandmark(landmark.id)
  }
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

function changeTransportMode(mode) {
  transportMode.value = mode
  if (activeLandmark.value) updateRouteToLandmark(activeLandmark.value)
}

function updateRouteToLandmark(landmark) {
  if (!directionsService.value || !directionsRenderer.value || !google?.maps?.DirectionsService) {
    console.error("Directions service not available")
    return
  }

  directionsRenderer.value.set('directions', null)
  directionsService.value.route({
    origin: userLocation.value,
    destination: { lat: landmark.lat, lng: landmark.lng },
    travelMode: google.maps.TravelMode[transportMode.value]
  }, (res, status) => {
    if (status === 'OK' && res) {
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
    } else {
      console.error("Directions request failed:", status)
      routeSteps.value = []
      routeSummary.value = { duration: '', distance: '', arrival: '' }
    }
  })
}

function calculateArrivalTime(seconds) {
  const arrival = new Date(Date.now() + seconds * 1000)
  return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function updateMarkers() {
  if (!map.value || !google?.maps?.Marker) {
    console.error("Map not initialized")
    return
  }

  clearMapMarkers()
  const bounds = new google.maps.LatLngBounds()

  filteredLandmarks.value.forEach(landmark => {
    const marker = new google.maps.Marker({
      position: { lat: landmark.lat, lng: landmark.lng },
      map: map.value,
      title: landmark.name
    })
    marker.addListener('click', () => navigateToLandmark(landmark))
    mapMarkers.value.push(marker)
    bounds.extend(marker.getPosition())
  })

  if (filteredLandmarks.value.length) {
    map.value.fitBounds(bounds)
  }
}

function clearMapMarkers() {
  mapMarkers.value.forEach(m => m.setMap(null))
  mapMarkers.value = []
}

function clearDirections() {
  if (directionsRenderer.value) {
    directionsRenderer.value.set('directions', null)
    routeSteps.value = []
    routeSummary.value = { duration: '', distance: '', arrival: '' }
  }
}

function savePDF() {
  if (!activeLandmark.value) return

  const contentDiv = document.createElement('div')
  contentDiv.style.width = '600px'
  contentDiv.style.padding = '20px'
  contentDiv.style.background = 'white'
  contentDiv.style.fontFamily = 'Arial'

  contentDiv.innerHTML = `
    <h1>${activeLandmark.value.name}</h1>
    <p><strong>${t('landmarks.directions.location')}:</strong> ${activeLandmark.value.location}</p>
    <img src="${activeLandmark.value.image}" style="width:100%;border-radius:8px;" />
    <p><strong>${t('landmarks.directions.description')}:</strong> ${activeLandmark.value.description}</p>
    <p><strong>${t('landmarks.directions.distance')}:</strong> ${routeSummary.value.distance}</p>
    <p><strong>${t('landmarks.directions.time')}:</strong> ${routeSummary.value.duration}</p>
    <p><strong>${t('landmarks.directions.arrival')}:</strong> ${routeSummary.value.arrival}</p>
    <h2>${t('landmarks.directions.steps')}:</h2>
    ${routeSteps.value.map((s, i) => `
      <p><strong>${i + 1}.</strong> ${s.instructions} (${s.distance}, ${s.duration})</p>
    `).join('')}
  `
  document.body.appendChild(contentDiv)

  html2canvas(contentDiv).then(canvas => {
    const pdf = new jsPDF()
    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 0)
    pdf.save(`${activeLandmark.value.name}-guide.pdf`)
    document.body.removeChild(contentDiv)
  }).catch(error => {
    console.error('PDF 生成错误:', error)
  })
}

function playAudioGuide() {
  if (audioRef.value) {
    audioRef.value.play()
  }
}

const currentPage = ref(1)
const itemsPerPage = 9

const totalPages = computed(() => {
  return Math.ceil(filteredLandmarks.value.length / itemsPerPage)
})

const paginatedLandmarks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLandmarks.value.slice(start, end)
})

const handleSearchInput = debounce(async (event) => {
  const value = event.target.value
  if (!value || !autocompleteService.value || !google?.maps?.places) {
    placeSuggestions.value = []
    return
  }

  try {
    const request = {
      input: value,
      location: new google.maps.LatLng(userLocation.value.lat, userLocation.value.lng),
      radius: 10000
    }

    autocompleteService.value.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        placeSuggestions.value = predictions.slice(0, 5) 
      } else {
        placeSuggestions.value = []
      }
    })
  } catch (error) {
    console.error('搜索建议获取失败:', error)
    placeSuggestions.value = []
  }
}, 300)

function debounce(fn, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

watch([selectedCulture, landmarkSearch], () => {
  currentPage.value = 1
})

onMounted(async () => {
  // 初始化位置权限状态
  locationPermissionStatus.value = await checkLocationPermission()
  
  // 检查位置权限是否被手动禁用
  const locationDisabled = localStorage.getItem('locationDisabled') === 'true'
  if (locationDisabled) {
    locationPermissionDenied.value = true
    locationPermissionStatus.value = 'denied'
    manuallyDisabled.value = true
    showLocationAlert.value = true
  } else {
    // 检查警告是否被关闭过
    const alertDismissed = localStorage.getItem('locationAlertDismissed') === 'true'
    
    // 只有在权限非granted且警告未被关闭过的情况下显示警告
    if (locationPermissionStatus.value !== 'granted' && !alertDismissed) {
      showLocationAlert.value = true
    }
  }
  
  if (window.google && window.google.maps) {
    initMap()
  } else {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error("Google Maps API Key not found")
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`
    script.async = true
    script.defer = true
    
    window.initMap = function() {
      initMap()
    }
    
    document.head.appendChild(script)
  }

  // 如果位置未被手动禁用且权限尚未被拒绝，则请求位置权限
  if (!locationDisabled && locationPermissionStatus.value !== 'denied') {
    requestLocationPermission()
  } else if (locationPermissionStatus.value === 'denied') {
    locationPermissionDenied.value = true
  }

  function initMap() {
    map.value = new google.maps.Map(document.getElementById('map'), {
      center: userLocation.value,
      zoom: 12,
      mapTypeControl: false
    })

    directionsService.value = new google.maps.DirectionsService()
    directionsRenderer.value = new google.maps.DirectionsRenderer({
      map: map.value
    })
    
    placesService.value = new google.maps.places.PlacesService(map.value)
    autocompleteService.value = new google.maps.places.AutocompleteService()

    fetchLandmarks()
  }
})

function getFallbackLandmarks() {
  return selectedCulture.value === 'chinese' 
    ? [
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
          lat: -37.8116, 
          lng: 144.9689, 
          image: '/landmarks/chinese-museum.jpg', 
          description: '博物馆展示了澳大利亚华人的历史和文化遗产。' 
        }
      ]
    : [
        { 
          id: 'temple', 
          name: '希瓦毗湿奴神庙', 
          location: '52 Boundary Rd, Carrum Downs VIC 3201', 
          lat: -38.0893, 
          lng: 145.1584, 
          image: '/landmarks/temple.jpg', 
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
        }
      ]
}

// Function to manually disable location tracking
function disableLocation() {
  // Reset to default Melbourne location
  userLocation.value = { lat: -37.818267, lng: 144.952974 }
  
  // Update permission status
  locationPermissionStatus.value = 'denied'
  locationPermissionDenied.value = true
  manuallyDisabled.value = true
  
  // Save preference to local storage
  localStorage.setItem('locationDisabled', 'true')
  
  // Revoke geolocation permission if possible
  if (navigator.permissions && navigator.permissions.revoke) {
    try {
      navigator.permissions.revoke({ name: 'geolocation' }).then(() => {
        console.log('Geolocation permission revoked');
      }).catch(e => {
        console.warn('Failed to revoke permission:', e);
      });
    } catch (e) {
      console.warn('Permission revocation not supported:', e);
    }
  }
  
  // Update map if it exists
  if (map.value) {
    map.value.setCenter(userLocation.value)
    // Refresh landmarks with new location
    fetchLandmarks()
  }
  
  // Show notification to user
  showLocationAlert.value = true
}

// Function to re-enable location tracking
function enableLocation() {
  // 移除手动禁用标记
  manuallyDisabled.value = false
  
  // 清除存储的偏好设置
  localStorage.removeItem('locationDisabled')
  localStorage.removeItem('locationAlertDismissed') // 重置警告状态，以便在权限再次被拒绝时显示
  
  // 重置位置权限状态
  locationPermissionStatus.value = 'prompt'
  locationPermissionDenied.value = false
  
  // 强制浏览器重新请求权限
  // 1. 先清除当前状态
  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' })
      .then(permissionStatus => {
        console.log('Current permission status:', permissionStatus.state);
      });
  }
  
  // 2. 通过使用一个一次性调用请求权限
  navigator.geolocation.getCurrentPosition(
    () => {
      // 成功获取位置后，正常调用完整的requestLocationPermission
      requestLocationPermission();
    },
    (error) => {
      console.log('Initial permission request failed:', error);
      // 即使初始请求失败，也尝试完整的权限请求流程
      requestLocationPermission();
    },
    { 
      maximumAge: 0, // 不使用缓存
      timeout: 5000   // 较短的超时
    }
  );
}
</script>