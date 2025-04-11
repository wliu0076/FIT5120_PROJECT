<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <audio ref="audioRef" controls style="display: none;"></audio>
    
    <!-- Location Permission Alert - 只在权限被拒绝且尚未手动禁用时显示 -->
    <div v-if="showLocationAlert && locationPermissionStatus !== 'granted'" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg shadow-md">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <i class="mdi mdi-alert-circle text-2xl text-yellow-500 mr-3"></i>
        </div>
        <div>
          <p class="font-medium">{{ $t('location.accessDisabled') || 'Location access is disabled' }}</p>
          <p class="text-sm">{{ $t('location.needAccess') || 'We need your location to provide accurate navigation. Please enable location access in your browser settings.' }}</p>
        </div>
        <button @click="dismissLocationAlert" class="ml-auto text-yellow-500 hover:text-yellow-700">
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>
    </div>
    
    <!-- Location Permission Status Banner (when denied) -->
    <div v-if="locationPermissionDenied" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center shadow-sm">
      <i class="mdi mdi-map-marker-off text-2xl text-red-500 mr-3"></i>
      <div>
        <p class="font-medium text-red-800">{{ $t('location.accessDenied') || 'Location access denied' }}</p>
        <p class="text-sm text-red-700">{{ $t('location.usingDefault') || 'Without location access, we\'ll use a default position in Melbourne CBD for your starting point.' }}</p>
      </div>
      <div class="ml-auto flex space-x-2">
        <button @click="requestLocationPermission" class="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors">
          {{ $t('location.tryAgain') || 'Try Again' }}
        </button>
        <button v-if="manuallyDisabled" @click="enableLocation" class="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors">
          {{ $t('location.enable') || 'Enable Location' }}
        </button>
      </div>
    </div>

    <!-- Location Permission Controls -->
    <div v-if="locationPermissionStatus === 'granted'" class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center shadow-sm">
      <i class="mdi mdi-map-marker text-2xl text-blue-500 mr-3"></i>
      <div>
        <p class="font-medium text-blue-800">{{ $t('location.accessEnabled') || 'Location access is enabled' }}</p>
        <p class="text-sm text-blue-700">{{ $t('location.usingCurrent') || 'We\'re using your current location to provide accurate navigation.' }}</p>
      </div>
      <button @click="disableLocation" class="ml-auto bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors">
        {{ $t('location.disable') || 'Disable Location' }}
      </button>
    </div>
    
    <!-- Popup when user is near the landmark -->
    <div v-if="showProximityPopup"
      class="fixed bottom-0 left-0 right-0 bg-white text-gray-800 p-4 rounded-t-xl shadow-xl flex flex-col items-center w-full animate-popup z-50">
      <div class="relative w-2/3 h-48 flex justify-center items-center mb-4">
        <img :src="landmark?.image" @error="e => e.target.src = defaultImage" alt="Landmark Image" class="object-contain w-full h-full rounded-md" />
      </div>

      <p class="text-lg font-bold text-gray-900 mb-2">{{ landmark?.name }}</p>
      <p class="text-sm text-gray-600 mb-3">{{ $t('landmarks.proximity.nearby', { distance: Math.round(proximityDistance) }) || `You are ${Math.round(proximityDistance)} meters away` }}</p>

      <button @click="playAudio"
        class="bg-indigo-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-indigo-700 transition-all ease-in-out duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 mb-2">
        <i :class="isAudioPlaying ? 'mdi mdi-pause' : 'mdi mdi-volume-high'" class="text-2xl"></i>
        <span class="text-lg font-medium">{{ isAudioPlaying ? 'Stop Audio' : $t('landmarks.directions.audioGuide') }}</span>
      </button>

      <button @click="showProximityPopup = false" class="absolute top-2 right-2 text-blue-500 hover:text-blue-700">
        <i class="mdi mdi-close text-xl"></i>
      </button>
    </div>
    
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center max-w-md">
        <div class="loader mb-4">
          <svg class="circular-loader" viewBox="25 25 50 50">
            <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke-width="3" />
          </svg>
        </div>
        <p class="text-gray-700 font-medium text-lg">{{ loadingMessage }}</p>
        <p class="text-gray-500 text-sm mt-2">{{ $t('landmarks.loading.pleaseWait') }}</p>
      </div>
    </div>

    <!-- Landmark Info Section -->
    <div class="bg-white shadow-lg rounded-xl p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-800">{{ landmark?.name ? processLandmarkName(landmark.name) : '' }}</h2>
        <div class="flex gap-3">
          <button @click="playAudio"
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out duration-200 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-105">
            <i :class="isAudioPlaying ? 'mdi mdi-pause' : 'mdi mdi-volume-high'" class="text-2xl"></i>
            <span class="text-lg font-medium">{{ isAudioPlaying ? 'Stop Audio' : $t('landmarks.directions.audioGuide')
              }}</span>
          </button>
          
          <div class="relative">
            <button @click="toggleLanguageDropdown"
              class="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105">
              <i class="mdi mdi-translate text-xl"></i>
              <span class="text-lg font-medium">{{ currentLanguageDisplay }}</span>
              <i class="mdi mdi-chevron-down text-sm"></i>
            </button>
            
            <div v-if="showLanguageDropdown" 
                 class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 z-50">
              <div v-for="(lang, code) in availableLanguages" :key="code"
                   @click="changeLanguage(code)"
                   class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                   :class="{ 'bg-blue-50': locale === code }">
                <span class="mr-2">{{ lang.flag }}</span>
                <span>{{ lang.name }}</span>
              </div>
            </div>
          </div>
          
          <button @click="savePDF"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <i class="mdi mdi-download mr-2"></i>
            <span>{{ $t('landmarks.directions.savePdf') }}</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <img :src="landmark?.image" @error="e => e.target.src = defaultImage"
          class="w-full h-64 object-cover rounded-lg shadow-md" />
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('landmarks.description') }}</h3>
          <div v-if="isDescriptionLoading" class="flex flex-col items-center py-4">
            <div class="loader-small mb-2">
              <svg class="circular-loader" viewBox="25 25 50 50">
                <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke-width="3" />
              </svg>
            </div>
            <p class="text-gray-500 text-sm">{{ $t('landmarks.loading.loadingDescription') }}</p>
          </div>
          <p v-else class="text-gray-600 mb-4">{{ translatedDescription || landmark?.description }}</p>
          <p class="text-gray-700"><strong>{{ $t('landmarks.directions.location') }}:</strong> {{ landmark?.location }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation Section -->
    <div class="bg-white shadow-lg rounded-xl p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-800">{{ $t('landmarks.directions.title') }}</h3>
      </div>

      <div class="flex space-x-3 mb-6">
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

      <!-- Map View -->
      <div class="rounded-lg shadow h-96 overflow-hidden mb-6">
        <div id="map" class="w-full h-full rounded-lg" />
      </div>

      <!-- Route Steps -->
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

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const { t, locale } = useI18n()
const route = useRoute()

const map = ref(null)
const directionsService = ref(null)
const directionsRenderer = ref(null)
const landmark = ref(null)
const translatedDescription = ref('')

// 简单地添加移民博物馆的中文名称处理
function processLandmarkName(name) {
  if (name && name.includes('Immigration Museum') && locale.value === 'zh') {
    return '移民博物馆'
  }
  if (name && name.includes('Immigration Museum') && locale.value === 'hi') {
    return 'इमिग्रेशन म्यूजियम'
  }
  return name
}

// Location permission state
const locationPermissionDenied = ref(false)
const showLocationAlert = ref(false)
const locationPermissionStatus = ref('prompt') // 'prompt', 'granted', 'denied'
const manuallyDisabled = ref(false)

const userLocation = ref({ lat: -37.818267, lng: 144.952974 })
const transportMode = ref('TRANSIT')
const routeSteps = ref([])
const routeSummary = ref({ duration: '', distance: '', arrival: '' })
const defaultImage = '/imageerror.png'
const audioRef = ref(null)
const popupAudio = '/src/info.mp3'

const isAudioPlaying = ref(false)
const audioBlobUrl = ref(null)

const isLoading = ref(true)
const isDescriptionLoading = ref(true)
const loadingMessage = ref('')
const showLanguageDropdown = ref(false)
const availableLanguages = {
  en: { name: 'English', flag: '🇬🇧' },
  zh: { name: '中文', flag: '🇨🇳' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' }
}

const currentLanguageDisplay = computed(() => {
  return availableLanguages[locale.value]?.name || 'English'
})

function toggleLanguageDropdown() {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

function changeLanguage(langCode) {
  if (locale.value !== langCode) {
    locale.value = langCode
    
    if (landmark.value?.id) {
      fetchTranslatedDescription()
    }
    
    if (isAudioPlaying.value) {
      audioRef.value.pause()
      isAudioPlaying.value = false
      setTimeout(() => {
        playAudio()
      }, 300)
    }

    if (routeSteps.value.length > 0) {
      updateRoute()
    }
  }
  
  showLanguageDropdown.value = false
}

const languageDropdownOpen = ref(false)
const dropdownRef = ref(null)
const languageBtnRef = ref(null)

const setupClickOutsideListener = () => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.value && 
      !dropdownRef.value.contains(event.target) &&
      languageBtnRef.value && 
      !languageBtnRef.value.contains(event.target)
    ) {
      languageDropdownOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
}

let cleanupClickOutside = null

watch(locale, (newLocale) => {
  console.log(`Language changed to: ${newLocale}`)
  
  if (window.google && window.google.maps) {
    const scripts = document.querySelectorAll('script[src*="maps.googleapis.com/maps/api/js"]')
    scripts.forEach(script => script.remove())
    
    window.google = undefined

    setTimeout(() => {
      loadGoogleMapsScript()
    }, 300)
  }
})

function setLoading(loading, message = '') {
  isLoading.value = loading
  if (message) {
    loadingMessage.value = message
  }
}

// Hash function to convert string to a unique numerical ID
function stringToNumericID(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i); // (hash * 31) + charCodeAt
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash); // Ensure positive ID
}

// Get landmark description translation
async function fetchTranslatedDescription() {
  if (!landmark.value?.id) {
    console.error('No landmark ID available');
    isDescriptionLoading.value = false;
    return;
  }

  try {
    setLoading(true, 'Getting landmark description translation');
    isDescriptionLoading.value = true;

    const requestData = {
      id: landmark.value.id,
      name: landmark.value.name,
      address: landmark.value.location || landmark.value.address, // Use location while maintaining support for address
      language: locale.value
    };

    // Get API base URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    console.log('Sending translation request:', requestData);
    console.log('API Base URL:', apiBaseUrl);

    const response = await fetch(`${apiBaseUrl}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`API response: ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Translation API response:', data);
    
    // 更新经纬度信息（如果 API 返回了这些信息）
    if (data.lat && data.lng) {
      console.log('Updating landmark coordinates from API response');
      landmark.value.lat = parseFloat(data.lat);
      landmark.value.lng = parseFloat(data.lng);
    } else if (data.geometry && data.geometry.location) {
      console.log('Updating landmark coordinates from API geometry');
      landmark.value.lat = parseFloat(data.geometry.location.lat);
      landmark.value.lng = parseFloat(data.geometry.location.lng);
    }
    
    if (data.translated_description) {
      translatedDescription.value = data.translated_description;
    } else if (data.description) {
      // If no translation but original description exists, use original description
      translatedDescription.value = data.description;
    } else {
      console.warn('No description in response:', data);
      // Fall back to landmark's own description
      translatedDescription.value = landmark.value.description;
    }
    
    // If map is already initialized, update the route with new coordinates
    if (map.value && landmark.value.lat && landmark.value.lng) {
      console.log('Map already initialized, updating route with new coordinates');
      updateRoute();
    } else {
      console.log('Loading Google Maps with updated landmark data');
      // Otherwise, load Google Maps which will then call updateRoute
      loadGoogleMapsScript();
    }
  } catch (error) {
    console.error('Error getting translation:', error);
    // On error, use landmark's own description
    translatedDescription.value = landmark.value.description;
    
    // Still try to load the map even if translation failed
    if (!map.value) {
      loadGoogleMapsScript();
    }
  } finally {
    setLoading(false);
    isDescriptionLoading.value = false;
  }
}

function changeTransportMode(mode) {
  setLoading(true, 'Updating route information')
  transportMode.value = mode
  updateRoute()
}

function updateRoute() {
  if (!directionsService.value || !directionsRenderer.value || !landmark.value) {
    console.error('Missing required services or landmark data:', {
      directionsService: !!directionsService.value,
      directionsRenderer: !!directionsRenderer.value,
      landmark: !!landmark.value
    });
    setLoading(false);
    return;
  }

  setLoading(true, 'Calculating best route');
  
  console.log('Calculating route from', userLocation.value, 'to', { lat: landmark.value.lat, lng: landmark.value.lng });
  
  if (!landmark.value.lat || !landmark.value.lng) {
    console.error('Landmark is missing latitude or longitude:', landmark.value);
    setLoading(false);
    return;
  }

  // 确保经纬度为数值类型
  const destinationLat = parseFloat(landmark.value.lat);
  const destinationLng = parseFloat(landmark.value.lng);
  
  if (isNaN(destinationLat) || isNaN(destinationLng)) {
    console.error('Invalid landmark coordinates:', landmark.value);
    setLoading(false);
    return;
  }

  directionsService.value.route({
    origin: userLocation.value,
    destination: { lat: destinationLat, lng: destinationLng },
    travelMode: google.maps.TravelMode[transportMode.value]
  }, async (res, status) => {
    setLoading(false);

    if (status === 'OK' && res) {
      console.log('Route calculated successfully:', res);
      directionsRenderer.value.setDirections(res);
      const leg = res.routes[0].legs[0];
      const detailedSteps = [];

      for (const step of leg.steps) {
        if (step.travel_mode === 'WALKING') {
          try {
            const walkResult = await directionsService.value.route({
              origin: step.start_location,
              destination: step.end_location,
              travelMode: google.maps.TravelMode.WALKING
            });

            const subSteps = walkResult.routes[0].legs[0].steps.map(subStep => ({
              instructions: subStep.instructions,
              distance: subStep.distance.text,
              duration: subStep.duration.text
            }));

            detailedSteps.push(...subSteps);
          } catch (walkError) {
            console.warn('WALKING detail fetch failed, fallback to original step:', walkError);
            detailedSteps.push({
              instructions: step.instructions,
              distance: step.distance?.text || '',
              duration: step.duration?.text || ''
            });
          }
        } else if (step.travel_mode === 'TRANSIT') {
          const transitDetails = step.transit;
          let timingInfo = '';

          if (transitDetails) {
            const departure = transitDetails.departure_time?.text || '';
            const arrival = transitDetails.arrival_time?.text || '';
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
        } else {
          detailedSteps.push({
            instructions: step.instructions,
            distance: step.distance?.text || '',
            duration: step.duration?.text || ''
          });
        }
      }

      const translatedSteps = detailedSteps.map(step => {
        let translatedInstructions = step.instructions;

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
        } else if (locale.value === 'hi') {
          // Hindi translations could be added here if needed
        }

        return {
          instructions: translatedInstructions,
          distance: step.distance,
          duration: step.duration
        };
      });

      routeSteps.value = translatedSteps;
      routeSummary.value = {
        duration: leg.duration.text,
        distance: leg.distance.text,
        arrival: calculateArrivalTime(leg.duration.value)
      };

      console.log('✅ Route steps updated:', translatedSteps);
    } else {
      console.error('❌ Failed to get route:', status, res);
    }
  });
}

function calculateArrivalTime(seconds) {
  const arrival = new Date(Date.now() + seconds * 1000)
  return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function initMap() {
  if (!google?.maps) {
    console.error('Google Maps API not loaded');
    setLoading(false);
    return;
  }

  setLoading(true, 'Loading map');
  
  try {
    console.log('Initializing map with user location:', userLocation.value);
    
    map.value = new google.maps.Map(document.getElementById('map'), {
      center: userLocation.value,
      zoom: 13,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true
    });

    directionsService.value = new google.maps.DirectionsService();
    directionsRenderer.value = new google.maps.DirectionsRenderer({
      map: map.value,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });

    const userMarker = new google.maps.Marker({
      position: userLocation.value,
      map: map.value,
      title: 'Your Location',
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
    });

    const infoWindow = new google.maps.InfoWindow({
      content: '<div style="padding:5px;"><strong>Your Location</strong></div>'
    });

    userMarker.addListener('click', () => {
      infoWindow.open(map.value, userMarker);
    });
    
    infoWindow.open(map.value, userMarker);
    setTimeout(() => infoWindow.close(), 3000);

    if (landmark.value) {
      console.log('Landmark data available, updating route:', landmark.value);
      
      // Add a marker for the landmark
      new google.maps.Marker({
        position: { lat: landmark.value.lat, lng: landmark.value.lng },
        map: map.value,
        title: landmark.value.name,
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });
      
      updateRoute();
    } else {
      console.warn('No landmark data available for route calculation');
      setLoading(false);
    }
  } catch (error) {
    console.error('Error initializing map:', error);
    setLoading(false);
  }
}

function savePDF() {
  if (!landmark.value) return

  setLoading(true, 'Generating PDF file')
  
  const contentDiv = document.createElement('div')
  contentDiv.style.width = '600px'
  contentDiv.style.padding = '20px'
  contentDiv.style.background = 'white'
  contentDiv.style.fontFamily = 'Arial'

  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.style.width = '100%'
  img.style.maxWidth = '500px'
  img.style.borderRadius = '8px'
  img.style.marginBottom = '15px'
  img.style.marginTop = '15px'

  contentDiv.innerHTML = `
    <h1 style="font-size: 24px; color: #333;">${processLandmarkName(landmark.value.name)}</h1>
    <p><strong>${t('landmarks.directions.location')}:</strong> ${landmark.value.location}</p>
    <div id="landmark-image-container" style="width:100%;height:250px;background:#f0f0f0;display:flex;justify-content:center;align-items:center;border-radius:8px;"></div>
    <p><strong>${t('landmarks.directions.description')}:</strong> ${translatedDescription.value || landmark.value.description}</p>
    <p><strong>${t('landmarks.directions.distance')}:</strong> ${routeSummary.value.distance}</p>
    <p><strong>${t('landmarks.directions.time')}:</strong> ${routeSummary.value.duration}</p>
    <p><strong>${t('landmarks.directions.arrival')}:</strong> ${routeSummary.value.arrival}</p>
    <h2 style="font-size: 20px; margin-top: 20px;">${t('landmarks.directions.steps')}:</h2>
    ${routeSteps.value.map((s, i) => `
      <p><strong>${i + 1}.</strong> ${s.instructions} (${s.distance}, ${s.duration})</p>
    `).join('')}
  `
  
  document.body.appendChild(contentDiv)
  const imageContainer = contentDiv.querySelector('#landmark-image-container')
  
  img.onload = function() {
    if(imageContainer) {
      imageContainer.innerHTML = ''
      imageContainer.appendChild(img)

      setTimeout(() => {
        html2canvas(contentDiv, {
          useCORS: true,
          allowTaint: true,
          scale: 2
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0)
          const pdf = new jsPDF('p', 'mm', 'a4')
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          const canvasWidth = canvas.width
          const canvasHeight = canvas.height
          const ratio = canvasWidth / canvasHeight
          let heightForWidth = pdfWidth / ratio
          
          if (heightForWidth > pdfHeight) {
            heightForWidth = pdfHeight
          }
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, heightForWidth)
          pdf.save(`${landmark.value.name}-guide.pdf`)
          
          document.body.removeChild(contentDiv)
          setLoading(false)
        }).catch(error => {
          console.error('Canvas error:', error)
          setLoading(false)
          document.body.removeChild(contentDiv)
        })
      }, 500)
    }
  }
  
  img.onerror = function() {
    console.error('Image failed to load')
    if(imageContainer) {
      imageContainer.innerHTML = `<div style="text-align:center;padding:20px;color:#666;">${t('landmarks.imageError')}</div>`
    }
    
    setTimeout(() => {
      html2canvas(contentDiv, {
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        const pdf = new jsPDF()
        const imgData = canvas.toDataURL('image/jpeg')
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 0)
        pdf.save(`${landmark.value.name}-guide.pdf`)
        document.body.removeChild(contentDiv)
        setLoading(false)
      }).catch(error => {
        console.error('PDF generation error:', error)
        setLoading(false)
        document.body.removeChild(contentDiv)
      })
    }, 500)
  }
  
  img.src = landmark.value.image || defaultImage
}

function playAudio() {
  try {
    // Check if audio is already playing
    if (isAudioPlaying.value) {
      console.log('Audio is already playing, pausing it');
      audioRef.value.pause();
      isAudioPlaying.value = false;
      return;
    }

    // Clear previous audio URL if it exists
    if (audioBlobUrl.value) {
      console.log('Revoking previous audio URL');
      URL.revokeObjectURL(audioBlobUrl.value);
    }

    // Prepare the request data with the numeric ID
    const requestData = {
      id: landmark.value.id,
      name: landmark.value.name,
      address: landmark.value.location || landmark.value.address,
      language: locale.value,
    };

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

    // Sending POST request to backend
    console.log('Sending request to backend with data:', requestData);
    fetch(`${apiBaseUrl}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch audio');
      return response.json();
    })
    .then(data => {
      // Check if audio_base64 data exists in response
      if (!data.audio_base64) {
        throw new Error('No audio_base64 data in response');
      }

      // Decode base64 audio data
      const binaryString = atob(data.audio_base64); // Convert base64 to binary string

      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i); // Create byte array
      }

      // Create Blob from the byte array and set MIME type to audio/mp3
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });

      // Create an Object URL for the Blob
      audioBlobUrl.value = URL.createObjectURL(audioBlob);

      // Set the audio source to the blob URL
      audioRef.value.src = audioBlobUrl.value;

      // Set up audio event listeners
      audioRef.value.onplay = () => {
        console.log('Audio started playing');
        isAudioPlaying.value = true;
      };

      audioRef.value.onpause = () => {
        console.log('Audio paused');
        isAudioPlaying.value = false;
      };

      audioRef.value.onended = () => {
        console.log('Audio ended');
        isAudioPlaying.value = false;
      };

      // Start playing the audio
      console.log('Starting audio playback');
      audioRef.value.play()
        .catch(error => {
          console.error('Error playing audio:', error);
          isAudioPlaying.value = false;
        });
    })
    .catch(error => {
      console.error('Error getting audio from API:', error);
      
      // Fallback to a local audio file if API fails
      console.log('Trying to play fallback audio:', popupAudio);
      audioRef.value.src = popupAudio;
      audioRef.value.play()
        .then(() => {
          isAudioPlaying.value = true;
        })
        .catch(fallbackError => {
          console.error('Fallback audio failed:', fallbackError);
        });
    });
  } catch (error) {
    console.error('Error in playAudio function:', error);
  }
}

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

// Function to manually disable location tracking
function disableLocation() {
  // Stop location tracking
  stopLocationTracking()
  
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
    // Refresh route with new location
    updateRoute()
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
      startLocationTracking();
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

// Replace the original getUserLocation function with our enhanced version
function getUserLocation() {
  // Check if location was manually disabled by user
  const locationDisabled = localStorage.getItem('locationDisabled') === 'true'
  
  if (locationDisabled) {
    locationPermissionDenied.value = true
    locationPermissionStatus.value = 'denied'
    manuallyDisabled.value = true
    showLocationAlert.value = true
    loadGoogleMapsScript() // Continue loading map with default location
    return
  }
  
  // Check if location permission was previously granted or denied
  checkLocationPermission().then(status => {
    locationPermissionStatus.value = status
    
    if (status === 'granted') {
      requestLocationPermission()
      startLocationTracking()
    } else if (status === 'denied') {
      locationPermissionDenied.value = true
      showLocationAlert.value = true
      loadGoogleMapsScript() // Continue loading map with default location
    } else {
      // Check if alert was previously dismissed
      const alertDismissed = localStorage.getItem('locationAlertDismissed') === 'true'
      if (!alertDismissed) {
        showLocationAlert.value = true
      }
      
      requestLocationPermission()
    }
  })
}

// Function to request location permission
function requestLocationPermission() {
  if (navigator.geolocation) {
    setLoading(true, 'Getting your location')
    
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
        
        // Update map if it exists
        if (map.value) {
          map.value.setCenter(userLocation.value)
          // Refresh route with new location
          updateRoute()
        }
        
        // Start tracking user location for proximity alerts
        startLocationTracking()
        
        setLoading(false)
      },
      error => {
        console.warn('获取用户位置失败:', error)
        locationPermissionDenied.value = true
        locationPermissionStatus.value = 'denied'
        showLocationAlert.value = true
        loadGoogleMapsScript() // Continue loading map with default location
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
    loadGoogleMapsScript() // Continue loading map with default location
  }
}

const locationWatcherId = ref(null)
const showProximityPopup = ref(false)
const proximityThreshold = 500 // 显示弹窗的距离阈值（米）
const proximityDistance = ref(0)

// Function to calculate the distance between two geographic points (latitude, longitude) using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity
  
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return distance * 1000 // Convert to meters
}

// Check if user is near the landmark
function checkProximity() {
  if (!landmark.value || !landmark.value.lat || !landmark.value.lng) return
  
  try {
    const userLat = userLocation.value.lat
    const userLng = userLocation.value.lng
    const landmarkLat = parseFloat(landmark.value.lat)
    const landmarkLng = parseFloat(landmark.value.lng)
    
    // Calculate the distance
    const distance = calculateDistance(userLat, userLng, landmarkLat, landmarkLng)
    proximityDistance.value = distance
    console.log("Distance to landmark:", distance, "meters")
    
    // If the distance is less than the threshold, show the popup
    if (distance <= proximityThreshold) {
      showProximityPopup.value = true
    }
  } catch (error) {
    console.error('Error checking proximity:', error)
  }
}

// Start monitoring user location
function startLocationTracking() {
  if (navigator.geolocation && locationPermissionStatus.value === 'granted') {
    console.log('Starting location tracking')
    locationWatcherId.value = navigator.geolocation.watchPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
        // Update map if it exists
        if (map.value) {
          const userPos = new google.maps.LatLng(userLocation.value.lat, userLocation.value.lng)
          map.value.setCenter(userPos)
          
          // Update route with new user location
          if (landmark.value) {
            updateRoute()
          }
        }
        
        // Check if user is near the landmark
        checkProximity()
      },
      (error) => {
        console.error('Error watching position:', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    )
  }
}

// Stop location tracking
function stopLocationTracking() {
  if (locationWatcherId.value !== null) {
    navigator.geolocation.clearWatch(locationWatcherId.value)
    locationWatcherId.value = null
    console.log('Location tracking stopped')
  }
  
  showProximityPopup.value = false
}

// Watch for location permission changes
watch(locationPermissionStatus, (newStatus) => {
  if (newStatus === 'granted') {
    startLocationTracking()
  } else {
    stopLocationTracking()
  }
})

onMounted(async () => {
  try {
    cleanupClickOutside = setupClickOutsideListener()
    
    setLoading(true, 'Loading landmark information')
    
    if (route.query.landmark) {
      try {
        const landmarkData = JSON.parse(decodeURIComponent(route.query.landmark))
        console.log('Received landmark data:', landmarkData)
        
        // 确保经纬度为数值类型
        if (landmarkData.lat && landmarkData.lng) {
          landmarkData.lat = parseFloat(landmarkData.lat);
          landmarkData.lng = parseFloat(landmarkData.lng);
        } else if (typeof landmarkData.lat === 'string' || typeof landmarkData.lng === 'string') {
          // 尝试将字符串转换为数字
          landmarkData.lat = parseFloat(landmarkData.lat);
          landmarkData.lng = parseFloat(landmarkData.lng);
        } else {
          console.error('Invalid or missing lat/lng in landmark data', landmarkData);
          // 设置默认坐标为墨尔本中心
          landmarkData.lat = -37.8136;
          landmarkData.lng = 144.9631;
        }
        
        landmark.value = landmarkData
        console.log('Processed landmark data with coordinates:', landmark.value);
        
        if (landmarkData.name && landmarkData.location) {
          if (!landmarkData.id) {
            landmarkData.id = stringToNumericID(landmarkData.name + landmarkData.location).toString()
            console.log('Generated temporary ID for landmark:', landmarkData.id)
          }
          fetchTranslatedDescription()
        } else {
          console.error('Missing necessary landmark data:', landmarkData)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error parsing landmark data:', error)
        setLoading(false)
      }
    } else {
      console.error('No landmark data in URL')
      setLoading(false)
    }
  
    // Use our enhanced location handling function
    getUserLocation()
  } catch (error) {
    console.error('Error in onMounted:', error)
    setLoading(false)
  }
})

function loadGoogleMapsScript() {
  if (window.google && window.google.maps) {
    console.log('Google Maps API already loaded, initializing map...');
    initMap();
    return;
  }

  setLoading(true, 'Loading map service');

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Google Maps API Key not found in environment variables");
    setLoading(false);
    return;
  }

  console.log(`Loading Google Maps API with language: ${locale.value}`);
  
  // Remove any existing Google Maps scripts to avoid conflicts
  const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
  existingScripts.forEach(script => script.remove());

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&language=${locale.value}`;
  script.async = true;
  script.defer = true;
  
  script.onerror = function() {
    console.error('Failed to load Google Maps API');
    setLoading(false);
  };
  
  window.initGoogleMaps = function() {
    console.log('Google Maps API loaded successfully');
    initMap();
  };
  
  document.head.appendChild(script);
}

onUnmounted(() => {
  // Stop location tracking
  stopLocationTracking()
  
  if (window.initGoogleMaps) {
    delete window.initGoogleMaps
  }
  
  if (audioBlobUrl.value) {
    URL.revokeObjectURL(audioBlobUrl.value)
    audioBlobUrl.value = null
  }
  if (cleanupClickOutside) {
    cleanupClickOutside()
  }
})
</script>

<style scoped>
.loader {
  width: 50px;
  height: 50px;
}

.loader-small {
  width: 30px;
  height: 30px;
}

.circular-loader {
  animation: rotate 2s linear infinite;
}

.loader-path {
  stroke: #4f46e5;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes popupFadeIn {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-popup {
  animation: popupFadeIn 0.5s ease-out;
}
</style> 