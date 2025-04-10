import { Event, EventFilters } from '../types/Event';
import { events as mockEvents } from '../data/events';

/**
 * Get event count by month from API
 */
export const getEventCountByMonth = async (year: number, month: number): Promise<any> => {
  try {
    const apiUrl = `/api/event-count-by-month?year=${year}&month=${month}`;
    console.log(`Fetching event counts from: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    // Log more information about the response
    console.log(`API response status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('Content-Type')}`);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('API error response:', errorText.substring(0, 200) + '...');
      throw new Error('Failed to fetch event counts');
    }
    
    // Check if content type is JSON
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Invalid content type: ${contentType}`);
      const text = await response.text();
      console.error('Non-JSON response (first 200 chars):', text.substring(0, 200));
      // 服务器返回HTML而不是JSON，直接使用模拟数据
      console.log('Server returned HTML instead of JSON, using mock data');
      return generateMockEventCounts(year, month);
    }
    
    let data;
    try {
      // Clone response before parsing to avoid consuming the body
      const clonedResponse = response.clone();
      data = await response.json();
      
      console.log('Parsed JSON data:', data);
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      const text = await response.clone().text();
      console.error('Response was not valid JSON. First 100 chars:', text.substring(0, 100));
      // 解析JSON失败，使用模拟数据
      return generateMockEventCounts(year, month);
    }
    
    // Check if the returned data format is correct
    if (!Array.isArray(data)) {
      console.error('API returned data is not in array format:', data);
      return generateMockEventCounts(year, month);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching event counts:', error);
    // Return mock data as fallback
    return generateMockEventCounts(year, month);
  }
};

// 提取生成模拟数据的函数
const generateMockEventCounts = (year: number, month: number): any[] => {
  console.log(`Generating mock event counts for ${year}-${month}`);
  return Array.from({ length: 31 }, (_, i) => ({
    date: `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
    count: Math.floor(Math.random() * 5)
  }));
};

/**
 * Get events by date from API
 */
export const getEventsFromApi = async (date: string): Promise<Event[]> => {
  try {
    const apiUrl = `/api/events-by-date?date=${date}`;
    console.log(`Fetching events from: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    // Log more information about the response
    console.log(`API response status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('Content-Type')}`);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('API error response:', errorText.substring(0, 200) + '...');
      throw new Error('Failed to fetch events');
    }
    
    // Check if content type is JSON
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Invalid content type: ${contentType}`);
      const text = await response.text();
      console.error('Non-JSON response (first 200 chars):', text.substring(0, 200));
      // 服务器返回HTML而不是JSON，使用模拟数据
      console.log('Server returned HTML instead of JSON, using mock data');
      return generateMockEvents(date);
    }
    
    let events;
    try {
      // Clone response before parsing to avoid consuming the body
      const clonedResponse = response.clone();
      events = await response.json();
      
      console.log('Parsed JSON data:', events);
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      const text = await response.clone().text();
      console.error('Response was not valid JSON. First 100 chars:', text.substring(0, 100));
      // 解析JSON失败，使用模拟数据
      return generateMockEvents(date);
    }
    
    // Check if events is an array
    if (!Array.isArray(events)) {
      console.error('API returned data is not in array format:', events);
      return generateMockEvents(date);
    }
    
    // If it's an empty array, return directly
    if (events.length === 0) {
      return [];
    }
    
    return events.map((event: any) => ({
      ...event,
      // Ensure datetime is in ISO format
      datetime: new Date(event.datetime || date + 'T12:00:00').toISOString(),
      // If image is empty, use placeholder image
      image: event.image || getPlaceholderImage()
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return mock data as fallback
    return generateMockEvents(date);
  }
};

// 提取生成模拟事件数据的函数
const generateMockEvents = (date: string): Event[] => {
  console.log(`Generating mock events for ${date}`);
  return [
    {
      id: Math.floor(Math.random() * 10000),
      name: 'Mock Event - ' + date,
      datetime: new Date(date + 'T12:00:00').toISOString(),
      description: 'This is a mock event because the API request failed',
      location: 'Melbourne CBD',
      category: 'Comedy',
      link: '#',
      image: getPlaceholderImage()
    }
  ];
};

// Utility function: get placeholder image URL
const getPlaceholderImage = () => {
  return '/placeholder-event.jpg';
};

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
  const dateString = date.toISOString().split('T')[0];
  return getEventsFromApi(dateString);
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