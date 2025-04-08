<template>
  <div class="events-view">
    <!-- 轮播部分 -->
    <div class="relative bg-gradient-to-r from-orange-100 to-red-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="carousel-container relative">
          <!-- 导航箭头 -->
          <button @click="previousSlide" 
                  class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white">
            <span class="text-xl">←X</span>
          </button>
          <button @click="nextSlide" 
                  class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white">
            <span class="text-xl">X→</span>
          </button>

          <!-- 轮播内容 -->
          <div class="overflow-hidden relative">
            <div class="flex transition-transform duration-500 ease-in-out" 
                :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(event, index) in events" 
                  :key="index" 
                  class="min-w-full">
                <div class="flex items-start space-x-6 px-8 py-6">
                  <!-- 左侧图片 -->
                  <div class="w-1/3">
                    <img :src="event.image" 
                         :alt="event.title" 
                         class="w-full h-64 object-cover rounded-lg shadow-lg">
                  </div>
                  <!-- 右侧内容 -->
                  <div class="w-2/3 flex flex-col">
                    <div class="mb-2">
                      <span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {{ event.category }}
                      </span>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ event.title }}</h2>
                    <div class="flex items-center text-gray-600 text-sm mb-4">
                      <span class="flex items-center">
                        <i class="fas fa-clock mr-2"></i>
                        {{ event.time || '09:00 AM' }}
                      </span>
                      <span class="mx-4">|</span>
                      <span class="flex items-center">
                        <i class="fas fa-map-marker-alt mr-2"></i>
                        {{ event.location || 'Corner of King St' }}
                      </span>
                    </div>
                    <p class="text-gray-600 mb-6">{{ event.description }}</p>
                    <div class="flex space-x-4 mt-auto">
                      <button class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <i class="fas fa-location-arrow mr-2"></i>
                        Navigate
                      </button>
                      <button class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 轮播指示点 -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button v-for="(_, index) in events" 
                    :key="index"
                    @click="currentSlide = index"
                    :class="[
                      'w-2 h-2 rounded-full transition-all duration-300',
                      currentSlide === index ? 'bg-blue-600 w-4' : 'bg-gray-400'
                    ]">
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <EventFilters @filter="handleFilter" />
        </div>
        
        <div class="lg:col-span-2">
          <Calendar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Calendar from '@/components/Calendar.vue'
import EventFilters from '@/components/EventFilters.vue'

// 所有事件数据
const allEvents = [
  {
    id: 1,
    title: "Turtle Rescue Adventure",
    description: "SEA LIFE Melbourne Aquarium is continuing to celebrate 25 years of unforgettable marine experiences.",
    category: "Lifestyle",
    image: "/events/hero-image.jpg",
    date: "2024-04-08",
    time: "09:00 AM",
    location: "Corner of King Street"
  },
  {
    id: 2,
    title: "墨尔本中国新年庆典",
    description: "在墨尔本联邦广场体验最盛大的中国新年庆典活动",
    category: "文化活动",
    image: "/events/Chinatown'sChineseNewYearFestival.jpg",
    date: "2024-04-08",
    time: "10:00 AM",
    location: "Federation Square"
  },
  {
    id: 3,
    title: "澳式美食节",
    description: "品尝最地道的澳大利亚美食",
    category: "美食活动",
    image: "/events/food-festival.jpg",
    date: "2024-04-08",
    time: "11:30 AM",
    location: "Queen Victoria Market"
  },
  {
    id: 4,
    title: "爵士之夜",
    description: "探索墨尔本最具创意的音乐现场",
    category: "音乐活动",
    image: "/events/jazz-night.jpg",
    date: "2024-04-09",
    time: "07:00 PM",
    location: "Bird's Basement"
  },
  {
    id: 5,
    title: "艺术展览",
    description: "体验现代艺术的魅力",
    category: "艺术展览",
    image: "/events/art-exhibition.jpg",
    date: "2024-04-08",
    time: "10:00 AM",
    location: "NGV International"
  },
  {
    id: 6,
    title: "瑜伽工作坊",
    description: "放松身心的瑜伽课程",
    category: "健康活动",
    image: "/events/yoga.jpg",
    date: "2024-04-08"
  },
  {
    id: 7,
    title: "传统手工艺工作坊",
    description: "学习传统手工艺制作",
    category: "工作坊",
    image: "/events/art-exhibition.jpg",
    date: "2024-04-08"
  }
]

// 获取当前日期
const getCurrentDate = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

// 从数组中随机选择n个元素
const getRandomItems = (arr: any[], n: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, n)
}

// 获取当日事件或随机事件
const events = computed(() => {
  const todayEvents = allEvents.filter(event => event.date === getCurrentDate())
  
  // 如果当日事件大于等于5个，随机选择5个当日事件
  if (todayEvents.length >= 5) {
    return getRandomItems(todayEvents, 5)
  }
  
  // 如果当日事件不足5个，随机补充其他日期的事件
  const otherEvents = allEvents.filter(event => event.date !== getCurrentDate())
  const additionalEvents = getRandomItems(otherEvents, 5 - todayEvents.length)
  
  return [...todayEvents, ...additionalEvents]
})

const currentSlide = ref(0)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % events.value.length
}

const previousSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + events.value.length) % events.value.length
}

// 处理筛选
const handleFilter = (filters: any) => {
  console.log('Applied filters:', filters)
}

// 自动轮播
let autoplayInterval: any = null

onMounted(() => {
  autoplayInterval = setInterval(() => {
    nextSlide()
  }, 5000)
})

onUnmounted(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
})
</script>

<style scoped>
.events-view {
  min-height: calc(100vh - 4rem);
}

.carousel-container {
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 1.5rem 0;
}

.min-w-full {
  width: 100%;
  min-width: 100%;
}

/* 轮播过渡效果 */
.transition-transform {
  transition: transform 0.5s ease-in-out;
}
</style> 