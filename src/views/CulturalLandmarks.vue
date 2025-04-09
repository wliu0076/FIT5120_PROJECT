<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow-lg rounded-xl p-6 mb-8">
      <h2 class="text-3xl font-extrabold text-gray-800 mb-4">{{ $t('landmarks.title') }}</h2>
      <p class="text-lg text-gray-600 mb-6">{{ $t('landmarks.subtitle') }}</p>

      <div class="flex flex-wrap gap-3 mb-4">
        <button v-for="culture in cultures" :key="culture.value" @click="selectCulture(culture.value)"
          :class="[selectedCulture === culture.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200', 'px-4 py-2 rounded-full font-semibold border transition']">
          {{ $t(`landmarks.filters.${culture.value}`) }}
        </button>
      </div>

      <input v-model="landmarkSearch" type="text" :placeholder="$t('landmarks.searchPlaceholder')"
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />

      <ul v-if="placeSuggestions.length"
        class="absolute z-50 bg-white border border-gray-200 rounded-md mt-2 w-full max-h-60 overflow-auto shadow-lg">
        <li v-for="prediction in placeSuggestions" :key="prediction.place_id" @click="selectPlacePrediction(prediction)"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800">
          {{ prediction.description }}
        </li>
      </ul>
    </div>

    <div class="bg-white shadow-md rounded-xl p-4 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-700">{{ $t('landmarks.viewMode.title') }}</h3>
        <div class="flex space-x-2">
          <button @click="toggleView('list')" :class="[viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800', 'px-4 py-1 rounded-lg']">{{ $t('landmarks.viewMode.list') }}</button>
          <button @click="toggleView('map')" :class="[viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800', 'px-4 py-1 rounded-lg']">{{ $t('landmarks.viewMode.map') }}</button>
        </div>
      </div>
      <div v-show="viewMode === 'map'" class="rounded-lg shadow h-96 overflow-hidden">
        <div id="map" class="w-full h-full rounded-lg" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10" v-show="viewMode === 'list'">
      <div v-for="landmark in filteredLandmarks" :key="landmark.id" :ref="el => landmarkRefs[landmark.id] = el"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
        @click="handleLandmarkClick(landmark)">
        <img :src="landmark.image" @error="e => e.target.src = defaultImage"
          class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-bold text-gray-800">{{ landmark.name }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ landmark.location }}</p>
          <div class="mt-4 flex justify-end">
            <button 
              @click.stop="navigateToLandmark(landmark)"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <i class="mdi mdi-navigation mr-2"></i>
              {{ $t('landmarks.actions.navigate') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="routeSteps.length" class="bg-white shadow-md rounded-xl p-6 mb-10" ref="directionsSection">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">{{ $t('landmarks.directions.title') }} {{ activeLandmark?.name }}</h3>
        <div class="flex justify-end gap-3">
          <button @click="playAudioGuide"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
            <i class="mdi mdi-volume-high"></i><span>{{ $t('landmarks.directions.audioGuide') }}</span>
          </button>
          <button @click="savePDF"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <i class="mdi mdi-download"></i><span>{{ $t('landmarks.directions.savePdf') }}</span>
          </button>
        </div>
        <audio ref="audioRef" :src="popupAudio" class="hidden" />
      </div>

      <div class="flex space-x-3 mb-4">
        <button v-for="mode in ['TRANSIT', 'WALKING', 'DRIVING']" :key="mode"
          @click="changeTransportMode(mode)"
          :class="[transportMode === mode ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200', 'px-4 py-2 rounded-full border text-sm font-medium transition']">
          {{ $t(`landmarks.directions.${mode.toLowerCase()}`) }}
        </button>
      </div>

      <div class="text-sm text-gray-600 mb-6">
        <p><strong>{{ $t('landmarks.directions.distance') }}:</strong> {{ routeSummary.distance }}</p>
        <p><strong>{{ $t('landmarks.directions.time') }}:</strong> {{ routeSummary.duration }}</p>
        <p><strong>{{ $t('landmarks.directions.arrival') }}:</strong> {{ routeSummary.arrival }}</p>
      </div>

      <div class="space-y-4">
        <div v-for="(step, index) in routeSteps" :key="index" class="flex items-start space-x-4">
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

const selectedCulture = ref('chinese')
const landmarkSearch = ref('')
const viewMode = ref('list')
const landmarks = ref([])
const placeSuggestions = ref([])
const routeSteps = ref([])
const activeLandmark = ref(null)
const userLocation = ref({ lat: -37.818267, lng: 144.952974 })
const transportMode = ref('TRANSIT')
const routeSummary = ref({ duration: '', distance: '', arrival: '' })
const popupAudio = '/src/info.mp3'

const landmarkRefs = {}
const directionsSection = ref(null)
const defaultImage = '/imageerror.png'
const audioRef = ref(null)

const router = useRouter()

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
    ? ['chinese museum', 'place_of_worship', 'restaurant', 'tourist_attraction', 'store']
    : ['hindu_temple', 'restaurant', 'tourist_attraction Melbourne', 'store']

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
  
  // 清除当前地图标记
  clearMapMarkers()
  
  // 重置当前活动地标和路由步骤
  activeLandmark.value = null
  routeSteps.value = []
  
  // 获取新的地标列表
  fetchLandmarks()
  
  // 如果当前视图是列表，滚动到顶部
  if (viewMode.value === 'list') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function navigateToLandmark(landmark) {
  // 阻止事件冒泡，避免触发父元素的点击事件
  event.stopPropagation();
  
  // 添加日志以跟踪传递的数据
  console.log('导航到地标，传递的数据:', landmark);
  
  // 检查地标数据完整性
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

onMounted(() => {
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

  // 获取用户位置
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        userLocation.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
      },
      error => {
        console.warn('获取用户位置失败:', error)
      }
    )
  }

  // 初始化地图
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
</script>