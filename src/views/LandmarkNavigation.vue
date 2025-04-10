<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <!-- 添加audio元素 -->
    <audio ref="audioRef" controls style="display: none;"></audio>
    
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
        <h2 class="text-3xl font-extrabold text-gray-800">{{ landmark?.name }}</h2>
        <div class="flex gap-3">
          <button @click="playAudio"
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out duration-200 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-105">
            <i :class="isAudioPlaying ? 'mdi mdi-pause' : 'mdi mdi-volume-high'" class="text-2xl"></i>
            <span class="text-lg font-medium">{{ isAudioPlaying ? 'Stop Audio' : $t('landmarks.directions.audioGuide')
              }}</span>
          </button>
          
          <!-- 语言切换器 -->
          <div class="relative">
            <button @click="toggleLanguageDropdown"
              class="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105">
              <i class="mdi mdi-translate text-xl"></i>
              <span class="text-lg font-medium">{{ currentLanguageDisplay }}</span>
              <i class="mdi mdi-chevron-down text-sm"></i>
            </button>
            
            <!-- 语言下拉菜单 -->
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
const userLocation = ref({ lat: -37.818267, lng: 144.952974 })
const transportMode = ref('TRANSIT')
const routeSteps = ref([])
const routeSummary = ref({ duration: '', distance: '', arrival: '' })
const defaultImage = '/imageerror.png'
const audioRef = ref(null)
const popupAudio = '/src/info.mp3'

// 新增音频状态管理
const isAudioPlaying = ref(false)
const audioBlobUrl = ref(null)

// 加载状态管理
const isLoading = ref(true)
const isDescriptionLoading = ref(true)
const loadingMessage = ref('加载地标信息')

// 语言切换器相关状态
const showLanguageDropdown = ref(false)
const availableLanguages = {
  en: { name: 'English', flag: '🇬🇧' },
  zh: { name: '中文', flag: '🇨🇳' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' }
}

// 计算当前显示的语言名称
const currentLanguageDisplay = computed(() => {
  return availableLanguages[locale.value]?.name || 'English'
})

// 切换语言下拉菜单显示状态
function toggleLanguageDropdown() {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

// 切换语言
function changeLanguage(langCode) {
  if (locale.value !== langCode) {
    locale.value = langCode
    
    // 如果已经获取了地标数据，则重新获取对应语言的描述
    if (landmark.value?.id) {
      fetchTranslatedDescription()
    }
    
    // 如果正在播放音频，停止播放并重新请求对应语言的音频
    if (isAudioPlaying.value) {
      audioRef.value.pause()
      isAudioPlaying.value = false
      // 短暂延迟后请求新语言的音频
      setTimeout(() => {
        playAudio()
      }, 300)
    }

    // 如果已计算路线，重新计算以获取新语言的导航指示
    if (routeSteps.value.length > 0) {
      updateRoute()
    }
  }
  
  // 关闭下拉菜单
  showLanguageDropdown.value = false
}

// 语言下拉菜单相关
const languageDropdownOpen = ref(false)
const dropdownRef = ref(null)
const languageBtnRef = ref(null)

// 设置点击外部关闭下拉菜单的函数
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

// 存储清理函数
let cleanupClickOutside = null

// 监听语言变化
watch(locale, (newLocale) => {
  console.log(`Language changed to: ${newLocale}`)
  
  // 当语言变化时，重新加载Google Maps脚本
  if (window.google && window.google.maps) {
    // 移除之前的Google Maps脚本
    const scripts = document.querySelectorAll('script[src*="maps.googleapis.com/maps/api/js"]')
    scripts.forEach(script => script.remove())
    
    // 重置Google Maps全局对象
    window.google = undefined
    
    // 延迟一点时间再重新加载地图
    setTimeout(() => {
      loadGoogleMapsScript()
    }, 300)
  }
})

// 设置加载状态的辅助函数
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
    console.error('No landmark ID available')
    isDescriptionLoading.value = false
    return
  }

  try {
    setLoading(true, 'Getting landmark description translation')
    isDescriptionLoading.value = true
    
    // Check if ID is a Google Places ID (string starting with "ChIJ")
    // If so, we need to use a numeric index
    let numericId = landmark.value.id
    if (typeof landmark.value.id === 'string' && landmark.value.id.startsWith('ChIJ')) {
      // Extract the last part of the string ID as a numeric ID
      // or use hardcoded mapping
      const idMapping = {
        'ChIJt7zSJ8lC1moRIqMuY1-bRIk': 1,
        'ChIJP6r3aZVZ12oRv7HbRFUm5Yg': 2
      }
      
      numericId = idMapping[landmark.value.id] || 
                  parseInt(landmark.value.id.replace(/\D/g, '').slice(0, 4)) || 1
    }

    const requestData = {
      id: numericId,
      name: landmark.value.name,
      address: landmark.value.location || landmark.value.address, // Use location while maintaining support for address
      language: locale.value // 添加当前语言
    }

    // Get API base URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    console.log('Sending translation request:', requestData)
    console.log('API Base URL:', apiBaseUrl)

    const response = await fetch(`${apiBaseUrl}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error(`API response: ${errorText}`)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Translation API response:', data)
    
    if (data.translated_description) {
      translatedDescription.value = data.translated_description
    } else if (data.description) {
      // If no translation but original description exists, use original description
      translatedDescription.value = data.description
    } else {
      console.warn('No description in response:', data)
      // Fall back to landmark's own description
      translatedDescription.value = landmark.value.description
    }
  } catch (error) {
    console.error('Error getting translation:', error)
    // On error, use landmark's own description
    translatedDescription.value = landmark.value.description
  } finally {
    setLoading(false)
    isDescriptionLoading.value = false
  }
}

function changeTransportMode(mode) {
  setLoading(true, 'Updating route information')
  transportMode.value = mode
  updateRoute()
}

function updateRoute() {
  if (!directionsService.value || !directionsRenderer.value || !landmark.value) {
    setLoading(false)
    return
  }

  setLoading(true, 'Calculating best route')
  
  directionsService.value.route({
    origin: userLocation.value,
    destination: { lat: landmark.value.lat, lng: landmark.value.lng },
    travelMode: google.maps.TravelMode[transportMode.value]
  }, (res, status) => {
    setLoading(false)
    
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
    }
  })
}

function calculateArrivalTime(seconds) {
  const arrival = new Date(Date.now() + seconds * 1000)
  return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function initMap() {
  if (!google?.maps) return

  setLoading(true, 'Loading map')
  
  map.value = new google.maps.Map(document.getElementById('map'), {
    center: userLocation.value,
    zoom: 13,
    mapTypeControl: true,
    fullscreenControl: true,
    streetViewControl: true,
    zoomControl: true
  })

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

  // 添加用户当前位置标记
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
  })

  // 为用户位置添加信息窗口
  const infoWindow = new google.maps.InfoWindow({
    content: '<div style="padding:5px;"><strong>Your Location</strong></div>'
  })

  userMarker.addListener('click', () => {
    infoWindow.open(map.value, userMarker)
  })
  
  // 初始时短暂显示用户位置信息窗口
  infoWindow.open(map.value, userMarker)
  setTimeout(() => infoWindow.close(), 3000)

  if (landmark.value) {
    updateRoute()
  } else {
    setLoading(false)
  }
}

function savePDF() {
  if (!landmark.value) return

  setLoading(true, 'Generating PDF file')
  
  // 创建一个新的div来准备PDF内容
  const contentDiv = document.createElement('div')
  contentDiv.style.width = '600px'
  contentDiv.style.padding = '20px'
  contentDiv.style.background = 'white'
  contentDiv.style.fontFamily = 'Arial'

  // 创建一个图像元素并等待它加载
  const img = new Image()
  img.crossOrigin = 'Anonymous' // 处理跨域图片
  img.style.width = '100%'
  img.style.maxWidth = '500px'
  img.style.borderRadius = '8px'
  img.style.marginBottom = '15px'
  img.style.marginTop = '15px'

  // 设置内容
  contentDiv.innerHTML = `
    <h1 style="font-size: 24px; color: #333;">${landmark.value.name}</h1>
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
  
  // 处理图片加载
  img.onload = function() {
    // 图片加载成功后添加到容器中
    if(imageContainer) {
      imageContainer.innerHTML = ''
      imageContainer.appendChild(img)

      // 等待DOM更新后生成PDF
      setTimeout(() => {
        html2canvas(contentDiv, {
          useCORS: true,
          allowTaint: true,
          scale: 2 // 提高PDF质量
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
          
          // 清理
          document.body.removeChild(contentDiv)
          setLoading(false)
        }).catch(error => {
          console.error('Canvas error:', error)
          setLoading(false)
          document.body.removeChild(contentDiv)
        })
      }, 500) // 等待500ms确保DOM更新
    }
  }
  
  // 处理图片加载失败
  img.onerror = function() {
    console.error('Image failed to load')
    // 在图片容器中放置错误提示，使用当前语言
    if(imageContainer) {
      imageContainer.innerHTML = `<div style="text-align:center;padding:20px;color:#666;">${t('landmarks.imageError')}</div>`
    }
    
    // 尽管图片加载失败，仍然尝试生成PDF
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
  
  // 开始加载图片
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

    // Get the Places ID and convert it to a numeric ID
    const googlePlacesId = landmark.value.id;  // The Google Places ID, e.g., "ChIJP6r3aZVZ12oRv7HbRFUm5Yg"
    const numericId = stringToNumericID(googlePlacesId);  // Convert to numeric ID
    console.log('Converted Google Places ID to numeric ID:', numericId);

    // Prepare the request data with the numeric ID
    const requestData = {
      id: numericId.toString(),  // Ensure the ID is a string
      name: landmark.value.name,
      address: landmark.value.location || landmark.value.address,
      language: locale.value,
    };

    // 获取API基础URL
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

onMounted(async () => {
  try {
    // 设置点击外部关闭语言下拉菜单
    cleanupClickOutside = setupClickOutsideListener()
    
    setLoading(true, 'Loading landmark information')
    
    // 从路由参数获取地标信息
    if (route.query.landmark) {
      try {
        const landmarkData = JSON.parse(decodeURIComponent(route.query.landmark))
        console.log('Received landmark data:', landmarkData)
        
        landmark.value = landmarkData
        
        // 确保所有必需的字段都存在
        if (landmarkData.name && landmarkData.location) {
          // 如果没有id，生成一个临时id
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

    // 首先获取用户位置
    getUserLocation()
  } catch (error) {
    console.error('Error in onMounted:', error)
    setLoading(false)
  }
})

// 单独封装获取用户位置的函数，优先调用
function getUserLocation() {
  if (navigator.geolocation) {
    setLoading(true, 'Getting your location')
    
    const options = {
      enableHighAccuracy: true,  // 请求高精度位置
      timeout: 10000,            // 10秒超时
      maximumAge: 0              // 不使用缓存位置
    }
    
    navigator.geolocation.getCurrentPosition(
      // 成功回调
      (position) => {
        console.log('Got user location:', position.coords)
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // 成功获取位置后再初始化地图
        loadGoogleMapsScript()
      },
      // 错误回调
      (error) => {
        console.warn('Failed to get user location:', error.message)
        // 显示错误提示，然后使用默认位置
        alert('Could not access your location. Navigation will use a default starting point.')
        // 位置获取失败后再初始化地图
        loadGoogleMapsScript()
      },
      // 配置选项
      options
    )
  } else {
    console.error('Geolocation is not supported by this browser')
    // 如果浏览器不支持地理定位，直接加载地图
    loadGoogleMapsScript()
  }
}

// 加载Google Maps脚本
function loadGoogleMapsScript() {
  if (window.google && window.google.maps) {
    initMap()
  } else {
    setLoading(true, 'Loading map service')
    
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error("Google Maps API Key not found")
      setLoading(false)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&language=${locale.value}`
    script.async = true
    script.defer = true
    
    window.initGoogleMaps = function() {
      initMap()
    }
    
    document.head.appendChild(script)
  }
}

onUnmounted(() => {
  if (window.initGoogleMaps) {
    delete window.initGoogleMaps
  }
  
  // 清理音频资源
  if (audioBlobUrl.value) {
    URL.revokeObjectURL(audioBlobUrl.value)
    audioBlobUrl.value = null
  }
  
  // 清理点击外部监听器
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
</style> 