import { Event, EventFilters } from '../types/Event';
import { events as mockEvents } from '../data/events';

/**
 * Get all events
 */
export const getAllEvents = async (): Promise<Event[]> => {
  // In a real app, this would be an API call
  // return fetch('/api/events').then(res => res.json());
  
  // For now, return mock data
  return Promise.resolve(mockEvents);
};

/**
 * Get a single event by ID
 */
export const getEventById = async (id: number): Promise<Event | undefined> => {
  // In a real app, this would be an API call
  // return fetch(`/api/events/${id}`).then(res => res.json());
  
  // For now, search in mock data
  const event = mockEvents.find(event => event.id === id);
  return Promise.resolve(event);
};

/**
 * Filter events based on criteria
 */
export const filterEvents = async (filters: EventFilters): Promise<Event[]> => {
  // Get all events
  const allEvents = await getAllEvents();
  
  // Apply filters
  return allEvents.filter(event => {
    let match = true;
    
    if (filters.category && filters.category !== 'all') {
      match = match && event.category === filters.category;
    }
    
    if (filters.location) {
      match = match && event.location.toLowerCase().includes(filters.location.toLowerCase());
    }
    
    if (filters.date) {
      const eventDate = new Date(event.datetime).toISOString().split('T')[0];
      match = match && eventDate === filters.date;
    }
    
    return match;
  });
};

/**
 * Get events by date (for calendar view)
 */
export const getEventsByDate = async (date: Date): Promise<Event[]> => {
  const allEvents = await getAllEvents();
  const dateString = date.toISOString().split('T')[0];
  
  return allEvents.filter(event => {
    const eventDate = new Date(event.datetime).toISOString().split('T')[0];
    return eventDate === dateString;
  });
};

/**
 * Get upcoming events
 */
export const getUpcomingEvents = async (limit: number = 10): Promise<Event[]> => {
  const allEvents = await getAllEvents();
  const now = new Date();
  
  return allEvents
    .filter(event => new Date(event.datetime) > now)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
    .slice(0, limit);
};

/**
 * Get events by category
 */
export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  const allEvents = await getAllEvents();
  
  return allEvents.filter(event => event.category === category);
};

/**
 * Get unique event categories
 */
export const getEventCategories = async (): Promise<string[]> => {
  const allEvents = await getAllEvents();
  const categories = new Set(allEvents.map(event => event.category));
  
  return Array.from(categories);
}; 