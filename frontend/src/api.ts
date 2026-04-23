import axios from 'axios';

export interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

export interface ProfilesResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  data: Profile[];
}

export interface ProfileFilters {
  gender?: string;
  age_group?: string;
  country_id?: string;
  min_age?: number;
  max_age?: number;
  sort_by?: string;
  order?: string;
  page?: number;
  limit?: number;
  q?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/profiles';

export const fetchProfiles = async (filters: ProfileFilters): Promise<ProfilesResponse> => {
  const endpoint = filters.q ? `${API_BASE_URL}/search` : API_BASE_URL;
  const params = { ...filters };
  if (filters.q) delete params.q;

  const response = await axios.get<ProfilesResponse>(endpoint, { params });
  return response.data;
};
