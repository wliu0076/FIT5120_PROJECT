<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Banner with Carousel -->
    <div class="relative overflow-hidden">
      <div class="slider-container">
        <div class="slider-track flex transition-transform duration-700 ease-out" ref="heroSlider">
          <!-- Slide 1 -->
          <div class="slider-slide w-full flex-shrink-0 relative">
            <div class="absolute inset-0">
              <img src="/background.png" alt="Melbourne Background" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
            </div>
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
              <div class="hero-content flex flex-col md:flex-row items-center justify-between">
                <div class="text-white mb-8 md:mb-0 md:w-3/4">
                  <h1 class="font-bold mb-8">{{ $t('home.hero.title') }}</h1>
                  <p class="text-2xl mb-12 text-gray-100 leading-relaxed">{{ $t('home.hero.subtitle') }}</p>
                  <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <router-link to="/events" class="primary-button bg-blue-600 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                      <i class="mdi mdi-calendar-search text-2xl mr-3"></i>
                      {{ $t('home.hero.browseEvents') }}
                    </router-link>
                    <router-link to="/travel" class="primary-button border-2 border-white text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center">
                      <i class="mdi mdi-map-marker-path text-2xl mr-3"></i>
                      Explore Melbourne
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Slide 2 -->
          <div class="slider-slide w-full flex-shrink-0 relative">
            <div class="absolute inset-0">
              <img src="/background2.png" alt="Cultural Background" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black/30"></div>
            </div>
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
              <div class="hero-content flex flex-col md:flex-row items-center justify-between">
                <div class="text-white mb-8 md:mb-0 md:w-3/4">
                  <h1 class="font-bold mb-8">Explore Events in Melbourne</h1>
                  <p class="text-2xl mb-12 text-gray-100 leading-relaxed">Discover the best upcoming events in the city</p>
                  <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <router-link to="/landmarks" class="primary-button bg-purple-600 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all flex items-center justify-center">
                      <i class="mdi mdi-map-marker text-2xl mr-3"></i>
                      Cultural Landmarks
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Hero Slider Controls -->
      <div class="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-10">
        <button @click="slideHero(0)" class="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors focus:outline-none" :class="{'bg-white': heroActiveSlide === 0}"></button>
        <button @click="slideHero(1)" class="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors focus:outline-none" :class="{'bg-white': heroActiveSlide === 1}"></button>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Making Melbourne Simple to Explore</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i class="mdi mdi-calendar-search text-4xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Find an Event</h3>
            <p class="text-gray-600">Browse events in your preferred language</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i class="mdi mdi-map-marker-path text-4xl text-green-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Get Travel Guide</h3>
            <p class="text-gray-600">Get step-by-step directions to the event</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <i class="mdi mdi-walk text-4xl text-purple-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Go Explore</h3>
            <p class="text-gray-600">Enjoy the event with your community</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

// i18n
const { locale } = useI18n()

// Slider references
const heroSlider = ref(null)

// Active slide tracker
const heroActiveSlide = ref(0)

// Auto-slide timer
let heroSlideTimer = null

// Hero slider navigation
function slideHero(index) {
  if (!heroSlider.value) return
  
  heroActiveSlide.value = index
  heroSlider.value.style.transform = `translateX(-${index * 100}%)`
}

function nextHeroSlide() {
  const next = (heroActiveSlide.value + 1) % 2
  slideHero(next)
}

// Setup auto-sliding
function setupAutoSlide() {
  heroSlideTimer = setInterval(() => {
    nextHeroSlide()
  }, 8000)
}

// Lifecycle hooks
onMounted(() => {
  setupAutoSlide()
})

onUnmounted(() => {
  if (heroSlideTimer) clearInterval(heroSlideTimer)
})
</script>

<style scoped>
/* Enhanced Typography */
h1 {
  font-size: 4.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Slider Styles */
.slider-container {
  width: 100%;
  overflow: hidden;
}

.slider-track {
  width: 100%;
  display: flex;
}

.slider-slide {
  width: 100%;
  flex-shrink: 0;
}

/* Smooth Animations */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-content {
  animation: fadeUp 0.8s ease-out forwards;
}

/* Improved Button Hover Effects */
.primary-button {
  position: relative;
  overflow: hidden;
}

.primary-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.primary-button:hover::after {
  transform: translateX(0);
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* High contrast and accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

@media (prefers-contrast: high) {
  .text-gray-600 {
    color: #000000;
  }
  .text-gray-100 {
    color: #ffffff;
  }
  .bg-blue-600 {
    background-color: #0040FF;
  }
}
</style> 