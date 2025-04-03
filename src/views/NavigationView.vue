<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Banner Section -->
    <div class="relative bg-gray-800 text-white py-12">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold">{{ event.title }}</h1>
        <p class="mt-2 text-gray-300">{{ event.location }} • {{ event.date }} • {{ event.time }}</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：地图和路线信息 -->
        <div class="space-y-6">
          <!-- 地图区域 -->
          <div class="bg-white rounded-lg shadow-sm h-96 overflow-hidden">
            <div id="map" class="w-full h-full"></div>
          </div>

          <!-- 交通方式选择 -->
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="font-semibold mb-3">Transportation Mode</h3>
            <div class="flex space-x-4">
              <button 
                @click="changeTransportMode('TRANSIT')"
                :class="[
                  'flex-1 py-2 px-4 rounded-full transition-colors',
                  transportMode === 'TRANSIT' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]">
                <span>Public Transport</span>
              </button>
              <button 
                @click="changeTransportMode('WALKING')"
                :class="[
                  'flex-1 py-2 px-4 rounded-full transition-colors',
                  transportMode === 'WALKING' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]">
                <span>Walking</span>
              </button>
              <button 
                @click="changeTransportMode('DRIVING')"
                :class="[
                  'flex-1 py-2 px-4 rounded-full transition-colors',
                  transportMode === 'DRIVING' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]">
                <span>Driving</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：步骤导航 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Step-by-Step Instructions</h2>
            <button @click="savePDF" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <span>Save as PDF</span>
            </button>
          </div>

          <!-- 路线概览 -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Estimated Time</p>
                <p class="font-semibold">{{ routeSummary.duration || '-- mins' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Distance</p>
                <p class="font-semibold">{{ routeSummary.distance || '-- km' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Arrival</p>
                <p class="font-semibold">{{ routeSummary.arrival || '--:--' }}</p>
              </div>
            </div>
          </div>

          <!-- 步骤列表 -->
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import html2canvas from 'html2canvas/dist/html2canvas.esm.js'
import { jsPDF } from 'jspdf'

// 事件数据
const event = ref({
  title: 'Melbourne Arts Festival 2025',
  location: 'Federation Square, Melbourne',
  date: 'April 10, 2025',
  time: '14:00 - 22:00',
  coordinates: { lat: -37.818085, lng: 144.968124 } // Federation Square coordinates
})

// 地图相关状态
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

// 用户位置（模拟数据，使用墨尔本中央车站作为起点）
const userLocation = ref({
  lat: -37.818267, 
  lng: 144.952974  // Southern Cross Station coordinates
})

// 获取用户位置
async function getUserLocation() {
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      
      // 重新计算路线
      if (map.value) {
        calculateRoute()
      }
    } catch (error) {
      console.error('Error getting user location:', error)
      // 保持默认位置
    }
  }
}

// 更改交通方式
async function changeTransportMode(mode) {
  transportMode.value = mode
  await calculateRoute()
}

// 计算路线
async function calculateRoute() {
  if (!directionsService.value || !directionsRenderer.value) return

  const request = {
    origin: userLocation.value,
    destination: event.value.coordinates,
    travelMode: google.maps.TravelMode[transportMode.value]
  }

  try {
    const result = await directionsService.value.route(request)
    directionsRenderer.value.setDirections(result)

    // 更新路线信息
    const route = result.routes[0].legs[0]
    routeSummary.value = {
      duration: route.duration.text,
      distance: route.distance.text,
      arrival: calculateArrivalTime(route.duration.value)
    }

    // 更新步骤说明
    routeSteps.value = route.steps.map(step => ({
      instructions: step.instructions,
      distance: step.distance.text,
      duration: step.duration.text
    }))
  } catch (error) {
    console.error('Direction request failed:', error)
  }
}

// 计算预计到达时间
function calculateArrivalTime(durationInSeconds) {
  const now = new Date()
  const arrivalTime = new Date(now.getTime() + durationInSeconds * 1000)
  return arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 保存为PDF
async function savePDF() {
  try {
    // 创建一个新的div来包含要导出的内容
    const contentDiv = document.createElement('div')
    contentDiv.style.padding = '20px'
    contentDiv.style.background = 'white'
    
    // 添加标题和事件信息
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
    
    // 添加步骤说明
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
    
    // 临时将div添加到文档中
    document.body.appendChild(contentDiv)
    
    // 创建PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const canvas = await html2canvas(contentDiv, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    
    // 移除临时div
    document.body.removeChild(contentDiv)
    
    // 添加图片到PDF
    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    
    // 保存PDF
    pdf.save(`${event.value.title} - Navigation Guide.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  }
}

// 初始化地图
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

  // 获取用户位置并计算路线
  getUserLocation()
}

// 生命周期钩子
onMounted(() => {
  // 加载 Google Maps API
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`
  script.async = true
  script.defer = true
  window.initMap = initMap
  document.head.appendChild(script)
})

onUnmounted(() => {
  // 清理 Google Maps API
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
</style> 