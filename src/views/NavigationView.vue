<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Search Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('travel.displayAddress') }}</h2>
        
        <!-- Address Display -->
        <div class="mb-6">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('travel.currentAddress') }}
            </label>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-start">
                <i class="mdi mdi-map-marker text-gray-500 text-xl mr-3"></i>
                <p class="text-gray-700">{{ searchQuery || $t('travel.noAddressSelected') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Location Info -->
        <div v-if="selectedLocation" class="bg-blue-50 p-4 rounded-lg mb-6">
          <div class="flex items-start">
            <i class="mdi mdi-information-outline text-blue-600 text-xl mr-3 mt-0.5"></i>
            <div>
              <h3 class="font-medium text-blue-900">{{ $t('travel.selectedLocation') }}</h3>
              <p class="text-blue-700 mt-1">{{ selectedLocation.address }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm h-96 overflow-hidden">
          <div id="map" class="w-full h-full"></div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="font-semibold mb-3">{{ $t('travel.transportMode') }}</h3>
          <div class="flex space-x-4">
            <button 
              @click="changeTransportMode('TRANSIT')"
              :class="[
                'flex-1 py-2 px-4 rounded-full transition-colors',
                transportMode === 'TRANSIT' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]">
              <span>{{ $t('travel.publicTransport') }}</span>
            </button>
            <button 
              @click="changeTransportMode('WALKING')"
              :class="[
                'flex-1 py-2 px-4 rounded-full transition-colors',
                transportMode === 'WALKING' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]">
              <span>{{ $t('travel.walking') }}</span>
            </button>
            <button 
              @click="changeTransportMode('DRIVING')"
              :class="[
                'flex-1 py-2 px-4 rounded-full transition-colors',
                transportMode === 'DRIVING' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]">
              <span>{{ $t('travel.driving') }}</span>
            </button>
          </div>
        </div>

        <!-- Route Summary -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">{{ $t('travel.routeInfo.estimatedTime') }}</h2>
            <button @click="savePDF" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <span>{{ $t('travel.actions.savePDF') }}</span>
            </button>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">{{ $t('travel.routeInfo.estimatedTime') }}</p>
                <p class="font-semibold">{{ routeSummary.duration || '-- mins' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ $t('travel.routeInfo.distance') }}</p>
                <p class="font-semibold">{{ routeSummary.distance || '-- km' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ $t('travel.routeInfo.arrival') }}</p>
                <p class="font-semibold">{{ routeSummary.arrival || '--:--' }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-4 overflow-y-auto max-h-[500px]">
            <div v-for="(step, index) in routeSteps" :key="index" class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <p class="font-medium" v-html="step.instructions"></p>
                <p class="text-sm text-gray-500">{{ step.distance }} • {{ step.duration }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nearby Events Section (Commented out for now) -->
      <!-- 
      <div class="bg-white rounded-lg shadow-sm p-6 mt-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ $t('travel.nearbyEvents') }}</h2>
          <span class="text-sm text-gray-500">{{ $t('travel.within2km') }}</span>
        </div>

        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else-if="nearbyEvents.length === 0" class="text-center py-12">
          <i class="mdi mdi-map-marker-off text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500">{{ $t('travel.noNearbyEvents') }}</p>
        </div>

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
      -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import html2canvas from 'html2canvas/dist/html2canvas.esm.js'
import { jsPDF } from 'jspdf'
import { useI18n } from 'vue-i18n'
import { formatEventDate } from '../utils/eventUtils'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const event = ref(null)
const map = ref(null)
const directionsService = ref(null)
const directionsRenderer = ref(null)
const placesService = ref(null)
const autocompleteService = ref(null)
const transportMode = ref('TRANSIT')
const routeSteps = ref([])
const routeSummary = ref({
  duration: '',
  distance: '',
  arrival: ''
})
const userLocation = ref({ lat: -37.8136, lng: 144.9631 }) // Melbourne CBD
const defaultImage = '/imageerror.png' 

const searchQuery = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)
const selectedLocation = ref(null)
const isLoading = ref(false)
const nearbyEvents = ref([])

onMounted(() => {
  const params = route.query
  if (params.destination) {
    searchQuery.value = decodeURIComponent(params.destination)
    event.value = {
      address: decodeURIComponent(params.destination),
      coordinates: null
    }
  }
  
  getUserLocation()
})

function getUserLocation() {
  if (navigator.geolocation) {
    isLoading.value = true
    
    const options = {
      enableHighAccuracy: true,  
      timeout: 10000,            
      maximumAge: 0              
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Got user location:', position.coords)
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
        initializeMap()
      },
      (error) => {
        console.warn('Failed to get user location:', error.message)
        alert(t('travel.locationError'))
        initializeMap()
      },
      options
    )
  } else {
    console.error('Geolocation is not supported by this browser')
    initializeMap()
  }
}

function initializeMap() {
  if (window.google && window.google.maps) {
    initMap()
  } else {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error("Google Maps API Key not found. Please set VITE_GOOGLE_MAPS_API_KEY in .env file")
      isLoading.value = false
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
}

function initMap() {
  try {
    map.value = new google.maps.Map(document.getElementById('map'), {
      center: userLocation.value,
      zoom: 14,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true
    })

    placesService.value = new google.maps.places.PlacesService(map.value)
    autocompleteService.value = new google.maps.places.AutocompleteService()
    directionsService.value = new google.maps.DirectionsService()
    directionsRenderer.value = new google.maps.DirectionsRenderer({
      map: map.value,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    })

    const userMarker = new google.maps.Marker({
      position: userLocation.value,
      map: map.value,
      title: t('travel.yourLocation'),
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      },
      animation: google.maps.Animation.DROP,
      zIndex: 2
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="padding:5px;"><strong>${t('travel.yourLocation')}</strong></div>`
    })

    userMarker.addListener('click', () => {
      infoWindow.open(map.value, userMarker)
    })
    
    infoWindow.open(map.value, userMarker)
    setTimeout(() => infoWindow.close(), 3000)

    if (event.value && event.value.address) {
      geocodeAddress(event.value.address)
    }
    
    isLoading.value = false
  } catch (error) {
    console.error("Error initializing map:", error)
    isLoading.value = false
  }
}

watch(locale, () => {
  if (event.value && event.value.coordinates) {
    calculateRoute()
  }
})

function updateURLParams(destination) {
  router.replace({
    query: {
      destination: encodeURIComponent(destination)
    }
  })
}

function changeTransportMode(mode) {
  transportMode.value = mode
  if (event.value && event.value.coordinates) {
    calculateRoute()
  }
}

async function calculateRoute() {
  if (!directionsService.value || !directionsRenderer.value || !event.value.coordinates) return

  const request = {
    origin: userLocation.value,
    destination: event.value.coordinates,
    travelMode: google.maps.TravelMode[transportMode.value]
  }

  try {
    const result = await directionsService.value.route(request)
    directionsRenderer.value.setDirections(result)

    const leg = result.routes[0].legs[0]
    const detailedSteps = []

    for (const step of leg.steps) {
      if (step.travel_mode === 'WALKING') {
        try {
          const walkResult = await directionsService.value.route({
            origin: step.start_location,
            destination: step.end_location,
            travelMode: google.maps.TravelMode.WALKING
          })

          const subSteps = walkResult.routes[0].legs[0].steps.map(subStep => ({
            instructions: subStep.instructions,
            distance: subStep.distance.text,
            duration: subStep.duration.text
          }))

          detailedSteps.push(...subSteps)
        } catch (walkError) {
          console.warn('WALKING detail fetch failed, fallback to original step.')
          detailedSteps.push({
            instructions: step.instructions,
            distance: step.distance?.text || '',
            duration: step.duration?.text || ''
          })
        }
      } else if (step.travel_mode === 'TRANSIT') {
        const transitDetails = step.transit
        let timingInfo = ''

        if (transitDetails) {
          const departure = transitDetails.departure_time?.text || ''
          const arrival = transitDetails.arrival_time?.text || ''
          let lineName = ''

          if (transitDetails.line) {
            lineName = transitDetails.line.short_name || transitDetails.line.name || ''
          }

          timingInfo = ` (Depart: ${departure}, Arrive: ${arrival}${lineName ? ', via ' + lineName : ''})`
        }

        detailedSteps.push({
          instructions: step.instructions + timingInfo,
          distance: step.distance?.text || '',
          duration: step.duration?.text || ''
        })
      } else {
        detailedSteps.push({
          instructions: step.instructions,
          distance: step.distance?.text || '',
          duration: step.duration?.text || ''
        })
      }
    }

    const translatedSteps = detailedSteps.map(step => {
      let translatedInstructions = step.instructions
      const distanceText = step.distance
      const durationText = step.duration

      if (locale.value === 'zh') {
        translatedInstructions = translatedInstructions
          .replace(/Head/gi, '出发')
          .replace(/Turn right/gi, '右转')
          .replace(/Turn left/gi, '左转')
          .replace(/Continue/gi, '继续')
          .replace(/Destination/gi, '目的地')
          .replace(/onto/gi, '到')
          .replace(/toward/gi, '朝向')
          .replace(/for/gi, '行驶')
          .replace(/Take/gi, '乘坐')
          .replace(/Bus/gi, '公交车')
          .replace(/Train/gi, '火车')
          .replace(/Tram/gi, '电车')
          .replace(/Walk/gi, '步行')
          .replace(/Drive/gi, '驾驶')
          .replace(/north/gi, '北')
          .replace(/south/gi, '南')
          .replace(/east/gi, '东')
          .replace(/west/gi, '西')
          .replace(/At the roundabout, take the (\d+)(st|nd|rd|th) exit/gi, '在环岛，走第 $1 个出口')
      } else if (locale.value === 'vi') {
        translatedInstructions = translatedInstructions
          .replace(/Head/gi, 'Đi')
          .replace(/Turn right/gi, 'Rẽ phải')
          .replace(/Turn left/gi, 'Rẽ trái')
          .replace(/Continue/gi, 'Tiếp tục')
          .replace(/Destination/gi, 'Điểm đến')
      }

      return {
        instructions: translatedInstructions,
        distance: distanceText,
        duration: durationText
      }
    })

    routeSteps.value = translatedSteps
    routeSummary.value = {
      duration: leg.duration.text,
      distance: leg.distance.text,
      arrival: calculateArrivalTime(leg.duration.value)
    }

    console.log('✅ Route updated with translated detailed steps:', translatedSteps)

  } catch (error) {
    console.error('❌ Error calculating route:', error)
  }
}

function calculateArrivalTime(durationInSeconds) {
  const now = new Date()
  const arrival = new Date(now.getTime() + durationInSeconds * 1000)
  return arrival.toLocaleTimeString([locale.value], { hour: '2-digit', minute: '2-digit' })
}

async function savePDF() {
  try {
    const contentDiv = document.createElement('div')
    contentDiv.style.padding = '20px'
    contentDiv.style.background = 'white'
    
    contentDiv.innerHTML = `
      <h1 style="font-size: 24px; margin-bottom: 10px;">${event.value.address}</h1>
      <div style="margin-bottom: 20px;">
        <p><strong>${t('travel.routeInfo.distance')}:</strong> ${routeSummary.value.distance}</p>
        <p><strong>${t('travel.routeInfo.estimatedTime')}:</strong> ${routeSummary.value.duration}</p>
        <p><strong>${t('travel.routeInfo.arrival')}:</strong> ${routeSummary.value.arrival}</p>
      </div>
      <h2 style="font-size: 18px; margin-bottom: 10px;">${t('landmarks.directions.steps')}:</h2>
    `
    
    const stepsHtml = routeSteps.value.map((step, index) => `
      <div style="margin-bottom: 15px;">
        <div style="display: flex; align-items: start;">
          <div style="width: 24px; height: 24px; background: #3B82F6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
            ${index + 1}
          </div>
          <div>
            <p style="margin: 0;">${step.instructions}</p>
            <p style="margin: 0; color: #666; font-size: 14px;">${step.distance} • ${step.duration}</p>
          </div>
        </div>
      </div>
    `).join('')
    
    contentDiv.innerHTML += stepsHtml
    
    document.body.appendChild(contentDiv)
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    const canvas = await html2canvas(contentDiv, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    
    document.body.removeChild(contentDiv)
    
    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    
    pdf.save(`Navigation Guide - ${event.value.address}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  }
}

const handleSearchInput = async () => {
  if (!searchQuery.value || !autocompleteService.value || !google?.maps?.places) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  try {
    const victoriaBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-39.2, 140.8), // Southwest corner (near Portland)
      new google.maps.LatLng(-33.9, 149.0)  // Northeast corner (near Wodonga)
    )

    const request = {
      input: searchQuery.value,
      bounds: victoriaBounds,
      location: new google.maps.LatLng(userLocation.value.lat, userLocation.value.lng),
      radius: 50000, // 50km radius
      componentRestrictions: { country: 'au' }
    }

    autocompleteService.value.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        suggestions.value = predictions
        showSuggestions.value = true
      } else {
        suggestions.value = []
        showSuggestions.value = false
      }
    })
  } catch (error) {
    console.error('Error getting place predictions:', error)
    suggestions.value = []
    showSuggestions.value = false
  }
}

const selectAddress = (prediction) => {
  if (!placesService.value || !google?.maps?.places) {
    console.error("Places service not available")
    return
  }

  const request = {
    placeId: prediction.place_id,
    fields: ['name', 'geometry', 'formatted_address']
  }

  placesService.value.getDetails(request, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && place) {
      searchQuery.value = place.formatted_address
      selectedLocation.value = {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      
      map.value.setCenter(place.geometry.location)
      map.value.setZoom(15)
      
      updateURLParams(place.formatted_address)
      
      event.value = {
        address: place.formatted_address,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }
      calculateRoute()
      
      suggestions.value = []
      showSuggestions.value = false
    }
  })
}

function geocodeAddress(address) {
  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const location = results[0].geometry.location
      event.value.coordinates = {
        lat: location.lat(),
        lng: location.lng()
      }
      map.value.setCenter(location)
      map.value.setZoom(15)
      calculateRoute()
    }
  })
}

const searchNearbyEvents = async () => {
  if (!selectedLocation.value) return

  isLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    nearbyEvents.value = [
      {
        id: 1,
        name: 'Melbourne Food Festival',
        category: 'Food & Drink',
        distance: 0.5,
        address: '123 Exhibition Street, Melbourne',
        image: '/events/food-festival.jpg',
        datetime: '2024-04-15T14:00:00'
      },
      {
        id: 2,
        name: 'Live Music Night',
        category: 'Music',
        distance: 1.2,
        address: '456 Russell Street, Melbourne',
        image: '/events/music-event.jpg',
        datetime: '2024-04-16T19:00:00'
      },
      {
        id: 3,
        name: 'Art Exhibition',
        category: 'Arts',
        distance: 1.8,
        address: '789 Lonsdale Street, Melbourne',
        image: '/events/art-exhibition.jpg',
        datetime: '2024-04-17T10:00:00'
      }
    ]
  } catch (error) {
    console.error('Error fetching nearby events:', error)
  } finally {
    isLoading.value = false
  }
}

const getCategoryColor = (category) => {
  const colors = {
    'Food & Drink': 'bg-orange-100 text-orange-800',
    'Music': 'bg-purple-100 text-purple-800',
    'Arts': 'bg-blue-100 text-blue-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return formatEventDate(dateString)
}

const showDirections = (event) => {
  event.value = {
    title: event.name,
    location: event.address,
    coordinates: {
      lat: -37.818085, 
      lng: 144.968124
    }
  }
  
  calculateRoute()
}

onUnmounted(() => {
  delete window.initMap
  const script = document.querySelector('script[src*="maps.googleapis.com"]')
  if (script) {
    script.remove()
  }
})

</script>

<style scoped>
.step-item {
  position: relative;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 15px;
  top: 40px;
  bottom: -20px;
  width: 2px;
  background-color: #e5e7eb;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>