export interface User {
  id: string | number;
  name: string;
  email: string;
  agency_id?: string | number;
  role?: {
	id: number;
	name: string;
	display_name: string;
	permissions?: any[];
  };
  is_active?: boolean;
  profile_picture_url?: string | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterDetails {
  agency_name: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  timezone: string;
}
