import { useQuery } from "@tanstack/react-query";
import { DashboardAPIResponse, DateRangeOption, APIError } from "@/types/dashboard";
import { getMockAPIData } from "@/services/mockData";

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001' 
  : 'https://api.citationtracker.pro';

const fetchDashboardData = async (dateRange: DateRangeOption, projectId?: string): Promise<DashboardAPIResponse> => {
  try {
    const params = new URLSearchParams({
      dateRange,
      ...(projectId && { projectId })
    });
    
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      }
      const errorData: APIError = await response.json().catch(() => ({ 
        error: { message: `HTTP Error: ${response.status} ${response.statusText}` } 
      }));
      throw new Error(errorData.error.message);
    }
    
    return response.json();
  } catch (error) {
    // Fallback to mock data if API is not available
    console.warn('API not available, using mock data:', error);
    return getMockAPIData(dateRange);
  }
};

export const useDashboardData = (dateRange: DateRangeOption = "last_30_days", projectId?: string) => {
  return useQuery({
    queryKey: ['dashboard', dateRange, projectId],
    queryFn: () => fetchDashboardData(dateRange, projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};