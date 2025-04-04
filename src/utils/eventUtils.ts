import { Event } from '../types/Event';

/**
 * Format date for display
 */
export const formatEventDate = (dateString: string, locale: string = 'en'): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString(locale, options);
};

/**
 * Format time for display
 */
export const formatEventTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format event address
 */
export const formatEventAddress = (address: string): string => {
  // This could become more sophisticated if needed
  return address;
};

/**
 * Check if event is upcoming (in the future)
 */
export const isUpcomingEvent = (event: Event): boolean => {
  const eventDate = new Date(event.datetime);
  const now = new Date();
  return eventDate > now;
};

/**
 * Get events color by category
 */
export const getEventCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    'Music': 'bg-blue-500',
    'Comedy': 'bg-purple-500',
    'Food & Drink': 'bg-red-500',
    'Art': 'bg-yellow-500',
    'Fitness': 'bg-green-500',
    'Festival': 'bg-pink-500',
    'Workshop': 'bg-indigo-500',
    'Conference': 'bg-gray-500'
  };
  
  return categoryColors[category] || 'bg-gray-500';
};

/**
 * Group events by date
 */
export const groupEventsByDate = (events: Event[]): Record<string, Event[]> => {
  return events.reduce((acc, event) => {
    const date = new Date(event.datetime).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
}; 