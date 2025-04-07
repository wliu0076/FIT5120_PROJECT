<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Search Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('travel.searchLocation') }}</h2>
        
        <!-- Address Search with Autofill -->
        <div class="relative mb-6">
          <div class="flex space-x-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('travel.enterAddress') }}
              </label>
              <div class="relative">
                <input
                  type="text"
                  v-model="searchQuery"
                  @input="handleSearchInput"
                  :placeholder="$t('travel.addressPlaceholder')"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span class="absolute left-3 top-3 text-gray-400">
                  <i class="mdi mdi-map-marker text-xl"></i>
                </span>
              </div>
              <!-- Autofill Suggestions -->
              <div v-if="showSuggestions && suggestions.length > 0" 
                   class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                <ul class="py-1">
                  <li v-for="suggestion in suggestions" 
                      :key="suggestion.id"
                      @click="selectAddress(suggestion)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700">
                    {{ suggestion.address }}
                  </li>
                </ul>
              </div>
            </div>
            <button 
              @click="searchNearbyEvents"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-6">
              {{ $t('travel.searchNearby') }}
            </button>
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
        <!-- Destination Info Card -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="mdi mdi-map-marker text-2xl text-blue-600"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('travel.destination') }}</h3>
              <p class="text-gray-600 mt-1">{{ event.location }}</p>
              <div class="flex items-center mt-2 text-sm text-gray-500">
                <i class="mdi mdi-calendar mr-2"></i>
                <span>{{ event.date }}</span>
                <span class="mx-2">•</span>
                <i class="mdi mdi-clock-outline mr-2"></i>
                <span>{{ event.time }}</span>
              </div>
            </div>
          </div>
        </div>

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
            <img :src="event.image" :alt="event.name" class="w-full h-48 object-cover">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import html2canvas from 'html2canvas/dist/html2canvas.esm.js'
import { jsPDF } from 'jspdf'
import { useI18n } from 'vue-i18n'
import { formatEventDate } from '../utils/eventUtils'

const { t } = useI18n()

const route = useRoute()

const event = ref({
  title: route.query.eventName || 'Event',
  location: route.query.destination || '',
  date: route.query.eventDate || '',
  time: route.query.eventTime || ''
})

const map = ref(null)
const directionsService = ref(null)
const directionsRenderer = ref(null)
const transportMode = ref('TRANSIT')
const routeSummary = ref({
  duration: '',
  distance: '',
  arrival: ''
})
const routeSteps = ref([])

const userLocation = ref({
  lat: -37.818267, 
  lng: 144.952974  // Default to Southern Cross Station coordinates; will be updated if user grants permission
})

// 搜索相关状态
const searchQuery = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)
const selectedLocation = ref(null)
const isLoading = ref(false)
const nearbyEvents = ref([])

async function getUserLocation() {
  console.log('Attempting to get user location...');
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      });
      console.log('User location acquired:', position);

      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('Updated userLocation:', userLocation.value);

      // 如果地图已加载，则立即计算路线
      if (map.value) {
        console.log('Map is loaded, calculating route...');
        calculateRoute();
      } else {
        console.log('Map is not loaded yet, waiting for map initialization...');
      }
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  } else {
    console.warn('Geolocation is not supported by this browser.');
  }
}

async function changeTransportMode(mode) {
  transportMode.value = mode
  await calculateRoute()
}

async function calculateRoute() {
  if (!directionsService.value || !directionsRenderer.value) return

  const request = {
    origin: userLocation.value,
    destination: event.value.location,
    travelMode: google.maps.TravelMode[transportMode.value]
  }

  try {
    const result = await directionsService.value.route(request)
    directionsRenderer.value.setDirections(result)

    const leg = result.routes[0].legs[0]

    routeSummary.value = {
      duration: leg.duration.text,
      distance: leg.distance.text,
      arrival: calculateArrivalTime(leg.duration.value)
    }

    if (transportMode.value === 'TRANSIT') {
    // 假设到达时间为 2025-04-10 14:00:00
    request.arrival_time = new Date("2025-04-10T14:00:00").getTime() / 1000
  }

    // Build a detailed steps array
    const detailedSteps = []

    for (const step of leg.steps) {
      if (step.travel_mode === 'WALKING') {
        // For WALKING steps, fetch detailed route using WALKING mode
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
    // bus train station
    const transitDetails = step.transit;
        let timingInfo = '';
        if (transitDetails) {
          const departure = transitDetails.departure_time ? transitDetails.departure_time.text : '';
          const arrival = transitDetails.arrival_time ? transitDetails.arrival_time.text : '';
          let lineName = '';
          if (transitDetails.line) {
            lineName = transitDetails.line.short_name || transitDetails.line.name || '';
          }
          timingInfo = ` (Depart: ${departure}, Arrive: ${arrival}${lineName ? ', via ' + lineName : ''})`;
        }
        detailedSteps.push({
          instructions: step.instructions + timingInfo,
          distance: step.distance?.text || '',
          duration: step.duration?.text || ''
        });
      } 
    else {
        detailedSteps.push({
          instructions: step.instructions,
          distance: step.distance?.text || '',
          duration: step.duration?.text || ''
        })
      }
    }

    routeSteps.value = detailedSteps
  } catch (error) {
    console.error('Direction request failed:', error)
  }
}


function calculateArrivalTime(durationInSeconds) {
  const now = new Date()
  const arrivalTime = new Date(now.getTime() + durationInSeconds * 1000)
  return arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function savePDF() {
  try {
    const contentDiv = document.createElement('div')
    contentDiv.style.padding = '20px'
    contentDiv.style.background = 'white'
    
    contentDiv.innerHTML = `
      <h1 style="font-size: 24px; margin-bottom: 10px;">${event.value.title}</h1>
      <p style="margin-bottom: 20px;">${event.value.location} • ${event.value.date} • ${event.value.time}</p>
      <div style="margin-bottom: 20px;">
        <p><strong>Total Distance:</strong> ${routeSummary.value.distance}</p>
        <p><strong>Estimated Time:</strong> ${routeSummary.value.duration}</p>
        <p><strong>Expected Arrival:</strong> ${routeSummary.value.arrival}</p>
      </div>
      <h2 style="font-size: 18px; margin-bottom: 10px;">Step-by-Step Instructions:</h2>
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
    
    pdf.save(`${event.value.title} - Navigation Guide.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  }
}

function initMap() {
  const mapOptions = {
    zoom: 13,
    center: event.value.coordinates,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  }

  map.value = new google.maps.Map(document.getElementById('map'), mapOptions)
  directionsService.value = new google.maps.DirectionsService()
  directionsRenderer.value = new google.maps.DirectionsRenderer({
    map: map.value,
    suppressMarkers: false
  })

  // 如果用户位置已获取，则直接计算路线
  if (userLocation.value && userLocation.value.lat) {
    calculateRoute()
  }
}

onMounted(() => {
  // 先请求用户位置，这样会弹出授权提示
  getUserLocation()
  
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`
  script.async = true
  script.defer = true
  window.initMap = initMap
  document.head.appendChild(script)
})

onUnmounted(() => {
  delete window.initMap
  const script = document.querySelector('script[src*="maps.googleapis.com"]')
  if (script) {
    script.remove()
  }
})

// 模拟地址建议
const handleSearchInput = async () => {
  if (searchQuery.value.length < 3) {
    showSuggestions.value = false
    return
  }

  // TODO: 实现实际的地址自动完成API调用
  // 这里使用模拟数据
  suggestions.value = [
    { id: 1, address: '123 Flinders Street, Melbourne VIC 3000' },
    { id: 2, address: '456 Collins Street, Melbourne VIC 3000' },
    { id: 3, address: '789 Bourke Street, Melbourne VIC 3000' }
  ]
  showSuggestions.value = true
}

// 选择地址
const selectAddress = (suggestion) => {
  searchQuery.value = suggestion.address
  selectedLocation.value = suggestion
  showSuggestions.value = false
}

// 搜索附近活动 (暂时注释掉)
/*
const searchNearbyEvents = async () => {
  if (!selectedLocation.value) return

  isLoading.value = true
  
  try {
    // TODO: 实现实际的附近活动搜索API调用
    // 这里使用模拟数据
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
    // TODO: 显示错误消息
  } finally {
    isLoading.value = false
  }
}
*/

// 获取分类颜色 (暂时注释掉)
/*
const getCategoryColor = (category) => {
  const colors = {
    'Food & Drink': 'bg-orange-100 text-orange-800',
    'Music': 'bg-purple-100 text-purple-800',
    'Arts': 'bg-blue-100 text-blue-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}
*/

// 格式化日期 (暂时注释掉)
/*
const formatDate = (dateString) => {
  return formatEventDate(dateString)
}
*/

// 显示路线 (暂时注释掉)
/*
const showDirections = (event) => {
  // 更新地图上的目的地
  event.value = {
    title: event.name,
    location: event.address,
    coordinates: {
      lat: -37.818085, // 这里应该使用实际的事件坐标
      lng: 144.968124
    }
  }
  
  // 重新计算路线
  calculateRoute()
}
*/
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
