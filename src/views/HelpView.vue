<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Help Center Header with Background -->
      <div class="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 mb-12 text-white overflow-hidden">
        <div class="absolute inset-0 bg-pattern opacity-10"></div>
        <div class="relative z-10 text-center">
          <h1 class="text-4xl font-bold mb-4">{{ t('help.title') }}</h1>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto">{{ t('help.description') }}</p>
        </div>
      </div>

      <!-- Enhanced Search Bar -->
      <div class="max-w-2xl mx-auto mb-12">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('help.searchPlaceholder')"
            class="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <span class="absolute left-4 top-4 text-gray-400">
            <i class="mdi mdi-magnify text-2xl"></i>
          </span>
        </div>
        <!-- Popular Searches -->
        <div class="mt-4 flex flex-wrap gap-2">
          <span class="text-sm text-gray-500 mr-2 mt-2">{{ t('help.popularSearches') }}:</span>
          <button 
            v-for="tag in popularSearches" 
            :key="tag"
            @click="searchQuery = tag"
            class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Enhanced Quick Links -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div v-for="category in helpCategories" :key="category.id" 
             class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer"
             @click="scrollToSection(category.id)">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <i :class="[category.icon, 'text-2xl text-blue-600']"></i>
            </div>
            <h3 class="text-lg font-semibold ml-4">{{ category.title }}</h3>
          </div>
          <p class="text-gray-600">{{ category.description }}</p>
          <div class="mt-4 flex items-center text-blue-600 hover:text-blue-700">
            <span class="text-sm font-medium">{{ t('help.learnMore') }}</span>
            <i class="mdi mdi-arrow-right ml-2"></i>
          </div>
        </div>
      </div>

      <!-- Enhanced FAQ Sections -->
      <div class="space-y-12">
        <section v-for="section in sections" :key="section.id" :id="section.id" 
                 class="bg-white rounded-xl shadow-sm p-8 transform transition-all hover:shadow-md">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <i :class="[section.icon, 'text-xl text-blue-600']"></i>
            </div>
            <h2 class="text-2xl font-bold">{{ t(`help.sections.${section.id}.title`) }}</h2>
          </div>
          <div class="space-y-4">
            <div v-for="faq in section.faqs" :key="faq.id" 
                 class="border-b border-gray-200 pb-4 last:border-0">
              <button
                @click="faq.isOpen = !faq.isOpen"
                class="w-full text-left flex justify-between items-center py-2 focus:outline-none"
              >
                <span class="text-lg font-medium pr-8">{{ faq.question }}</span>
                <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 transition-transform"
                     :class="{ 'rotate-180': faq.isOpen }">
                  <i class="mdi mdi-chevron-down"></i>
                </div>
              </button>
              <div v-show="faq.isOpen" 
                   class="mt-2 text-gray-600 prose max-w-none"
                   v-html="faq.answer">
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Enhanced Contact Support -->
      <div class="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="mdi mdi-headset text-3xl text-blue-600"></i>
          </div>
          <h2 class="text-2xl font-bold text-blue-900 mb-4">{{ t('help.contact.title') }}</h2>
          <p class="text-blue-700 mb-8 max-w-2xl mx-auto">{{ t('help.contact.description') }}</p>
          <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="mailto:support@example.com" 
               class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
              <i class="mdi mdi-email mr-2"></i>
              {{ t('help.contact.email') }}
            </a>
            <a href="tel:1234567890" 
               class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors shadow-sm">
              <i class="mdi mdi-phone mr-2"></i>
              {{ t('help.contact.phone') }}
            </a>
          </div>
          <!-- Support Hours -->
          <div class="mt-8 text-sm text-blue-600">
            <p>{{ t('help.contact.supportHours') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const searchQuery = ref('')

const popularSearches = [
  'Event booking',
  'Public transport',
  'Accessibility',
  'Parking',
  'Venue information'
]

const helpCategories = [
  {
    id: 'events',
    title: 'Event Information',
    description: 'Learn about finding, booking, and managing event registrations.',
    icon: 'mdi mdi-calendar-check'
  },
  {
    id: 'navigation',
    title: 'Navigation & Travel',
    description: 'Get help with directions, transportation options, and travel guides.',
    icon: 'mdi mdi-map-marker'
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    description: 'Find information about accessibility features and support.',
    icon: 'mdi mdi-account-group'
  }
]

const sections = [
  {
    id: 'events',
    icon: 'mdi mdi-calendar-check',
    faqs: [
      {
        id: 1,
        question: 'How do I find events near me?',
        answer: `
          <p>There are several ways to find events in your area:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Use the search function on our homepage</li>
            <li>Browse the Events Calendar</li>
            <li>Filter events by: location, date, category, price range</li>
          </ul>
        `,
        isOpen: false
      },
      {
        id: 2,
        question: 'Can I save events for later?',
        answer: `
          <p>Yes! You can easily save events to view later:</p>
          <ol class="list-decimal pl-6 mt-2">
            <li>Click the bookmark icon on any event card</li>
            <li>Access your saved events from your profile</li>
            <li>Receive reminders before saved events</li>
          </ol>
        `,
        isOpen: false
      },
      {
        id: 3,
        question: 'How do I get notified about upcoming events?',
        answer: `
          <p>Stay updated with event notifications:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Enable notifications in your profile settings</li>
            <li>Choose notification preferences</li>
            <li>Get reminders for saved events</li>
          </ul>
        `,
        isOpen: false
      }
    ]
  },
  {
    id: 'navigation',
    icon: 'mdi mdi-map-marker',
    faqs: [
      {
        id: 1,
        question: 'How accurate are the travel time estimates?',
        answer: `
          <p>Our travel time estimates are based on multiple data sources:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Real-time traffic data</li>
            <li>Public transport schedules</li>
            <li>Historical travel patterns</li>
          </ul>
        `,
        isOpen: false
      },
      {
        id: 2,
        question: 'Can I get directions for different transport modes?',
        answer: `
          <p>Yes, we support multiple transportation options.</p>
        `,
        isOpen: false
      },
      {
        id: 3,
        question: 'How do I save travel directions?',
        answer: `
          <p>Save your travel directions for offline use</p>
        `,
        isOpen: false
      }
    ]
  },
  {
    id: 'accessibility',
    icon: 'mdi mdi-account-group',
    faqs: [
      {
        id: 1,
        question: 'What accessibility features are available?',
        answer: `
          <p>Our platform is designed to be accessible to all users.</p>
        `,
        isOpen: false
      },
      {
        id: 2,
        question: 'How can I find accessible events?',
        answer: `
          <p>Find events with accessibility features.</p>
        `,
        isOpen: false
      },
      {
        id: 3,
        question: 'Can I get accessibility information for specific venues?',
        answer: `
          <p>Yes, detailed accessibility information is available for each venue.</p>
        `,
        isOpen: false
      }
    ]
  }
]

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

:deep(.prose) {
  @apply text-gray-600;
}

:deep(.prose ul) {
  @apply my-2;
}

:deep(.prose li) {
  @apply my-1;
}

.list-circle {
  list-style-type: circle;
}
</style> 