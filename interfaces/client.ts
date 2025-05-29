// interfaces/client.ts
export interface Client {
  id: string | number; // UUID or number
  agency_id: string | number;
  name: string;
  website?: string | null;
  industry?: string | null;
  contact_person?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  // Add any summary fields if your API returns them for the list view
  // e.g., active_feeds_count?: number;
  // e.g., critical_insights_count?: number;
}

export interface ClientFormData { // For creating/updating clients
	name: string;
	website?: string | null;
	industry?: string | null;
	contact_person?: string | null;
	notes?: string | null;
	is_active?: boolean; // Should default to true in form if not provided
}
