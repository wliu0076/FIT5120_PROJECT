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
        <div class="grid grid-cols-4 md:grid-cols-8 gap-6">
          <div v-for="category in categories" :key="category.id" 
               class="flex flex-col items-center group cursor-pointer hover:opacity-80 transition-opacity">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-gray-200 transition-colors">
              <i :class="category.icon" class="text-2xl text-gray-700"></i>
            </div>
            <span class="text-xs text-center leading-tight">{{ category.name }}</span>
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
          
          <!-- Events Count Summary -->
          <p class="text-gray-600 mb-6">
            {{ filteredEvents.length }} {{ $t('events.eventsFound') }}
            <span v-if="selectedEventType || selectedVenue || selectedPrice || selectedAudience" class="inline-block ml-2">
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
          
          <!-- Events Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="event in filteredEvents" :key="event.id" 
                 class="group relative border border-gray-200 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <!-- Event Image -->
              <div class="h-48 overflow-hidden">
                <img :src="event.image || 'https://placehold.co/400x240'" alt="Event" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              </div>
              
              <!-- Category Badge -->
              <div class="absolute top-2 right-2">
                <span :class="[getCategoryTagColor(event.category), 'px-2 py-1 text-xs font-bold rounded-full']">
                  {{ event.category }}
                </span>
              </div>
              
              <!-- Event Details -->
              <div class="p-4">
                <div class="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ formatTime(event.time) }}</span>
                </div>
                <h3 class="text-lg font-bold leading-tight mb-1 group-hover:text-blue-600 transition-colors duration-300">{{ event.title }}</h3>
                <div class="flex items-center space-x-1 text-xs text-gray-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ event.location }}</span>
                </div>
                
                <!-- Event Tags -->
                <div class="flex flex-wrap gap-1 mb-4">
                  <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{{ event.price }}</span>
                  <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{{ event.audience }}</span>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex space-x-2">
                  <router-link :to="`/navigation/${event.id}`" class="flex-1">
                    <button class="w-full bg-black text-white text-xs px-3 py-2 rounded hover:bg-gray-800 transition-colors">Navigate</button>
                  </router-link>
                  <button class="flex-1 border border-gray-300 text-gray-700 text-xs px-3 py-2 rounded hover:bg-gray-50 transition-colors">More Info</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// 使用直接的公共路径而不是导入
const logoUrl = '/logo.png'

const { locale, t } = useI18n()
const currentLocale = ref(locale.value)

// UI状态
const showFilters = ref(false)

// Calendar state
const currentDate = ref(new Date('2025-04-01'))
const selectedDate = ref(null)

// Filters
const selectedEventType = ref('')
const selectedVenue = ref('')
const selectedPrice = ref('')
const selectedAudience = ref('')

// Mock data
const eventTypes = [
  { id: 'music', name: 'Music' },
  { id: 'market', name: 'Market' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'social', name: 'Social' }
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
    id: 'concerts', 
    name: 'Concerts & Gig Guide', 
    icon: 'mdi mdi-guitar-electric'
  },
  { 
    id: 'performing-arts', 
    name: 'Performing Arts', 
    icon: 'mdi mdi-theater'
  },
  { 
    id: 'sports', 
    name: 'Sports & Outdoors', 
    icon: 'mdi mdi-basketball'
  },
  { 
    id: 'festivals', 
    name: 'Festivals & Lifestyle', 
    icon: 'mdi mdi-party-popper'
  },
  { 
    id: 'music-festivals', 
    name: 'Music Festivals', 
    icon: 'mdi mdi-music-circle'
  },
  { 
    id: 'exhibitions', 
    name: 'Exhibitions', 
    icon: 'mdi mdi-image-multiple'
  },
  { 
    id: 'workshops', 
    name: 'Workshops, Conferences & Classes', 
    icon: 'mdi mdi-school'
  },
  { 
    id: 'quiz-karaoke', 
    name: 'Quiz, Karaoke', 
    icon: 'mdi mdi-microphone-variant'
  }
]

// Carousel State
const currentSlide = ref(0)

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

const getEventsForDate = (date) => {
  if (!date) return [];
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return isSameDay(eventDate, date);
  });
};

const filteredEvents = computed(() => {
  if (!selectedDate.value) return [];
  const dateEvents = getEventsForDate(selectedDate.value);
  
  // 应用其他过滤条件
  let filtered = dateEvents;
  
  if (selectedEventType.value) {
    filtered = filtered.filter(event => event.category.toLowerCase() === selectedEventType.value.toLowerCase());
  }
  
  if (selectedVenue.value) {
    filtered = filtered.filter(event => event.location.toLowerCase().includes(selectedVenue.value.toLowerCase()));
  }
  
  if (selectedPrice.value) {
    filtered = filtered.filter(event => event.price.toLowerCase().includes(selectedPrice.value.toLowerCase()));
  }
  
  if (selectedAudience.value) {
    filtered = filtered.filter(event => event.audience.toLowerCase().includes(selectedAudience.value.toLowerCase()));
  }
  
  return filtered;
});

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

function selectDate(dateObj) {
  selectedDate.value = dateObj.date;
  showFilters.value = false; // 选择日期时自动隐藏过滤器
  
  // 添加延迟以确保DOM更新后再滚动
  setTimeout(() => {
    const eventsSection = document.querySelector('.selected-date-events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 100);
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

function formatTime(timeString) {
  return timeString
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

// 创建日期对象的辅助函数
function createDayObject(date) {
  const dateEvents = getEventsForDate(date)
  const categories = dateEvents.map(event => event.category)
  // 获取前3个不同类别的活动，用于显示颜色条
  const uniqueCategories = [...new Set(categories)]
  const topCategories = uniqueCategories.slice(0, 3)
  
  // 计算事件数量，如果没有实际事件且是当前月份，则生成随机数量 (1-30%)的机会生成1-5个事件)
  let eventsCount = dateEvents.length
  if (eventsCount === 0 && date.getMonth() === currentDate.value.getMonth() && Math.random() < 0.3) {
    // 只在约30%的日子里随机生成事件
    eventsCount = Math.floor(Math.random() * 5) + 1
  }
  
  return {
    day: date.getDate(),
    date: date,
    isCurrentMonth: date.getMonth() === currentDate.value.getMonth(),
    hasEvents: eventsCount > 0,
    eventsCount: eventsCount,
    topCategories: topCategories,
    isToday: isSameDay(date, new Date())
  }
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