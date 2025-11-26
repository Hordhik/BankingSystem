import axios from 'axios';

const API_ROOT = "http://localhost:6060/api/admin";

// Create an axios instance with default config
const adminClient = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the admin token
adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    // config.headers.Authorization = `Bearer ${token}`; // Uncomment when admin auth is implemented
  }
  return config;
});

export const getDashboardStats = async () => {
  try {
    const response = await adminClient.get('/stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export const getRecentActivities = async () => {
  try {
    const response = await adminClient.get('/activities');
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await adminClient.get('/users');
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    const response = await adminClient.get('/transactions');
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getMonthlyReports = async () => {
  try {
    const response = await adminClient.get('/reports/monthly');
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly reports:", error);
    throw error;
  }
};

export const getAnalytics = async () => {
  try {
    const response = await adminClient.get('/analytics');
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

export const getQuickStats = async () => {
  try {
    const response = await adminClient.get('/quick-stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    throw error;
  }
};

export const updateTransactionStatus = async (id, status) => {
  try {
    const response = await adminClient.put(`/transactions/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating transaction status:", error);
    throw error;
  }
};
