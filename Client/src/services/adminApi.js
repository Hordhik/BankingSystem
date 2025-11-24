// Mock data for now, will be replaced by actual API calls
const mockDashboardStats = [
  { label: 'Total Users', value: '2,543', color: '#667eea', change: '+12%' },
  { label: 'Active Transactions', value: '1,284', color: '#764ba2', change: '+5%' },
  { label: 'Total Revenue', value: '₹45,60,000', color: '#f093fb', change: '+18%' },
  { label: 'System Health', value: '98.5%', color: '#4facfe', change: 'Stable' },
];

const mockRecentActivities = [
  { id: 1, type: 'User Registration', user: 'John Doe', time: '2 mins ago', status: 'success' },
  { id: 2, type: 'Large Transaction', user: 'Jane Smith', amount: '₹50,000', time: '5 mins ago', status: 'completed' },
  { id: 3, type: 'Failed Login Attempt', user: 'Unknown', time: '10 mins ago', status: 'warning' },
  { id: 4, type: 'Card Creation', user: 'Mike Johnson', time: '15 mins ago', status: 'success' },
  { id: 5, type: 'Password Change', user: 'Sarah Williams', time: '20 mins ago', status: 'success' },
];

export const getDashboardStats = async () => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDashboardStats);
    }, 500);
  });
};

export const getRecentActivities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRecentActivities);
    }, 500);
  });
};
