import { Event, EventFilters } from '../types/Event';
import { events as mockEvents } from '../data/events';

/**
 * Get event count by month from API
 */
export const getEventCountByMonth = async (year: number, month: number): Promise<any> => {
  try {
    const response = await fetch(`/api/event-count-by-month?year=${year}&month=${month}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event counts');
    }
    
    const data = await response.json();
    
    // 检查返回的数据格式是否正确
    if (!Array.isArray(data)) {
      console.error('API返回的数据不是数组格式:', data);
      throw new Error('API返回的数据格式不正确');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching event counts:', error);
    // 返回模拟数据作为备用
    return Array.from({ length: 31 }, (_, i) => ({
      date: `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
      count: Math.floor(Math.random() * 5)
    }));
  }
};

/**
 * Get events by date from API
 */
export const getEventsFromApi = async (date: string): Promise<Event[]> => {
  try {
    const response = await fetch(`/api/events-by-date?date=${date}`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    const events = await response.json();
    
    // 检查events是否是数组
    if (!Array.isArray(events)) {
      console.error('API返回的数据不是数组格式:', events);
      return [];
    }
    
    // 如果是空数组，直接返回
    if (events.length === 0) {
      return [];
    }
    
    return events.map((event: any) => ({
      ...event,
      // 确保datetime是ISO格式
      datetime: new Date(event.datetime || date + 'T12:00:00').toISOString(),
      // 如果image为空，使用占位图片
      image: event.image || getPlaceholderImage()
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    // 返回模拟数据作为备用
    return [
      {
        id: Math.floor(Math.random() * 10000),
        name: '模拟活动 - ' + date,
        datetime: new Date(date + 'T12:00:00').toISOString(),
        description: '这是一个模拟活动，因为API请求失败',
        location: 'Melbourne CBD',
        category: 'Comedy',
        link: '#',
        image: getPlaceholderImage()
      }
    ];
  }
};

// 工具函数：获取占位图像URL
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