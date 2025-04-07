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

    <!-- Animated Popup -->
    <transition name="fade-slide">
      <div
        v-if="popupLandmark"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl border border-blue-300 p-4 w-full max-w-md z-50">
        <img :src="popupLandmark.image" class="w-full h-40 object-cover rounded-lg mb-3" />
        <h4 class="font-bold text-lg text-gray-800 mb-1">{{ popupLandmark.name }}</h4>
        <p class="text-sm text-gray-600 mb-2">{{ popupLandmark.description }}</p>
        <audio controls :src="popupAudio" class="w-full" />
        <button @click="popupLandmark = null" class="text-blue-600 hover:underline text-sm mt-2 block text-right">Close</button>
      </div>
    </transition>
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
import { useRoute } from 'vue-router'

// 获取路由参数
const route = useRoute()

// State
const selectedCulture = ref('chinese')
const landmarkSearch = ref('')
const viewMode = ref('map')
const activeLandmark = ref(null)
const popupLandmark = ref(null)
const popupAudio = '/src/info.mp3'
const showPopup = ref(false)

// 自动填充的目的地信息
const destinationInfo = ref({
  destination: '',
  eventName: '',
  eventTime: '',
  eventDate: '',
  address: ''
})

const userLocation = ref({ lat: -37.818267, lng: 144.952974 })
const landmarkRefs = {}

const transportMode = ref('TRANSIT')
const transportModeLabels = {
  TRANSIT: 'Public Transport',
  DRIVING: 'Driving',
  WALKING: 'Walking'
}
const routeSteps = ref([])
const routeSummary = ref({ duration: '', distance: '', arrival: '' })

// Map
const map = ref(null)
const mapMarkers = ref([])
const directionsService = ref(null)
const directionsRenderer = ref(null)

const cultures = [
  { label: 'Chinese', value: 'chinese' },
  { label: 'Indian', value: 'indian' }
]

const landmarks = {
  chinese: [
    { id: 'chinatown', name: 'Chinatown Melbourne', location: 'Little Bourke St', lat: -37.8115, lng: 144.9711, image: '/landmarks/chinatown.jpg', description: 'Historic precinct full of food and culture.' },
    { id: 'museum', name: 'Chinese Museum', location: 'Cohen Pl', lat: -37.8072, lng: 144.9706, image: '/landmarks/chinese-museum.jpg', description: 'Chinese heritage site.' }
  ],
  indian: [
    { id: 'temple', name: 'Shiva Vishnu Temple', location: 'Carrum Downs', lat: -37.6593, lng: 145.0584, image: '/landmarks/shiva-temple.jpg', description: 'Large Hindu temple.' },
    { id: 'dosa', name: 'Dosa Hut', location: 'Footscray', lat: -37.7994, lng: 144.8995, image: '/landmarks/dosa-hut.jpg', description: 'Famous South Indian food.' }
  ]
}

const filteredLandmarks = computed(() => {
  const list = landmarks[selectedCulture.value] || []
  if (!landmarkSearch.value) return list
  return list.filter(l => l.name.toLowerCase().includes(landmarkSearch.value.toLowerCase()))
})

function selectCulture(culture) {
  selectedCulture.value = culture
  landmarkSearch.value = ''
  updateMarkers()
}

function toggleView(mode) {
  viewMode.value = mode
}

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

function changeTransportMode(mode) {
  transportMode.value = mode
  if (activeLandmark.value) updateRouteToLandmark(activeLandmark.value)
}

function updateRouteToLandmark(landmark) {
  directionsRenderer.value.set('directions', null)
  const request = {
    origin: userLocation.value,
    destination: { lat: landmark.lat, lng: landmark.lng },
    travelMode: google.maps.TravelMode[transportMode.value]
  }

  try {
    directionsService.value.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.value.setDirections(result)

        const leg = result.routes[0].legs[0]

        routeSummary.value = {
          duration: leg.duration.text,
          distance: leg.distance.text,
          arrival: calculateArrivalTime(leg.duration.value)
        }

        // Build a detailed steps array
        const detailedSteps = []

        for (const step of leg.steps) {
          if (step.travel_mode === 'WALKING') {
            // For WALKING steps, fetch detailed route using WALKING mode
            try {
              directionsService.value.route({
                origin: step.start_location,
                destination: step.end_location,
                travelMode: google.maps.TravelMode.WALKING
              }, (walkResult, walkStatus) => {
                if (walkStatus === 'OK') {
                  const subSteps = walkResult.routes[0].legs[0].steps.map(subStep => ({
                    instructions: subStep.instructions,
                    distance: subStep.distance.text,
                    duration: subStep.duration.text
                  }))
                  detailedSteps.push(...subSteps)
                } else {
                  console.warn('WALKING detail fetch failed, fallback to original step.')
                  detailedSteps.push({
                    instructions: step.instructions,
                    distance: step.distance?.text || '',
                    duration: step.duration?.text || ''
                  })
                }
              })
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
            console.log('Step mode:', step.travel_mode);
            console.log('Transit Details:', step.transit);
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
            console.log('完整的JSON数据:', JSON.stringify(result, null, 2));
            detailedSteps.push({
              instructions: step.instructions + timingInfo,
              distance: step.distance?.text || '',
              duration: step.duration?.text || ''
            });
          } else {
            detailedSteps.push({
              instructions: step.instructions,
              distance: step.distance?.text || '',
              duration: step.duration?.text || ''
            })
          }
        }

        // Update route steps when all details are collected
        routeSteps.value = detailedSteps
      } else {
        console.error('Directions request failed due to ' + status)
      }
    })
  } catch (error) {
    console.error('Error calculating directions:', error)
  }
}

function calculateArrivalTime(durationInSeconds) {
  const now = new Date()
  const arrival = new Date(now.getTime() + durationInSeconds * 1000)
  return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

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
  map.value = new google.maps.Map(document.getElementById('map'), {
    center: userLocation.value,
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false
  })

  directionsService.value = new google.maps.DirectionsService()
  directionsRenderer.value = new google.maps.DirectionsRenderer({ map: map.value, suppressMarkers: false })

  updateMarkers()
}

function getDistance(loc1, loc2) {
  const R = 6371e3
  const φ1 = loc1.lat * Math.PI / 180
  const φ2 = loc2.lat * Math.PI / 180
  const Δφ = (loc2.lat - loc1.lat) * Math.PI / 180
  const Δλ = (loc2.lng - loc1.lng) * Math.PI / 180
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
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

async function savePDF() {
  try {
    const contentDiv = document.createElement('div');
    contentDiv.style.width = '600px';
    contentDiv.style.padding = '20px';
    contentDiv.style.background = 'white';
    contentDiv.style.fontFamily = 'Arial, sans-serif';

    contentDiv.innerHTML = `
      <h1 style="font-size: 24px; margin-bottom: 10px;">${activeLandmark.value.name}</h1>
      <p style="margin-bottom: 8px;"><strong>Location:</strong> ${activeLandmark.value.location}</p>
      <p style="margin-bottom: 10px;"><strong>Description:</strong> ${activeLandmark.value.description}</p>
      <img src="${activeLandmark.value.image}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;" />
      <p><strong>Total Distance:</strong> ${routeSummary.value.distance}</p>
      <p><strong>Estimated Time:</strong> ${routeSummary.value.duration}</p>
      <p><strong>Expected Arrival:</strong> ${routeSummary.value.arrival}</p>
      <h2 style="font-size: 18px; margin-top: 20px; margin-bottom: 10px;">Step-by-Step Directions:</h2>
    `;

    const stepsHtml = routeSteps.value.map((step, index) => `
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

    contentDiv.innerHTML += stepsHtml;
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

// 新增：处理自动填充
function handleAutoFill() {
  if (route.query.autoFill === 'true') {
    destinationInfo.value = {
      destination: route.query.destination || '',
      eventName: route.query.eventName || '',
      eventTime: route.query.eventTime || '',
      eventDate: route.query.eventDate || '',
      address: route.query.address || ''
    }
    
    // 如果有目的地，设置为搜索值并查找最近的地标
    if (destinationInfo.value.destination) {
      landmarkSearch.value = destinationInfo.value.destination
      
      // 延迟查找最匹配的地标，让界面先渲染
      setTimeout(() => {
        findAndNavigateToNearestLandmark(destinationInfo.value.destination)
      }, 1000)
    }
  }
}

// 新增：查找最接近目的地名称的地标并导航
function findAndNavigateToNearestLandmark(destination) {
  // 搜索所有文化类别下的地标
  let bestMatch = null
  let highestScore = -1
  
  for (const culture in landmarks) {
    for (const landmark of landmarks[culture]) {
      // 简单的字符串匹配评分
      const score = calculateMatchScore(landmark, destination)
      if (score > highestScore) {
        highestScore = score
        bestMatch = landmark
        selectedCulture.value = culture // 切换到匹配地标的文化类别
      }
    }
  }
  
  // 如果找到匹配的地标，导航到它
  if (bestMatch) {
    console.log('找到最匹配的地标:', bestMatch.name)
    nextTick(() => {
      handleLandmarkClick(bestMatch)
      viewMode.value = 'map' // 切换到地图视图
    })
  }
}

// 新增：计算地标与目的地名称的匹配度
function calculateMatchScore(landmark, destination) {
  const landmarkNameLower = landmark.name.toLowerCase()
  const destinationLower = destination.toLowerCase()
  
  // 完全匹配
  if (landmarkNameLower === destinationLower) return 100
  // 包含关系
  if (landmarkNameLower.includes(destinationLower) || destinationLower.includes(landmarkNameLower)) return 70
  // 部分单词匹配
  const landmarkWords = landmarkNameLower.split(/\s+/)
  const destinationWords = destinationLower.split(/\s+/)
  let wordMatches = 0
  
  for (const word1 of landmarkWords) {
    for (const word2 of destinationWords) {
      if (word1 === word2 && word1.length > 2) wordMatches++
      else if ((word1.includes(word2) || word2.includes(word1)) && word1.length > 3 && word2.length > 3) wordMatches += 0.5
    }
  }
  
  return wordMatches * 20
}

onMounted(() => {
  startLocationWatch()
  trackUserProximity()
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`
  script.async = true
  script.defer = true
  window.initMap = () => {
    initMap()
    // 地图加载完成后处理自动填充
    handleAutoFill()
  }
  document.head.appendChild(script)
})

onUnmounted(() => {
  delete window.initMap
  const script = document.querySelector('script[src*="maps.googleapis.com"]')
  if (script) script.remove()
})
</script>

