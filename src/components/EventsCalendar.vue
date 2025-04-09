<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Navigation section removed to prevent duplication -->
    
    <!-- Banner Section -->
    <div class="relative bg-gradient-to-r from-yellow-50 via-red-50 to-pink-50 py-12">
      <!-- Title Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-8">
        <h1 class="text-4xl font-extrabold text-center text-gray-900">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 inline-block transform -rotate-1">
            {{ $t('events.featured.title') || 'Featured Events' }}
          </span>
        </h1>
        <p class="mt-3 max-w-2xl mx-auto text-center text-lg text-gray-600">
          {{ $t('events.featured.subtitle') || 'Explore the diverse cultural activities and exciting experiences in Melbourne' }}
        </p>
      </div>
      
      <!-- Carousel -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="carousel-container relative rounded-2xl overflow-hidden shadow-2xl"
             @mouseenter="stopAutoplay" 
             @mouseleave="startAutoplay">
          <!-- Navigation Arrows -->
          <button @click="previousSlide" class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white hover:scale-110 rounded-full p-3 shadow-lg transition-all duration-300">
            <span class="text-2xl text-gray-800">←</span>
          </button>
          <button @click="nextSlide" class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white hover:scale-110 rounded-full p-3 shadow-lg transition-all duration-300">
            <span class="text-2xl text-gray-800">→</span>
          </button>

          <!-- Slides -->
          <div class="overflow-hidden relative">
            <div class="flex transition-transform duration-700 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(event, index) in featuredEvents" :key="index" class="min-w-full relative">
                <!-- Background decoration -->
                <div class="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent z-0"></div>
                <div class="flex items-center px-8 py-16 relative z-10">
                  <div class="w-1/2 pr-8 text-white">
                    <div class="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 transform -rotate-1 shadow-lg">
                      {{ event.category }}
                    </div>
                    <h2 class="text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
                      {{ event.name }}
                    </h2>
                    <p class="text-lg text-white/90 mb-8 max-w-lg">
                      {{ event.description }}
                    </p>
                    <button @click="navigateToEvent(event)" class="group bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors duration-300 font-semibold shadow-lg flex items-center space-x-2 transform hover:-translate-y-1 hover:shadow-xl">
                      <span>{{ $t('events.actions.getTravelGuide') || 'Get Travel Guide' }}</span>
                      <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                  </div>
                  <div class="w-1/2 flex justify-end">
                    <div class="relative">
                      <!-- Main Image -->
                      <img :src="event.image || '/placeholder-event.jpg'" :alt="event.name" class="w-[28rem] h-[20rem] object-cover rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                      <!-- Decorative elements -->
                      <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full opacity-70 mix-blend-multiply animate-pulse"></div>
                      <div class="absolute -top-4 -right-4 w-16 h-16 bg-red-400 rounded-full opacity-70 mix-blend-multiply animate-pulse" style="animation-delay: 1s"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dots -->
          <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            <button v-for="(_, index) in featuredEvents" 
                    :key="index"
                    @click="currentSlide = index"
                    :class="[
                      'w-3 h-3 rounded-full transition-all duration-300 shadow',
                      currentSlide === index 
                        ? 'bg-white w-10' 
                        : 'bg-white/50 hover:bg-white/80'
                    ]">
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Event Count Legend -->
        <div class="mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Event Count Legend</h3>
          <div class="flex flex-col space-y-4">
            <!-- 事件数量指示器 -->
            <div class="flex items-center space-x-6">
              <div class="flex items-center space-x-2">
                <div class="event-count-badge flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                  <span class="text-xs font-bold leading-none">1</span>
                </div>
                <span class="text-sm text-gray-700">Few events (1-4)</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="event-count-badge flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
                  <span class="text-xs font-bold leading-none">5</span>
                </div>
                <span class="text-sm text-gray-700">Moderate events (5-9)</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="event-count-badge flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                  <span class="text-xs font-bold leading-none">10+</span>
                </div>
                <span class="text-sm text-gray-700">Many events (10+)</span>
              </div>
            </div>
            
            <!-- 彩色线条指示器说明 -->
            <div class="pt-2 border-t border-gray-100">
              <h4 class="text-sm font-medium text-gray-800 mb-2">Event Categories</h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="flex items-center space-x-2">
                  <div class="w-12 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Gig Guide</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-12 h-2 bg-purple-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Exhibitions</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-12 h-2 bg-yellow-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Lifestyle</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-12 h-2 bg-pink-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Arts</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-12 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Outdoors</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-12 h-2 bg-orange-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Classes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Month Navigation -->
        <div class="relative overflow-hidden bg-white rounded-2xl shadow-lg mb-10 border border-gray-100">
          <!-- Glass morphism background with subtle texture -->
          <div class="absolute inset-0 bg-gradient-to-br from-orange-50/70 via-white/90 to-red-50/70 backdrop-blur-sm"></div>
          
          <!-- Decorative elements -->
          <div class="absolute top-0 left-0 w-24 h-24 bg-orange-400 rounded-full opacity-5 -translate-x-12 -translate-y-12"></div>
          <div class="absolute bottom-0 right-0 w-32 h-32 bg-red-400 rounded-full opacity-5 translate-x-16 translate-y-16"></div>
          
          <!-- Content -->
          <div class="relative flex flex-col items-center justify-center py-8 px-4">
            <!-- Current year with subtle highlighting -->
            <div class="relative inline-block mb-6">
              <span class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-700">
                {{ currentDate.getFullYear() }}
              </span>
              <div class="absolute -bottom-2.5 h-2 w-full bg-orange-500/20 rounded-full transform -rotate-1"></div>
            </div>
            
            <!-- Navigation wrapper -->
            <div class="w-full flex items-center justify-center max-w-5xl mx-auto px-4">
              <!-- Previous button with improved animation -->
              <button 
                @click="previousMonth" 
                class="flex items-center justify-center w-12 h-12 mr-4 relative group"
                aria-label="Previous month"
              >
                <div class="absolute inset-0 rounded-full opacity-0 bg-orange-100 transform scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
                <span class="relative text-xl text-gray-700 group-hover:text-orange-600 transition-colors duration-200 group-active:translate-x-0.5">
                  <i class="mdi mdi-chevron-left"></i>
                </span>
              </button>
              
              <!-- Month selection with smooth scrolling -->
              <div class="flex-1 relative">
                <div class="overflow-x-auto hide-scrollbar py-2 relative">
                  <div class="inline-flex items-center justify-center space-x-1 sm:space-x-2 min-w-full px-2">
                    <template v-for="(month, index) in monthsList" :key="index">
                      <button 
                        @click="selectMonth(month.value)" 
                        :class="[
                          'px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 relative',
                          currentDate.getMonth() === month.value 
                            ? 'text-white shadow-md z-20' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-orange-50/80'
                        ]"
                      >
                        <!-- Active state with gradient background -->
                        <div 
                          v-if="currentDate.getMonth() === month.value"
                          class="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl z-10 animate-pulse-subtle"
                        ></div>
                        
                        <!-- Light reflection effect on active button -->
                        <div 
                          v-if="currentDate.getMonth() === month.value"
                          class="absolute inset-0 rounded-xl overflow-hidden z-15"
                        >
                          <div class="absolute top-0 left-0 right-0 h-px bg-white/40"></div>
                          <div class="absolute bottom-0 left-0 right-0 h-px bg-black/10"></div>
                        </div>
                        
                        <!-- Month label -->
                        <span :class="{ 'drop-shadow-sm relative z-30': currentDate.getMonth() === month.value }">
                          {{ month.label }}
                        </span>
                        
                        <!-- Active indicator dot -->
                        <div 
                          v-if="currentDate.getMonth() === month.value"
                          class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full z-20"
                        ></div>
                      </button>
                    </template>
                  </div>
                </div>
                
                <!-- Subtle fade effect on edges -->
                <div class="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-5"></div>
                <div class="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-5"></div>
              </div>
              
              <!-- Next button with improved animation -->
              <button 
                @click="nextMonth" 
                class="flex items-center justify-center w-12 h-12 ml-4 relative group"
                aria-label="Next month"
              >
                <div class="absolute inset-0 rounded-full opacity-0 bg-orange-100 transform scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
                <span class="relative text-xl text-gray-700 group-hover:text-orange-600 transition-colors duration-200 group-active:-translate-x-0.5">
                  <i class="mdi mdi-chevron-right"></i>
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="border border-gray-100 rounded-xl overflow-hidden shadow-lg">
          <div class="grid grid-cols-7 gap-0 text-center">
            <!-- Weekly days header -->
            <div class="p-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-orange-50 to-red-50 border-b border-r border-gray-100">{{ $t('events.calendar.sun') || 'Sun' }}</div>
            <div class="p-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-orange-50 to-red-50 border-b border-r border-gray-100">{{ $t('events.calendar.mon') || 'Mon' }}</div>
            <div class="p-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-orange-50 to-red-50 border-b border-r border-gray-100">{{ $t('events.calendar.tue') || 'Tue' }}</div>
            <div class="p-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-orange-50 to-red-50 border-b border-r border-gray-100">{{ $t('events.calendar.wed') || 'Wed' }}</div>
            <div class="p-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-orange-50 to-red-50 border-b border-r border-gray-100">{{ $t('events.calendar.thu') || 'Thu' }}</div>
            <div class="p-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-orange-50 to-red-50 border-b border-r border-gray-100">{{ $t('events.calendar.fri') || 'Fri' }}</div>
            <div class="p-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">{{ $t('events.calendar.sat') || 'Sat' }}</div>
            
            <!-- Calendar days -->
            <template v-for="(date, index) in calendarDays" :key="index">
              <div 
                @click="selectDate(date)" 
                :class="[
                  'min-h-28 p-3 text-left border-r border-b border-gray-100 relative transition-all duration-300 hover:bg-gray-50 calendar-day cursor-pointer',
                  index % 7 === 6 ? 'border-r-0' : '',
                  (index >= 35) ? 'border-b-0' : '',
                  date.isCurrentMonth ? 'bg-white' : 'bg-gray-50/50',
                  selectedDate && isSameDay(selectedDate, date.date) ? 'bg-orange-50 selected-day' : '',
                  date.isToday ? 'today-highlight' : ''
                ]">
                <div class="flex justify-between items-start mb-2">
                  <div :class="[
                    'flex items-center justify-center rounded-full w-9 h-9 font-medium transition-all duration-300',
                    !date.isCurrentMonth ? 'text-gray-400' : 'text-gray-800',
                    selectedDate && isSameDay(selectedDate, date.date) ? 'bg-orange-500 text-white' : 
                    date.isToday ? 'bg-orange-400 text-white' : 
                    date.hasEvents ? 'day-with-events' : ''
                  ]">
                    <span class="text-lg">{{ date.day }}</span>
                  </div>
                  
                  <!-- Event count badge -->
                  <div v-if="date.eventsCount > 0" 
                       class="event-count-badge flex items-center justify-center w-8 h-8 rounded-md transition-transform hover:scale-110"
                       :class="getEventCountColor(date.eventsCount)">
                    <span class="text-xs font-bold leading-none">{{ date.eventsCount }}</span>
                  </div>
                </div>
                
                <!-- Event indicators -->
                <div v-if="date.eventsCount > 0" class="mt-2 space-y-1.5">
                  <div v-for="(category, i) in date.topCategories.slice(0, 3)" :key="i" 
                       class="category-indicator rounded-full shadow-sm mx-auto" 
                       :class="getCategoryColor(category)">
                  </div>
                  <!-- Placeholder indicators if we don't have real categories -->
                  <template v-if="!date.topCategories || date.topCategories.length === 0">
                    <div v-for="i in Math.min(date.eventsCount, 3)" :key="i"
                         class="category-indicator rounded-full shadow-sm mx-auto"
                         :class="getRandomCategoryColor(i)">
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
        
        <!-- Selected date events -->
        <div v-if="selectedDate" class="pt-10 selected-date-events">
          <div class="mb-8 text-center">
            <span class="inline-block bg-gradient-to-r from-orange-100 to-red-100 px-6 py-2 rounded-full text-center">
              <h2 class="text-3xl font-bold text-gray-900">{{ formatDate(selectedDate) }}</h2>
            </span>
          </div>
          
          <!-- Time Range Filter -->
          <div class="mb-8 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div class="flex flex-wrap items-center justify-between p-5 border-b bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 class="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Time Range</h3>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="preset in timePresets" 
                  :key="preset.label"
                  @click="applyTimePreset(preset)"
                  :class="[
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow',
                    currentPreset === preset.label 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white transform -rotate-1 hover:rotate-0' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:-translate-y-0.5'
                  ]"
                >
                  {{ preset.label }}
                </button>
              </div>
            </div>

            <div class="p-6">
              <!-- Time Range Inputs -->
              <div class="flex flex-wrap items-center justify-center mb-8">
                <div class="flex items-center space-x-4">
                  <div class="time-input-container relative">
                    <input 
                      type="text" 
                      :value="timeRange.start"
                      class="w-32 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 cursor-pointer bg-white hover:border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                      readonly
                      @click="showTimePresets = !showTimePresets"
                    >
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                      <i class="mdi mdi-clock-outline text-lg"></i>
                    </span>
                  </div>
                  <span class="text-gray-500 font-medium">to</span>
                  <div class="time-input-container relative">
                    <input 
                      type="text" 
                      :value="timeRange.end"
                      class="w-32 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 cursor-pointer bg-white hover:border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                      readonly
                      @click="showTimePresets = !showTimePresets"
                    >
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                      <i class="mdi mdi-clock-outline text-lg"></i>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Time Slider -->
              <div class="time-slider relative h-20 select-none mx-auto max-w-4xl">
                <!-- Timeline bar -->
                <div class="absolute left-0 right-0 bottom-6 h-3 bg-gray-200 rounded-full shadow-inner">
                  <!-- Selected range -->
                  <div class="absolute h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow"
                       :style="{
                         left: (timeToPercentage(to24Hour(timeRange.start))) + '%',
                         right: (100 - timeToPercentage(to24Hour(timeRange.end))) + '%'
                       }">
                  </div>
                  
                  <!-- Slider handles -->
                  <button 
                    class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-orange-500 rounded-full shadow-md hover:scale-110 transition-all duration-300 hover:shadow-lg"
                    :style="{ left: timeToPercentage(to24Hour(timeRange.start)) + '%' }"
                    @mousedown="handleSliderMouseDown('start', $event)"
                  ></button>
                  <button 
                    class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-orange-500 rounded-full shadow-md hover:scale-110 transition-all duration-300 hover:shadow-lg"
                    :style="{ left: timeToPercentage(to24Hour(timeRange.end)) + '%' }"
                    @mousedown="handleSliderMouseDown('end', $event)"
                  ></button>
                </div>

                <!-- Event markers -->
                <div class="absolute left-0 right-0 bottom-0 h-5 flex justify-center">
                  <div v-for="hour in 24" :key="hour" class="flex-1 relative">
                    <div class="absolute bottom-6 left-0 w-px h-2 bg-gray-300"></div>
                    <span class="absolute -bottom-5 left-0 text-xs text-gray-500 transform -translate-x-1/2">
                      {{ hour === 24 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour-12} PM` : `${hour} AM` }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Events Count Summary -->
          <div class="mb-8">
            <div class="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl shadow-sm">
              <p class="text-gray-700 font-medium">
                <span class="text-orange-600 font-bold">{{ filteredEvents.length }}</span> events found
              </p>
              <span v-if="selectedEventType || timeRange.start !== '00:00' || timeRange.end !== '23:59'">
                <button @click="clearFilters" class="text-orange-500 font-medium hover:text-orange-700 transition-colors flex items-center">
                  CLEAR FILTERS
                  <i class="mdi mdi-close-circle ml-1"></i>
                </button>
              </span>
            </div>
          </div>

          <!-- Event Categories -->
          <div class="mb-8 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div class="flex flex-wrap items-center justify-between p-5 border-b bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 class="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Event Categories</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-7 gap-4">
                <!-- All Events -->
                <div 
                  @click="selectedEventType = ''; applyFilters()"
                  class="flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-2 
                        shadow-md hover:shadow-lg transition-all duration-300"
                       :class="selectedEventType === '' ? 'bg-orange-100' : 'bg-gray-50 hover:bg-orange-50'">
                    <i class="mdi mdi-view-grid text-2xl" :class="selectedEventType === '' ? 'text-orange-600' : 'text-gray-600'"></i>
                  </div>
                  <span class="text-xs text-center leading-tight font-medium" 
                      :class="{ 'text-orange-600': selectedEventType === '' }">
                    All Events
                  </span>
                </div>
                
                <!-- Gig Guide -->
                <div 
                  @click="selectedEventType = 'gig-guide'; applyFilters()"
                  class="flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-2 
                        shadow-md hover:shadow-lg transition-all duration-300"
                       :class="selectedEventType === 'gig-guide' ? 'bg-orange-100' : 'bg-gray-50 hover:bg-orange-50'">
                    <i class="mdi mdi-music-note text-2xl" :class="selectedEventType === 'gig-guide' ? 'text-orange-600' : 'text-gray-600'"></i>
                  </div>
                  <span class="text-xs text-center leading-tight font-medium" 
                      :class="{ 'text-orange-600': selectedEventType === 'gig-guide' }">
                    Gig Guide
                  </span>
                </div>
                
                <!-- Exhibitions -->
                <div 
                  @click="selectedEventType = 'exhibitions'; applyFilters()"
                  class="flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-2 
                        shadow-md hover:shadow-lg transition-all duration-300"
                       :class="selectedEventType === 'exhibitions' ? 'bg-orange-100' : 'bg-gray-50 hover:bg-orange-50'">
                    <i class="mdi mdi-image-multiple text-2xl" :class="selectedEventType === 'exhibitions' ? 'text-orange-600' : 'text-gray-600'"></i>
                  </div>
                  <span class="text-xs text-center leading-tight font-medium" 
                      :class="{ 'text-orange-600': selectedEventType === 'exhibitions' }">
                    Exhibitions
                  </span>
                </div>
                
                <!-- Lifestyle -->
                <div 
                  @click="selectedEventType = 'lifestyle'; applyFilters()"
                  class="flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-2 
                        shadow-md hover:shadow-lg transition-all duration-300"
                       :class="selectedEventType === 'lifestyle' ? 'bg-orange-100' : 'bg-gray-50 hover:bg-orange-50'">
                    <i class="mdi mdi-party-popper text-2xl" :class="selectedEventType === 'lifestyle' ? 'text-orange-600' : 'text-gray-600'"></i>
                  </div>
                  <span class="text-xs text-center leading-tight font-medium" 
                      :class="{ 'text-orange-600': selectedEventType === 'lifestyle' }">
                    Lifestyle
                  </span>
                </div>
                
                <!-- Arts -->
                <div 
                  @click="selectedEventType = 'arts'; applyFilters()"
                  class="flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-2 
                        shadow-md hover:shadow-lg transition-all duration-300"
                       :class="selectedEventType === 'arts' ? 'bg-orange-100' : 'bg-gray-50 hover:bg-orange-50'">
                    <i class="mdi mdi-theater text-2xl" :class="selectedEventType === 'arts' ? 'text-orange-600' : 'text-gray-600'"></i>
                  </div>
                  <span class="text-xs text-center leading-tight font-medium" 
                      :class="{ 'text-orange-600': selectedEventType === 'arts' }">
                    Arts
                  </span>
                </div>
                
                <!-- Outdoors -->
                <div 
                  @click="selectedEventType = 'outdoors'; applyFilters()"
                  class="flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-2 
                        shadow-md hover:shadow-lg transition-all duration-300"
                       :class="selectedEventType === 'sports' ? 'bg-orange-100' : 'bg-gray-50 hover:bg-orange-50'">
                    <i class="mdi mdi-hiking text-2xl" :class="selectedEventType === 'sports' ? 'text-orange-600' : 'text-gray-600'"></i>
                  </div>
                  <span class="text-xs text-center leading-tight font-medium" 
                      :class="{ 'text-orange-600': selectedEventType === 'sports' }">
                    Sports & Outdoors
                  </span>
                </div>
                
                <!-- Workshops & Classes -->
                <div 
                  @click="selectedEventType = 'workshops-conferences-classes'; applyFilters()"
                  class="flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-2 
                        shadow-md hover:shadow-lg transition-all duration-300"
                       :class="selectedEventType === 'workshops-conferences-classes' ? 'bg-orange-100' : 'bg-gray-50 hover:bg-orange-50'">
                    <i class="mdi mdi-school text-2xl" :class="selectedEventType === 'workshops-conferences-classes' ? 'text-orange-600' : 'text-gray-600'"></i>
                  </div>
                  <span class="text-xs text-center leading-tight font-medium" 
                      :class="{ 'text-orange-600': selectedEventType === 'workshops-conferences-classes' }">
                    Workshops & Classes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Event grid -->
          <div v-if="filteredEvents.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="event in paginatedEvents" :key="event.id" 
                 class="group bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
              <!-- Event Image -->
              <div class="relative h-56 overflow-hidden">
                <img :src="event.image || '/placeholder-event.jpg'" 
                     :alt="event.name"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <!-- Category Badge -->
                <div class="absolute top-4 right-4">
                  <span :class="[
                    getCategoryTagColor(event.category),
                    'px-4 py-1.5 text-xs font-bold rounded-full shadow-md'
                  ]">
                    {{ event.category }}
                  </span>
                </div>
              </div>
              
              <!-- Event Details -->
              <div class="p-6 flex flex-col h-[calc(100%-14rem)]">
                <!-- Time and Location -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-2 text-gray-600">
                    <i class="mdi mdi-clock-outline text-lg text-orange-500"></i>
                    <span class="text-sm font-medium">
                      {{ new Date(event.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2 text-gray-600">
                    <i class="mdi mdi-map-marker text-lg text-orange-500"></i>
                    <span class="text-sm font-medium truncate max-w-[120px]">{{ event.location }}</span>
                  </div>
                </div>
                
                <!-- Title -->
                <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {{ event.name }}
                </h3>
                
                <!-- Description -->
                <p class="text-sm text-gray-600 mb-6 line-clamp-3 flex-grow">
                  {{ event.description }}
                </p>
                
                <!-- Action Buttons -->
                <div class="flex space-x-3 mt-auto">
                  <button 
                    @click="navigateToEvent(event)"
                    class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center space-x-2 h-12 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <i class="mdi mdi-navigation text-lg"></i>
                    <span>Navigate</span>
                  </button>
                  <a :href="event.link || '#'" 
                     target="_blank" 
                     class="flex-1">
                    <button class="w-full border-2 border-gray-900 text-gray-900 px-4 py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center space-x-2 h-12 transform hover:-translate-y-0.5">
                      <i class="mdi mdi-information text-lg"></i>
                      <span>Details</span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No events message -->
          <div v-else class="bg-gradient-to-br from-gray-50 to-gray-100 p-12 text-center rounded-xl border border-gray-200 shadow-inner">
            <div class="inline-block p-6 bg-white rounded-full shadow-md mb-6">
              <svg class="h-16 w-16 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Looks Like It's Quiet this day</h3>
            <p class="text-gray-600 max-w-md mx-auto mb-2">There aren't any events matching your current selection.</p>
            <p class="text-gray-600 max-w-md mx-auto">
              <span class="text-orange-500 font-medium">Suggestions:</span> 
              Try selecting another date, adjusting your time range, or exploring different event categories. Melbourne always has something happening!
            </p>
          </div>

          <!-- Pagination control -->
          <div v-if="filteredEvents.length > 0" class="mt-12 flex justify-center items-center space-x-3">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
              ]"
            >
              <span class="text-xl">←</span>
            </button>
            
            <div class="flex space-x-2">
              <button 
                v-for="page in totalPages" 
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200',
                  currentPage === page 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform -rotate-1 hover:rotate-0' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
              ]"
            >
              <span class="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Attribution Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
      <div class="flex justify-center">
        <img src="/attribution.png" alt="Data Attribution" class="max-w-full h-auto shadow-md rounded-lg" />
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
const router = useRouter()

const { locale, t } = useI18n()
// 不设置强制locale为zh
const currentLocale = ref(locale.value)

// UI状态
const showFilters = ref(false)
const isMenuOpen = ref(false)
const isLanguageOpen = ref(false)

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

// Autoplay carousel optimization
const autoplayInterval = ref(null);

// Start autoplay
function startAutoplay() {
  if (autoplayInterval.value) clearInterval(autoplayInterval.value);
  autoplayInterval.value = setInterval(() => {
    nextSlide();
  }, 6000);
}

// Stop autoplay
function stopAutoplay() {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
}

// Modified initialization logic
onMounted(() => {
  document.addEventListener('click', closeTimePresets);
  initializeEvents();
  startAutoplay();
});

onUnmounted(() => {
  document.removeEventListener('click', closeTimePresets);
  stopAutoplay();
});

// Replace Banner Slides data definition with computed property to get random events from API
const featuredEvents = computed(() => {
  // Randomly select 5 events from all events as featured
  if (!currentEvents.value || currentEvents.value.length === 0) {
    // If no events for the day, use some default event data
    return [
      {
        id: 1,
        name: "Today's Featured Event",
        description: "Explore Melbourne's wonderful events to enrich your journey.",
        category: "Featured",
        image: "/banner1.jpg"
      },
      {
        id: 2,
        name: "Local Cultural Experience",
        description: "Experience Melbourne's diverse culture and the unique charm of this city.",
        category: "Culture",
        image: "/banner2.jpg"
      }
    ];
  }
  
  // If there are events but fewer than 5, return all
  if (currentEvents.value.length <= 5) {
    return currentEvents.value;
  }
  
  // Randomly select 5 from all events
  return getRandomItems(currentEvents.value, 5);
});

// Get random items from array
function getRandomItems(array, n) {
  // Create array copy
  const shuffled = [...array];
  
  // Random sorting
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return first n items
  return shuffled.slice(0, n);
}

// Calendar days
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []

  // Get the first day of the month (0 is Sunday, 6 is Saturday)
  const firstDayWeekday = firstDay.getDay()
  
  // Add dates from previous month to fill first week
  for (let i = 0; i < firstDayWeekday; i++) {
    const date = new Date(year, month, -i)
    days.unshift(createDayObject(date))
  }

  // Add dates for current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push(createDayObject(date))
  }

  // Add dates from next month to fill last week if needed
  const totalDaysNeeded = 42 // 6 rows x 7 days
  const remainingDays = totalDaysNeeded - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push(createDayObject(date))
  }

  return days
})

// Create day object helper function
function createDayObject(date) {
  const dateString = date.toISOString().split('T')[0];
  const eventsCount = monthEvents.value[dateString] || 0;
  
  return {
    day: date.getDate(),
    date: date,
    isCurrentMonth: date.getMonth() === currentDate.value.getMonth(),
    hasEvents: eventsCount > 0,
    eventsCount: eventsCount,
    topCategories: [], // Categories not shown for now
    isToday: isSameDay(date, new Date())
  }
}

// Get category colors
function getCategoryColor(category) {
  const colors = {
    'Music': 'bg-blue-500',
    'Workshop': 'bg-green-500',
    'Guided Tour': 'bg-purple-500',
    'Dance': 'bg-pink-500',
    'Festival': 'bg-yellow-500',
    'Film': 'bg-indigo-500',
    'Wellness': 'bg-teal-500',
    'Social': 'bg-orange-500',
    'Music Event': 'bg-blue-500',
    'Cultural Event': 'bg-purple-500',
    'Food Event': 'bg-orange-500',
    'Wellness Event': 'bg-teal-500'
  }
  return colors[category] || 'bg-gray-500'
}

// Event count colors
function getEventCountColor(count) {
  if (count >= 10) {
    return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
  } else if (count >= 5) {
    return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
  } else {
    return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
  }
}

// 获取类别标签颜色优化
function getCategoryTagColor(category) {
  const colors = {
    'Music': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    'Workshop': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    'Guided Tour': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    'Dance': 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
    'Festival': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black',
    'Film': 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
    'Wellness': 'bg-gradient-to-r from-teal-500 to-teal-600 text-white',
    'Social': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    'Music Event': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    'Cultural Event': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    'Food Event': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    'Wellness Event': 'bg-gradient-to-r from-teal-500 to-teal-600 text-white',
    'Featured': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'
  }
  return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
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
  currentDate.value = new Date(currentDate.value.getFullYear(), monthIndex, 1)
}

function previousMonth() {
  const newDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  currentDate.value = newDate
}

function nextMonth() {
  const newDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  currentDate.value = newDate
}

function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(locale.value, options);
}

function toggleFilters() {
  showFilters.value = !showFilters.value
}

function applyFilters() {
  // Filters are now applied automatically through the computed property
  // This function is kept for future functionality extensions
  currentPage.value = 1 // Reset to first page when filters change
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
  currentPreset.value = 'All Day'
}

// Carousel Methods
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % featuredEvents.value.length;
}

function previousSlide() {
  currentSlide.value = currentSlide.value === 0 ? featuredEvents.value.length - 1 : currentSlide.value - 1;
}

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
  if (event && event.location) {
    router.push({
      name: 'navigation',
      query: {
        destination: event.location
      }
    });
  } else {
    console.warn('Cannot navigate: event or location is missing');
  }
}

// Click outside handler for dropdown
const closeTimePresets = (e) => {
  if (!e.target.closest('.time-presets-dropdown')) {
    showTimePresets.value = false
  }
}

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

// Filter events based on time range and category
const filteredEvents = computed(() => {
  if (!currentEvents.value) return []
  
  return currentEvents.value.filter(event => {
    // Time filter
    const eventTime = new Date(event.datetime)
    const eventHour = eventTime.getHours()
    const eventMinute = eventTime.getMinutes()
    
    const [startHour, startMinute] = to24Hour(timeRange.value.start).split(':').map(Number)
    const [endHour, endMinute] = to24Hour(timeRange.value.end).split(':').map(Number)
    
    const eventTimeValue = eventHour * 60 + eventMinute
    const startTimeValue = startHour * 60 + startMinute
    const endTimeValue = endHour * 60 + endMinute
    
    const timeMatch = eventTimeValue >= startTimeValue && eventTimeValue <= endTimeValue
    
    // Category filter with category alias mapping
    const categoryMatch = selectedEventType.value === '' || 
                         event.category === selectedEventType.value || 
                         matchCategoryAlias(event.category, selectedEventType.value)
    
    return timeMatch && categoryMatch
  })
})

// Function to match category with possible aliases
function matchCategoryAlias(eventCategory, selectedCategory) {
  if (!eventCategory) return false;
  
  // 将事件类别转为小写
  const lowerEventCategory = eventCategory.toLowerCase();
  
  // Cultural Events (最常见分类之一)
  if (selectedCategory === 'Cultural Event' && 
      ['art', 'exhibition', 'festival', 'cultural', 'culture', 'heritage', 'museum', 
       'gallery', 'tradition', 'ethnic', 'history', 'performance', 'chinese'].some(term => 
        lowerEventCategory.includes(term))) {
    return true;
  }
  
  // Religious Events
  if (selectedCategory === 'Religious Event' && 
      ['religious', 'spiritual', 'church', 'temple', 'mosque', 'prayer', 'worship', 
       'faith', 'religion', 'ceremony', 'buddhist', 'hindu', 'christian', 'islamic'].some(term => 
        lowerEventCategory.includes(term))) {
    return true;
  }
  
  // Health & Wellness (很受欢迎的分类)
  if (selectedCategory === 'Wellness Event' && 
      ['health', 'wellness', 'yoga', 'meditation', 'fitness', 'exercise', 'wellbeing', 
       'mindfulness', 'mental health', 'physical', 'therapy', 'healing', 'spa'].some(term => 
        lowerEventCategory.includes(term))) {
    return true;
  }
  
  // Social Groups
  if (selectedCategory === 'Social Event' && 
      ['social', 'community', 'meetup', 'networking', 'club', 'gathering', 'party', 
       'group', 'society', 'association', 'connect', 'meeting'].some(term => 
        lowerEventCategory.includes(term))) {
    return true;
  }
  
  // Workshops & Classes (常见分类)
  if (selectedCategory === 'Workshop' && 
      ['workshop', 'class', 'course', 'training', 'seminar', 'education', 'learn', 
       'skill', 'teach', 'tutorial', 'session', 'lecture', 'lesson'].some(term => 
        lowerEventCategory.includes(term))) {
    return true;
  }
  
  // Local Markets
  if (selectedCategory === 'Market' && 
      ['market', 'fair', 'bazaar', 'shopping', 'trade', 'stall', 'vendor', 
       'goods', 'craft', 'farmers', 'flea', 'sale'].some(term => 
        lowerEventCategory.includes(term))) {
    return true;
  }

  // Music Events (新增常见分类)
  if (selectedCategory === 'Music Event' && 
      ['music', 'concert', 'gig', 'band', 'performance', 'live music', 'dj', 
       'orchestra', 'choir', 'song', 'jazz', 'rock', 'classical'].some(term => 
        lowerEventCategory.includes(term))) {
    return true;
  }
  
  // Food Events (新增常见分类)
  if (selectedCategory === 'Food Event' && 
      ['food', 'cuisine', 'culinary', 'dining', 'tasting', 'gastronomy', 'restaurant', 
       'cook', 'chef', 'wine', 'beer', 'feast', 'dinner'].some(term => 
        lowerEventCategory.includes(term))) {
    return true;
  }
  
  return false;
}

// Add computed property to extract unique categories from current events
const eventCategories = computed(() => {
  if (!currentEvents.value || currentEvents.value.length === 0) return []
  
  const categories = currentEvents.value.map(event => event.category)
  return [...new Set(categories)].filter(category => category)
})

// Computed properties
const currentMonth = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
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

// Initialize events function
async function initializeEvents() {
  try {
    // 使用ref而不是布尔值
    const loadingToast = ref(true);
    
    // Get today's date
    const today = new Date();
    
    // Update date selection
    currentDate.value = today;
    selectedDate.value = today;
    
    // Get today's events
    let events = await getEventsForDate(today);
    
    // If no event data, use example data
    if (!events || events.length === 0) {
      const mockEvents = [
        {
          id: 1,
          name: "Melbourne Weekend Music Festival",
          description: "Large music performances in Melbourne's city center, featuring local and international artists. Experience diverse musical styles and the magic of live music.",
          category: "Music Event",
          image: "/events/jazz-night.jpg",
          datetime: new Date().toISOString(),
          location: "Federation Square"
        },
        {
          id: 2,
          name: "Chinese Cultural Festival",
          description: "Experience traditional Chinese culture, including lion dance, calligraphy, and food. Learn about China's rich history and cultural traditions, and participate in interactive activities.",
          category: "Cultural Event",
          image: "/events/Chinatown'sChineseNewYearFestival.jpg",
          datetime: new Date().toISOString(),
          location: "Chinatown Melbourne"
        },
        {
          id: 3,
          name: "Australian Food Festival",
          description: "Taste special foods from different regions of Australia. Explore diverse Australian cuisine and sample local ingredients and dishes.",
          category: "Food Event",
          image: "/events/food-festival.jpg",
          datetime: new Date().toISOString(),
          location: "Queen Victoria Market"
        },
        {
          id: 4,
          name: "Art Gallery Exhibition",
          description: "Contemporary art exhibition showcasing innovative works by local artists. Appreciate various art forms, including paintings, sculptures, and installations.",
          category: "Cultural Event",
          image: "/events/art-gallery.jpg",
          datetime: new Date().toISOString(),
          location: "National Gallery of Victoria"
        },
        {
          id: 5,
          name: "Yoga and Meditation Workshop",
          description: "Relaxation activities guided by professional yoga instructors. Learn breathing techniques and meditation methods to improve physical and mental health.",
          category: "Wellness Event",
          image: "/events/yoga-workshop.jpg",
          datetime: new Date().toISOString(),
          location: "Botanical Gardens"
        }
      ];
      events = mockEvents;
    }
    
    // Update current events
    currentEvents.value = events;
    
    // Update monthly event counts
    await fetchMonthEventCounts();
    
    // Reset current carousel index
    currentSlide.value = 0;
    
    // Hide loading state
    loadingToast.value = false;
  } catch (error) {
    console.error("Failed to initialize event data:", error);
    // Show error notification
  }
}

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

// UI state variables
const currentSlide = ref(0)
const currentPage = ref(1)
const eventsPerPage = 9

// Function to get random category color
function getRandomCategoryColor(index) {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  
  return colors[index % colors.length];
}

// 设置语言函数
function setLocale(lang) {
  locale.value = lang
  currentLocale.value = lang
  isLanguageOpen.value = false
}
</script>

<style scoped>
/* Calendar styles */
.calendar-day {
  min-height: 7rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  transform: scale(1.02);
  z-index: 10;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Selected day highlight */
.selected-day {
  box-shadow: inset 0 0 0 2px rgba(249, 115, 22, 0.4);
}

/* Today highlight */
.today-highlight {
  position: relative;
}

.today-highlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, #f97316, #ef4444);
  z-index: 1;
}

/* Day with events */
.day-with-events {
  position: relative;
}

.day-with-events::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #f97316;
}

/* Event count badge */
.event-count-badge {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  font-size: 0.75rem;
  line-height: 1;
}

/* Category indicator */
.category-indicator {
  width: 85%;
  height: 0.25rem;
  opacity: 0.7;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.calendar-day:hover .category-indicator {
  width: 95%;
  opacity: 1;
  height: 0.3rem;
}

/* Carousel styles */
.carousel-container {
  overflow: hidden;
  position: relative;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.75s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Scrollbar styling */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Gradient animation */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Hover effects */
.hover-float {
  transition: transform 0.3s ease;
}

.hover-float:hover {
  transform: translateY(-5px);
}

/* Responsiveness adjustments */
@media (max-width: 768px) {
  .carousel-container {
    border-radius: 0.5rem;
  }
  
  .calendar-day {
    min-height: 5rem;
  }
}
</style> 