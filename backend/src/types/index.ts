

// UUIDs are strings in TypeScript/JavaScript
export type UUID = string;

export interface User {
  id: UUID;          
  email: string;
  name: string;
  role: string;
  created_at: Date;
}

export interface Property {
  id: UUID;          
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
  created_at: Date;
  is_favourite?: boolean;
}

export interface Favourite {
  id: UUID;        
  user_id: UUID;      
  property_id: UUID;  
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}