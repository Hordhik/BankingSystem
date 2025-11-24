// Mock data for transactions
const mockTransactions = [
  { id: 1, from: 'John Doe', to: 'Jane Smith', amount: '₹5,000', type: 'Transfer', date: '2024-11-13', status: 'Completed' },
  { id: 2, from: 'Mike Johnson', to: 'Sarah Williams', amount: '₹12,500', type: 'Payment', date: '2024-11-13', status: 'Completed' },
  { id: 3, from: 'Robert Brown', to: 'John Doe', amount: '₹3,200', type: 'Transfer', date: '2024-11-12', status: 'Failed' },
  { id: 4, from: 'Jane Smith', to: 'Mike Johnson', amount: '₹8,750', type: 'Payment', date: '2024-11-12', status: 'Pending' },
  { id: 5, from: 'Sarah Williams', to: 'Robert Brown', amount: '₹15,000', type: 'Transfer', date: '2024-11-11', status: 'Completed' },
  { id: 6, from: 'Alice Cooper', to: 'Bob Dylan', amount: '₹2,100', type: 'Transfer', date: '2024-11-10', status: 'Completed' },
  { id: 7, from: 'Charlie Watts', to: 'Keith Richards', amount: '₹45,000', type: 'Payment', date: '2024-11-09', status: 'Pending' },
  { id: 8, from: 'Mick Jagger', to: 'Ronnie Wood', amount: '₹1,500', type: 'Transfer', date: '2024-11-08', status: 'Failed' },
];

export const getTransactions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions);
    }, 500);
  });
};
