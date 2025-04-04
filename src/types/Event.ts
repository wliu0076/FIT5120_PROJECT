export interface Event {
  id: number;
  name: string;
  datetime: string;
  description: string;
  location: string;
  category: string;
  link: string;
  image: string;
}

export interface EventFilters {
  category?: string;
  location?: string;
  date?: string;
} 