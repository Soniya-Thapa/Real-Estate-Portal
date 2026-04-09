export interface User {
  id: string;      
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Property {
  id: string;      
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
  created_at: string;
  is_favourite?: boolean;
  favourited_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}