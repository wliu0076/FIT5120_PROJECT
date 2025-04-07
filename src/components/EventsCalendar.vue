<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Banner Section -->
    <div class="relative bg-gradient-to-r from-orange-100 to-red-100 py-8">
      <!-- Carousel -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="carousel-container relative">
          <!-- Navigation Arrows -->
          <button @click="previousSlide" class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg">
            <span class="text-2xl">←</span>
          </button>
          <button @click="nextSlide" class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg">
            <span class="text-2xl">→</span>
          </button>

          <!-- Slides -->
          <div class="overflow-hidden relative">
            <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(slide, index) in bannerSlides" :key="index" class="min-w-full">
                <div class="flex items-center justify-between px-8 py-12">
                  <div class="w-1/2">
                    <div class="inline-block bg-black text-white px-4 py-1 rounded-full text-sm mb-4">{{ slide.tag }}</div>
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">{{ slide.title }}</h2>
                    <p class="text-gray-600 mb-6">{{ slide.description }}</p>
                    <button class="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
                      {{ slide.buttonText }}
                    </button>
                  </div>
                  <div class="w-1/2 flex justify-end">
                    <img :src="slide.image" :alt="slide.title" class="w-96 h-auto object-cover rounded-lg shadow-xl">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dots -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button v-for="(_, index) in bannerSlides" 
                    :key="index"
                    @click="currentSlide = index"
                    :class="[
                      'w-2 h-2 rounded-full transition-all duration-300',
                      currentSlide === index ? 'bg-black w-4' : 'bg-gray-400'
                    ]">
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Navigation -->
    <div class="bg-white py-8 border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-3 md:grid-cols-6 gap-6">
          <div v-for="category in categories" :key="category.id" 
               @click="filterByCategory(category.id)"
               class="flex flex-col items-center group cursor-pointer hover:opacity-80 transition-opacity">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-gray-200 transition-colors"
                 :class="{ 'bg-green-100': selectedEventType === category.id }">
              <i :class="category.icon" class="text-2xl text-gray-700"></i>
            </div>
            <span class="text-xs text-center leading-tight" :class="{ 'font-bold': selectedEventType === category.id }">
              {{ category.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Section -->
    <div class="py-8 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Month Navigation -->
        <div class="flex flex-wrap items-center justify-center text-sm text-gray-600 py-4 border-b border-t border-gray-200 bg-gray-100">
          <div class="grid grid-cols-12 gap-1 w-full max-w-4xl">
            <div class="col-span-2 flex items-center justify-end pr-4">
              <button @click="previousMonth" class="p-2 text-gray-500 hover:text-gray-700">
                <span class="text-2xl font-bold">←</span>
              </button>
            </div>
            
            <div class="col-span-8">
              <div class="text-center mb-2">
                <span class="text-lg font-semibold text-gray-700">2025</span>
              </div>
              <div class="flex justify-center space-x-2 overflow-x-auto px-4">
                <template v-for="(month, index) in monthsList" :key="index">
                  <button 
                    @click="selectMonth(month.value)" 
                    :class="[
                      'px-4 py-2 rounded-md text-sm whitespace-nowrap', 
                      currentDate.getMonth() === month.value ? 'font-bold text-white bg-green-700' : 'hover:bg-gray-200'
                    ]">
                    {{ month.label }}
                  </button>
                </template>
              </div>
            </div>
            
            <div class="col-span-2 flex items-center justify-start pl-4">
              <button @click="nextMonth" class="p-2 text-gray-500 hover:text-gray-700">
                <span class="text-2xl font-bold">→</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="border border-gray-200 rounded-md overflow-hidden">
          <div class="grid grid-cols-7 gap-0 text-center">
            <!-- 星期头部 -->
            <div class="p-3 text-sm font-medium text-gray-600 bg-gray-100 border-b border-r border-gray-200">{{ $t('events.calendar.sun') }}</div>
            <div class="p-3 text-sm font-medium text-gray-600 bg-gray-100 border-b border-r border-gray-200">{{ $t('events.calendar.mon') }}</div>
            <div class="p-3 text-sm font-medium text-gray-600 bg-gray-100 border-b border-r border-gray-200">{{ $t('events.calendar.tue') }}</div>
            <div class="p-3 text-sm font-medium text-gray-600 bg-gray-100 border-b border-r border-gray-200">{{ $t('events.calendar.wed') }}</div>
            <div class="p-3 text-sm font-medium text-gray-600 bg-gray-100 border-b border-r border-gray-200">{{ $t('events.calendar.thu') }}</div>
            <div class="p-3 text-sm font-medium text-gray-600 bg-gray-100 border-b border-r border-gray-200">{{ $t('events.calendar.fri') }}</div>
            <div class="p-3 text-sm font-medium text-gray-600 bg-gray-100 border-b border-gray-200">{{ $t('events.calendar.sat') }}</div>
            
            <!-- 日历格子 -->
            <template v-for="(date, index) in calendarDays" :key="index">
              <button 
                @click="selectDate(date)" 
                :class="[
                  'min-h-24 py-2 px-3 text-left border-r border-b border-gray-200 relative transition duration-150 hover:bg-gray-50',
                  index % 7 === 6 ? 'border-r-0' : '',
                  (index >= 35) ? 'border-b-0' : '',
                  date.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400',
                  selectedDate && isSameDay(selectedDate, date.date) ? 'bg-green-50 border-green-500' : '',
                  date.isToday ? 'ring-2 ring-inset ring-green-500' : ''
                ]">
                <div class="flex justify-between items-start">
                  <span class="text-sm font-medium">{{ date.day }}</span>
                  <!-- 显示事件数量的徽章 -->
                  <span v-if="date.eventsCount > 0" class="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full" :class="getEventCountColor(date.eventsCount)">
                    {{ date.eventsCount }}
                  </span>
                </div>
                
                <!-- 日期有活动时，显示事件指示点 -->
                <div v-if="date.eventsCount > 0" class="mt-2 space-y-1">
                  <div v-for="(category, i) in date.topCategories" :key="i" class="w-full h-1.5 rounded-full" :class="getCategoryColor(category)"></div>
                </div>
              </button>
            </template>
          </div>
        </div>

        <!-- Filter Results Button -->
        <div class="py-4 border-t border-gray-200">
          <button 
            @click="toggleFilters" 
            class="flex items-center space-x-2 bg-black text-white px-4 py-2 text-sm font-medium">
            <span>{{ $t('events.filters.title') }}</span>
            <span v-if="showFilters">▲</span>
            <span v-else>▼</span>
          </button>
          
          <!-- Filters Panel -->
          <div v-if="showFilters" class="mt-4 p-6 bg-gray-100 border border-gray-200">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
              <!-- Event Type Filter -->
              <div>
                <p class="text-blue-500 text-sm font-bold mb-2">{{ $t('events.filters.eventType') }}</p>
                <div class="relative">
                  <select v-model="selectedEventType" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none">
                    <option value="">{{ $t('events.filters.allEvents') }}</option>
                    <option v-for="type in eventTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Venue Filter -->
              <div>
                <p class="text-blue-500 text-sm font-bold mb-2">{{ $t('events.filters.venue') }}</p>
                <div class="relative">
                  <select v-model="selectedVenue" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none">
                    <option value="">{{ $t('events.filters.allVenues') }}</option>
                    <option v-for="venue in venues" :key="venue.id" :value="venue.id">
                      {{ venue.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Price Filter -->
              <div>
                <p class="text-blue-500 text-sm font-bold mb-2">{{ $t('events.filters.price') }}</p>
                <div class="relative">
                  <select v-model="selectedPrice" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none">
                    <option value="">{{ $t('events.filters.allPrices') }}</option>
                    <option v-for="price in prices" :key="price.id" :value="price.id">
                      {{ price.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Audience Filter -->
              <div>
                <p class="text-blue-500 text-sm font-bold mb-2">{{ $t('events.filters.audience') }}</p>
                <div class="relative">
                  <select v-model="selectedAudience" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none">
                    <option value="">{{ $t('events.filters.allAudience') }}</option>
                    <option v-for="audience in audiences" :key="audience.id" :value="audience.id">
                      {{ audience.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Apply Filters Button -->
            <div class="mt-4 flex justify-end">
              <button @click="applyFilters" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
                {{ $t('events.filters.apply') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Selected Date and Events -->
        <div v-if="selectedDate" class="pt-8 selected-date-events">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ formatDate(selectedDate) }}</h2>
          
          <!-- Time Range Filter -->
          <div class="mb-8 bg-white rounded-lg shadow-sm">
            <div class="flex items-center justify-between p-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Time Range</h3>
              <div class="flex space-x-2">
                <button 
                  v-for="preset in timePresets" 
                  :key="preset.label"
                  @click="applyTimePreset(preset)"
                  :class="[
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                    currentPreset === preset.label 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ preset.label }}
                </button>
              </div>
            </div>

            <div class="p-6">
              <!-- Time Range Inputs -->
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <input 
                      type="text" 
                      :value="timeRange.start"
                      class="w-32 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer bg-white"
                      readonly
                      @click="showTimePresets = !showTimePresets"
                    >
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <i class="mdi mdi-clock-outline text-gray-500"></i>
                    </span>
                  </div>
                  <span class="text-gray-500">to</span>
                  <div class="relative">
                    <input 
                      type="text" 
                      :value="timeRange.end"
                      class="w-32 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer bg-white"
                      readonly
                      @click="showTimePresets = !showTimePresets"
                    >
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <i class="mdi mdi-clock-outline text-gray-500"></i>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Time Slider -->
              <div class="time-slider relative h-16 select-none">
                <!-- Time markers -->
                <div class="absolute inset-x-0 top-0 h-6 flex">
                  <div v-for="hour in 24" :key="hour" 
                       class="flex-1 border-l border-gray-200 relative">
                    <span class="absolute -top-6 left-0 text-xs text-gray-500 transform -translate-x-1/2">
                      {{ hour === 24 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour-12} PM` : `${hour} AM` }}
                    </span>
                  </div>
                </div>
                
                <!-- Timeline bar -->
                <div class="absolute left-0 right-0 bottom-4 h-2 bg-gray-200 rounded-full">
                  <!-- Selected range -->
                  <div class="absolute h-full bg-green-500 rounded-full"
                       :style="{
                         left: (timeToPercentage(to24Hour(timeRange.start))) + '%',
                         right: (100 - timeToPercentage(to24Hour(timeRange.end))) + '%'
                       }">
                  </div>
                  
                  <!-- Slider handles -->
                  <button 
                    class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-green-500 rounded-full shadow-md hover:scale-110 transition-transform"
                    :style="{ left: timeToPercentage(to24Hour(timeRange.start)) + '%' }"
                    @mousedown="handleSliderMouseDown('start', $event)"
                  ></button>
                  <button 
                    class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-green-500 rounded-full shadow-md hover:scale-110 transition-transform"
                    :style="{ left: timeToPercentage(to24Hour(timeRange.end)) + '%' }"
                    @mousedown="handleSliderMouseDown('end', $event)"
                  ></button>
                </div>

                <!-- Event markers -->
                <div class="absolute left-0 right-0 bottom-0 h-3">
                  <div v-for="event in filteredEvents" 
                       :key="event.id"
                       class="absolute w-1 h-full bg-green-600 transform -translate-x-1/2"
                       :style="{
                         left: timeToPercentage(new Date(event.datetime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })) + '%'
                       }"
                       :title="event.name">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Events Count Summary -->
          <p class="text-gray-600 mb-6">
            {{ filteredEvents.length }} {{ $t('events.eventsFound') }}
            <span v-if="selectedEventType || timeRange.start !== '00:00' || timeRange.end !== '23:59'" class="inline-block ml-2">
              <button @click="clearFilters" class="text-blue-500 underline text-sm">{{ $t('events.clearFilters') }}</button>
            </span>
          </p>
          
          <!-- No Events Message -->
          <div v-if="filteredEvents.length === 0" class="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
            <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">{{ $t('events.noEvents') }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ $t('events.tryOtherDate') }}</p>
          </div>
          
          <div v-else>
            <!-- Events Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="event in paginatedEvents" :key="event.id" 
                   class="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
                <!-- Event Image -->
                <div class="relative h-48 overflow-hidden rounded-t-lg">
                  <img :src="event.image || '/placeholder-event.jpg'" 
                       :alt="event.name"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                  <!-- Category Badge -->
                  <div class="absolute top-3 right-3">
                    <span :class="[
                      getCategoryTagColor(event.category),
                      'px-3 py-1 text-xs font-semibold rounded-full shadow-sm'
                    ]">
                      {{ event.category }}
                    </span>
                  </div>
                </div>
                
                <!-- Event Details -->
                <div class="p-5 flex flex-col h-[calc(100%-12rem)]">
                  <!-- Time and Location -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2 text-gray-600">
                      <i class="mdi mdi-clock-outline text-lg"></i>
                      <span class="text-sm">
                        {{ new Date(event.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                      </span>
                    </div>
                    <div class="flex items-center space-x-2 text-gray-600">
                      <i class="mdi mdi-map-marker text-lg"></i>
                      <span class="text-sm truncate max-w-[120px]">{{ event.location }}</span>
                    </div>
                  </div>
                  
                  <!-- Title -->
                  <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {{ event.name }}
                  </h3>
                  
                  <!-- Description -->
                  <p class="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                    {{ event.description }}
                  </p>
                  
                  <!-- Action Buttons -->
                  <div class="flex space-x-3 mt-auto pt-4">
                    <button 
                      @click="navigateToEvent(event)"
                      class="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 h-[42px]"
                    >
                      <i class="mdi mdi-navigation text-lg"></i>
                      <span>Navigate</span>
                    </button>
                    <a :href="event.link" 
                       target="_blank" 
                       class="flex-1">
                      <button class="w-full border-2 border-gray-900 text-gray-900 px-4 py-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center space-x-2 h-[42px]">
                        <i class="mdi mdi-information text-lg"></i>
                        <span>Details</span>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination Controls -->
            <div class="mt-8 flex justify-center items-center space-x-4">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                :class="[
                  'px-4 py-2 rounded-md text-sm',
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                Previous
              </button>
              
              <div class="flex space-x-2">
                <button 
                  v-for="page in totalPages" 
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'px-4 py-2 rounded-md text-sm',
                    currentPage === page ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                :class="[
                  'px-4 py-2 rounded-md text-sm',
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getEventCountByMonth, getEventsFromApi } from '../services/eventService'
import { useRouter } from 'vue-router'

// 使用直接的公共路径而不是导入
const logoUrl = '/logo.png'

const { locale, t } = useI18n()
const currentLocale = ref(locale.value)

// UI状态
const showFilters = ref(false)

// Calendar state
const currentDate = ref(new Date('2025-04-01'))
const selectedDate = ref(null)
const monthEvents = ref({}) // 存储每月的事件数据
const currentEvents = ref([]) // 存储当前选中日期的事件

// Filters
const selectedEventType = ref('')
const selectedVenue = ref('')
const selectedPrice = ref('')
const selectedAudience = ref('')

// 时间过滤状态
const timeRange = ref({
  start: '12:00 AM',
  end: '11:59 PM'
})

const timePresets = [
  { label: 'Morning', start: '06:00 AM', end: '12:00 PM' },
  { label: 'Afternoon', start: '12:00 PM', end: '06:00 PM' },
  { label: 'Evening', start: '06:00 PM', end: '11:59 PM' },
  { label: 'All Day', start: '12:00 AM', end: '11:59 PM' }
]

const showTimePresets = ref(false)
const currentPreset = ref('All Day')
const isDragging = ref(false)
const activeHandle = ref(null)

// Mock data
const eventTypes = [
  { id: 'cultural', name: 'Cultural Events' },
  { id: 'religious', name: 'Religious Events' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'social', name: 'Social Groups' },
  { id: 'workshops', name: 'Workshops & Classes' },
  { id: 'markets', name: 'Local Markets' }
]

const venues = [
  { id: 'cbd', name: 'Melbourne CBD' },
  { id: 'north', name: 'North Melbourne' },
  { id: 'south', name: 'South Melbourne' }
]

const prices = [
  { id: 'free', name: 'Free' },
  { id: 'cheap', name: 'Cheap' },
  { id: 'moderate', name: 'Moderate' },
  { id: 'expensive', name: 'Expensive' }
]

const audiences = [
  { id: 'adults', name: 'Adults' },
  { id: 'teens', name: 'Teens' },
  { id: 'children', name: 'Children' },
  { id: 'families', name: 'Families' }
]

// Mock events data - 这将来自API
const events = [
  {
    id: 1,
    title: 'Spring Music Festival 2025',
    date: '2025-04-10',
    time: '14:00 - 22:00',
    location: 'Central Park',
    category: 'Music',
    price: 'Free',
    audience: 'All Ages',
    description: 'Annual spring music festival featuring local bands and international artists',
    image: 'https://placehold.co/400x240?text=Music+Festival',
    tags: ['Live Music', 'Food Stalls', 'Family Friendly']
  },
  {
    id: 2,
    title: 'Cultural Art Exhibition',
    date: '2025-04-10',
    time: '10:00 - 18:00',
    location: 'City Gallery',
    category: 'Art',
    price: '$15',
    audience: 'Adults',
    description: 'Featuring contemporary artworks from local and international artists',
    image: 'https://placehold.co/400x240?text=Art+Exhibition',
    tags: ['Art', 'Culture', 'Exhibition']
  },
  {
    id: 3,
    title: 'Musical Theatre Vocals with Vicky Jacobs',
    date: '2025-04-08',
    time: '10:00 AM - 10:30 AM',
    location: 'The Channel',
    category: 'Workshop',
    price: 'Free',
    audience: 'Adults',
    venue: 'The Channel',
    image: 'https://placehold.co/400x240?text=Music+Workshop'
  }
]

// 月份列表
const monthsList = [
  { label: 'January', value: 0 },
  { label: 'February', value: 1 },
  { label: 'March', value: 2 },
  { label: 'April', value: 3 },
  { label: 'May', value: 4 },
  { label: 'June', value: 5 },
  { label: 'July', value: 6 },
  { label: 'August', value: 7 },
  { label: 'September', value: 8 },
  { label: 'October', value: 9 },
  { label: 'November', value: 10 },
  { label: 'December', value: 11 }
]

// Banner Slides Data
const bannerSlides = [
  {
    tag: 'NEW APP. NEW US.',
    title: 'FIND MORE NEW THINGS TO DO',
    description: 'Discover exciting events and activities happening around you.',
    buttonText: 'Get Into It',
    image: '/banner1.jpg'
  },
  {
    tag: 'FEATURED EVENTS',
    title: 'EXPLORE LOCAL HAPPENINGS',
    description: 'Find the best local events and create unforgettable memories.',
    buttonText: 'Explore Now',
    image: '/banner2.jpg'
  }
]

// Category Navigation Data
const categories = [
  { 
    id: 'cultural', 
    name: 'Cultural Events', 
    icon: 'mdi mdi-theater'
  },
  { 
    id: 'religious', 
    name: 'Religious Events', 
    icon: 'mdi mdi-church'
  },
  { 
    id: 'health', 
    name: 'Health & Wellness', 
    icon: 'mdi mdi-heart-pulse'
  },
  { 
    id: 'social', 
    name: 'Social Groups', 
    icon: 'mdi mdi-account-group'
  },
  { 
    id: 'workshops', 
    name: 'Workshops & Classes', 
    icon: 'mdi mdi-school'
  },
  { 
    id: 'markets', 
    name: 'Local Markets', 
    icon: 'mdi mdi-store'
  }
]

// Carousel State
const currentSlide = ref(0)

// 分页状态
const currentPage = ref(1)
const eventsPerPage = 9

// Router for navigation
const router = useRouter()

// Click outside handler for dropdown
const closeTimePresets = (e) => {
  if (!e.target.closest('.time-presets-dropdown')) {
    showTimePresets.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', closeTimePresets)
})

onUnmounted(() => {
  document.removeEventListener('click', closeTimePresets)
})

// Convert 24h time to 12h format
function formatTime(time) {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

// Convert 12h time to 24h format
function to24Hour(time) {
  const [timeStr, period] = time.split(' ')
  let [hours, minutes] = timeStr.split(':')
  hours = parseInt(hours)
  
  if (period === 'PM' && hours !== 12) {
    hours += 12
  } else if (period === 'AM' && hours === 12) {
    hours = 0
  }
  
  return `${String(hours).padStart(2, '0')}:${minutes}`
}

// Handle slider interaction
function handleSliderMouseDown(handle, e) {
  isDragging.value = true
  activeHandle.value = handle
  document.addEventListener('mousemove', handleSliderMouseMove)
  document.addEventListener('mouseup', handleSliderMouseUp)
}

function handleSliderMouseMove(e) {
  if (!isDragging.value) return
  
  const slider = document.querySelector('.time-slider')
  const rect = slider.getBoundingClientRect()
  let percentage = ((e.clientX - rect.left) / rect.width) * 100
  
  // Constrain percentage between 0 and 100
  percentage = Math.max(0, Math.min(100, percentage))
  
  // Convert percentage to time
  const minutes = Math.round((percentage / 100) * 24 * 60)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const time = formatTime(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`)
  
  if (activeHandle.value === 'start') {
    if (percentage < timeToPercentage(to24Hour(timeRange.value.end))) {
      timeRange.value.start = time
    }
  } else {
    if (percentage > timeToPercentage(to24Hour(timeRange.value.start))) {
      timeRange.value.end = time
    }
  }
  
  currentPreset.value = ''
}

function handleSliderMouseUp() {
  isDragging.value = false
  activeHandle.value = null
  document.removeEventListener('mousemove', handleSliderMouseMove)
  document.removeEventListener('mouseup', handleSliderMouseUp)
}

// Apply time preset
function applyTimePreset(preset) {
  currentPreset.value = preset.label
  timeRange.value = {
    start: preset.start,
    end: preset.end
  }
  showTimePresets.value = false
}

// Convert time to percentage for slider positioning
function timeToPercentage(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return ((hours * 60 + minutes) / (24 * 60)) * 100
}

// Filter events based on time range
const filteredEvents = computed(() => {
  if (!currentEvents.value) return []
  
  return currentEvents.value.filter(event => {
    const eventTime = new Date(event.datetime)
    const eventHour = eventTime.getHours()
    const eventMinute = eventTime.getMinutes()
    
    const [startHour, startMinute] = to24Hour(timeRange.value.start).split(':').map(Number)
    const [endHour, endMinute] = to24Hour(timeRange.value.end).split(':').map(Number)
    
    const eventTimeValue = eventHour * 60 + eventMinute
    const startTimeValue = startHour * 60 + startMinute
    const endTimeValue = endHour * 60 + endMinute
    
    return eventTimeValue >= startTimeValue && eventTimeValue <= endTimeValue
  })
})

// Computed properties
const currentMonth = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []

  // 获取该月的第一天是星期几 (0是星期日, 6是星期六)
  const firstDayWeekday = firstDay.getDay()
  
  // 添加前一个月的日期填充第一周
  for (let i = 0; i < firstDayWeekday; i++) {
    const date = new Date(year, month, -i)
    days.unshift(createDayObject(date))
  }

  // 添加当前月的日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push(createDayObject(date))
  }

  // 如果需要，添加下个月的日期填充最后一周
  const totalDaysNeeded = 42 // 6 rows x 7 days
  const remainingDays = totalDaysNeeded - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push(createDayObject(date))
  }

  return days
})

// 获取指定日期的事件
const getEventsForDate = async (date) => {
  if (!date) return [];
  const dateString = date.toISOString().split('T')[0];
  try {
    const events = await getEventsFromApi(dateString);
    console.log("getEventsFromApi returned:", events); // 输出返回的数据
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// 获取当前月份的事件数量
const fetchMonthEventCounts = async () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth() + 1;
  try {
    const counts = await getEventCountByMonth(year, month);
    monthEvents.value = counts.reduce((acc, item) => {
      acc[item.date] = item.count;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching month events:', error);
    monthEvents.value = {};
  }
};

// 监听月份变化
watch(() => currentDate.value, async () => {
  await fetchMonthEventCounts();
}, { immediate: true });

// 创建日期对象的辅助函数
function createDayObject(date) {
  const dateString = date.toISOString().split('T')[0];
  const eventsCount = monthEvents.value[dateString] || 0;
  
  return {
    day: date.getDate(),
    date: date,
    isCurrentMonth: date.getMonth() === currentDate.value.getMonth(),
    hasEvents: eventsCount > 0,
    eventsCount: eventsCount,
    topCategories: [], // 暂时不显示类别条
    isToday: isSameDay(date, new Date())
  }
}

// 计算分页后的事件
const paginatedEvents = computed(() => {
  const startIndex = (currentPage.value - 1) * eventsPerPage
  const endIndex = startIndex + eventsPerPage
  return filteredEvents.value.slice(startIndex, endIndex)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / eventsPerPage)
})

// Methods
function hasEventsOnDate(date) {
  return events.some(event => {
    const eventDate = new Date(event.date)
    return isSameDay(eventDate, date)
  })
}

function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
}

// 选择日期时获取事件
async function selectDate(dateObj) {
  selectedDate.value = dateObj.date
  showFilters.value = false
  currentPage.value = 1 // 重置页码
  currentEvents.value = await getEventsForDate(dateObj.date)
  
  setTimeout(() => {
    const eventsSection = document.querySelector('.selected-date-events')
    if (eventsSection) {
      eventsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, 100)
}

function selectMonth(monthIndex) {
  currentDate.value = new Date(2025, monthIndex, 1)
}

function previousMonth() {
  const newDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  if (newDate.getFullYear() === 2025) {
    currentDate.value = newDate
  }
}

function nextMonth() {
  const newDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  if (newDate.getFullYear() === 2025) {
    currentDate.value = newDate
  }
}

function formatDate(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
}

function toggleFilters() {
  showFilters.value = !showFilters.value
}

function applyFilters() {
  // Implementation of applyFilters
}

// 清除所有筛选条件
function clearFilters() {
  selectedEventType.value = ''
  selectedVenue.value = ''
  selectedPrice.value = ''
  selectedAudience.value = ''
  timeRange.value = {
    start: '12:00 AM',
    end: '11:59 PM'
  }
}

// 获取类别标签颜色
function getCategoryTagColor(category) {
  const colors = {
    'Music': 'bg-blue-500 text-white',
    'Workshop': 'bg-green-500 text-white',
    'Guided Tour': 'bg-purple-500 text-white',
    'Dance': 'bg-pink-500 text-white',
    'Festival': 'bg-yellow-500 text-black',
    'Film': 'bg-indigo-500 text-white',
    'Wellness': 'bg-teal-500 text-white',
    'Social': 'bg-orange-500 text-white'
  }
  return colors[category] || 'bg-gray-500 text-white'
}

// 获取事件数量的颜色
function getEventCountColor(count) {
  if (count >= 10) {
    return 'bg-red-500 text-white'
  } else if (count >= 5) {
    return 'bg-orange-500 text-white'
  } else {
    return 'bg-blue-500 text-white'
  }
}

// 获取类别的颜色
function getCategoryColor(category) {
  const colors = {
    'Music': 'bg-blue-500',
    'Workshop': 'bg-green-500',
    'Guided Tour': 'bg-purple-500',
    'Dance': 'bg-pink-500',
    'Festival': 'bg-yellow-500',
    'Film': 'bg-indigo-500',
    'Wellness': 'bg-teal-500',
    'Social': 'bg-orange-500'
  }
  return colors[category] || 'bg-gray-500'
}

// Carousel Methods
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % bannerSlides.length
}

function previousSlide() {
  currentSlide.value = currentSlide.value === 0 ? bannerSlides.length - 1 : currentSlide.value - 1
}

// Auto-advance slides
onMounted(() => {
  setInterval(() => {
    nextSlide()
  }, 5000)
})

// Watch for locale changes
watch(currentLocale, (newLocale) => {
  locale.value = newLocale
})

// 分页方法
function goToPage(page) {
  currentPage.value = page
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 快速分类过滤
function filterByCategory(categoryId) {
  selectedEventType.value = categoryId
  applyFilters()
}

// Update the navigation function
function navigateToEvent(event) {
  if (event.location) {
    router.push({
      name: 'navigation',
      query: {
        destination: event.location,
        eventName: event.name,
        eventTime: new Date(event.datetime).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        eventDate: new Date(event.datetime).toLocaleDateString([], {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        address: event.location,
        autoFill: 'true'
      }
    })
  }
}
</script>

<style scoped>
.calendar-day {
  min-height: 6rem;
}

.day-badge {
  background-color: #4CAF50;
  transform: scale(1);
  transition: transform 0.2s ease;
}

.day-badge:hover {
  transform: scale(1.1);
}

.category-indicator {
  width: 75%;
  opacity: 0.7;
}

.calendar-day:hover .category-indicator {
  width: 90%;
  opacity: 1;
}

.selected-date {
  background-color: #f0f9ff !important;
  box-shadow: inset 0 0 0 2px #3b82f6;
}

.date-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.carousel-container {
  overflow: hidden;
  position: relative;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style> 