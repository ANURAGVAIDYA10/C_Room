import { useState, useEffect } from 'react';
import { jiraService } from '../services/jiraService';

export interface TotalSpendData {
  totalSpend: number;
  formattedTotalSpend: string;
  vendorCount: number;
  productCount: number;
  averageSpendPerVendor: number;
  changePercentage: string;
}

export const useAnalytics = () => {
  const [totalSpendData, setTotalSpendData] = useState<TotalSpendData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalSpend = async () => {
      try {
        setLoading(true);
        const data: TotalSpendData = await jiraService.getTotalVendorSpend();
        setTotalSpendData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching total spend data:', err);
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchTotalSpend();
  }, []);

  return { totalSpendData, loading, error };
};