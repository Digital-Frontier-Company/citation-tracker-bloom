import { useQuery } from "@tanstack/react-query";
import { DashboardData, DateRangeOption } from "@/types/dashboard";
import { getMockDashboardData } from "@/services/mockData";

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001' 
  : 'https://api.citationtracker.pro';

const fetchDashboardData = async (dateRange: DateRangeOption): Promise<DashboardData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard?dateRange=${dateRange}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    // Fallback to mock data if API is not available
    console.warn('API not available, using mock data:', error);
    return getMockDashboardData(dateRange);
  }
};

export const useDashboardData = (dateRange: DateRangeOption = "last_30_days") => {
  return useQuery({
    queryKey: ['dashboard', dateRange],
    queryFn: () => fetchDashboardData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};