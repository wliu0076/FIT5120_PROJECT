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
import { ref, onMounted, onUnmounted } from 'vue'
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

// 获取地标描述翻译
async function fetchTranslatedDescription() {
  if (!landmark.value?.id) {
    console.error('没有可用的地标 ID')
    isDescriptionLoading.value = false
    return
  }

  try {
    setLoading(true, '获取地标描述翻译')
    isDescriptionLoading.value = true
    
    // 检查 ID 是否是 Google Places ID（以 "ChIJ" 开头的字符串）
    // 如果是，我们需要使用数字索引
    let numericId = landmark.value.id
    if (typeof landmark.value.id === 'string' && landmark.value.id.startsWith('ChIJ')) {
      // 提取字符串 ID 的最后部分作为数字 ID
      // 或使用硬编码的映射
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
      address: landmark.value.location || landmark.value.address // 使用 location 并保留对 address 的支持
    }

    // 获取API基础URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    console.log('发送翻译请求:', requestData)

    const response = await fetch(`${apiBaseUrl}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    if (data.translated_description) {
      translatedDescription.value = data.translated_description
    } else if (data.description) {
      // 如果没有翻译但有原始描述，使用原始描述
      translatedDescription.value = data.description
    } else {
      console.warn('No description in response:', data)
      // 回退到地标自己的描述
      translatedDescription.value = landmark.value.description
    }
  } catch (error) {
    console.error('获取翻译时出错:', error)
    // 出错时，使用地标自己的描述
    translatedDescription.value = landmark.value.description
  } finally {
    setLoading(false)
    isDescriptionLoading.value = false
  }
}

function changeTransportMode(mode) {
  setLoading(true, '更新路线信息')
  transportMode.value = mode
  updateRoute()
}

function updateRoute() {
  if (!directionsService.value || !directionsRenderer.value || !landmark.value) {
    setLoading(false)
    return
  }

  setLoading(true, '计算最佳路线')
  
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

  setLoading(true, '加载地图')
  
  map.value = new google.maps.Map(document.getElementById('map'), {
    center: userLocation.value,
    zoom: 12
  })

  directionsService.value = new google.maps.DirectionsService()
  directionsRenderer.value = new google.maps.DirectionsRenderer({ map: map.value })

  if (landmark.value) {
    updateRoute()
  } else {
    setLoading(false)
  }
}

function savePDF() {
  if (!landmark.value) return

  setLoading(true, '生成 PDF 文件')
  
  const contentDiv = document.createElement('div')
  contentDiv.style.width = '600px'
  contentDiv.style.padding = '20px'
  contentDiv.style.background = 'white'
  contentDiv.style.fontFamily = 'Arial'

  contentDiv.innerHTML = `
    <h1>${landmark.value.name}</h1>
    <p><strong>${t('landmarks.directions.location')}:</strong> ${landmark.value.location}</p>
    <img src="${landmark.value.image}" style="width:100%;border-radius:8px;" />
    <p><strong>${t('landmarks.directions.description')}:</strong> ${translatedDescription.value || landmark.value.description}</p>
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
    pdf.save(`${landmark.value.name}-guide.pdf`)
    document.body.removeChild(contentDiv)
    setLoading(false)
  }).catch(error => {
    console.error('PDF 生成错误:', error)
    setLoading(false)
  })
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

onMounted(() => {
  setLoading(true, '加载地标信息')
  
  // 从路由参数获取地标信息
  if (route.query.landmark) {
    try {
      const landmarkData = JSON.parse(decodeURIComponent(route.query.landmark))
      console.log('接收到的地标数据:', landmarkData)
      
      landmark.value = landmarkData
      
      // 确保所有必需的字段都存在
      if (landmarkData.id && landmarkData.name && landmarkData.location) {
        fetchTranslatedDescription()
      } else {
        console.error('缺少必要的地标数据:', landmarkData)
        setLoading(false)
      }
    } catch (error) {
      console.error('解析地标数据时出错:', error)
      setLoading(false)
    }
  } else {
    console.error('URL 中没有地标数据')
    setLoading(false)
  }

  // 初始化地图
  if (window.google && window.google.maps) {
    initMap()
  } else {
    setLoading(true, '加载地图服务')
    
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error("Google Maps API Key not found")
      setLoading(false)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    
    window.initGoogleMaps = function() {
      initMap()
    }
    
    document.head.appendChild(script)
  }

  // 获取用户位置
  if (navigator.geolocation) {
    setLoading(true, '获取您的位置')
    
    navigator.geolocation.getCurrentPosition(pos => {
      userLocation.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }
      if (map.value) {
        updateRoute()
      }
    }, error => {
      console.warn('获取用户位置失败:', error)
      // 继续使用默认位置
      if (map.value) {
        updateRoute()
      }
    })
  }
})

onUnmounted(() => {
  if (window.initGoogleMaps) {
    delete window.initGoogleMaps
  }
  
  // 清理音频资源
  if (audioBlobUrl.value) {
    URL.revokeObjectURL(audioBlobUrl.value)
    audioBlobUrl.value = null
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