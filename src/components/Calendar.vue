<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="previousMonth">{{ t('events.calendar.previous') }}</button>
      <span>{{ currentMonthName }}</span>
      <button @click="nextMonth">{{ t('events.calendar.next') }}</button>
    </div>
    <div class="calendar-grid">
      <div class="weekday-header" v-for="day in weekDays" :key="day">
        {{ t(`events.calendar.${day}`) }}
      </div>
      <div
        v-for="day in calendarDays"
        :key="day.date"
        :class="['calendar-day', { 'current-month': day.currentMonth }]"
      >
        {{ day.dayOfMonth }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface CalendarDay {
  date: string;
  dayOfMonth: number;
  currentMonth: boolean;
}

const { t } = useI18n()

const currentDate = ref(new Date())

const weekDays = ['mon1', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const currentMonthName = computed(() => {
  const monthNames = [
    'january', 'february', 'march', 'april',
    'may', 'june', 'july', 'august',
    'september', 'october', 'november', 'december'
  ]
  return t(`events.calendar.months.${monthNames[currentDate.value.getMonth()]}`)
})

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const days: CalendarDay[] = []
  
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date: date.toISOString(),
      dayOfMonth: date.getDate(),
      currentMonth: false
    })
  }
  
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date: date.toISOString(),
      dayOfMonth: i,
      currentMonth: true
    })
  }
  
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date: date.toISOString(),
      dayOfMonth: date.getDate(),
      currentMonth: false
    })
  }
  
  return days
})

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}
</script>

<style scoped>
.calendar {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
}

.calendar-header button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.calendar-header button:hover {
  background-color: #45a049;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #ddd;
  border: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
}

.weekday-header {
  background-color: #f8f9fa;
  padding: 0.5rem;
  text-align: center;
  font-weight: bold;
}

.calendar-day {
  background-color: white;
  padding: 1rem;
  text-align: center;
  min-height: 60px;
}

.calendar-day:not(.current-month) {
  color: #999;
  background-color: #f8f9fa;
}

.calendar-day.current-month {
  font-weight: bold;
}
</style> 