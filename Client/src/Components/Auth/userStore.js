// User store to manage authentication state and backend communication
let currentUser = null;
const API_URL = 'http://localhost:5000'; // Your backend server URL

// Request OTP for login
export const requestLoginOTP = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (data.success) {
      return true;
    }
    throw new Error(data.message || 'Failed to send OTP');
  } catch (error) {
    console.error('Request OTP error:', error);
    throw error;
  }
};

// Verify OTP for login
export const verifyLoginOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    if (data.success) {
      setCurrentUser(data.user);
      return true;
    }
    throw new Error(data.message || 'Invalid OTP');
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

// Set current user after successful login
export const setCurrentUser = (user) => {
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
};

// Get the current logged-in user
export const getCurrentUser = () => {
  if (!currentUser) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  }
  return currentUser;
};

// Clear current user on logout
export const clearCurrentUser = () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
};

// Validate user credentials with backend
export const validateCredentials = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.success) {
      setCurrentUser(data.user);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

// Create new user through backend
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      const text = await response.text();
      console.error('createUser: failed to parse json, body:', text);
      return { success: false, message: 'Invalid server response' };
    }
    console.log('createUser: server response', data);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed' };
  }
};

// Find user by email for password reset
export const findUserByEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/find-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Find user error:', error);
    return null;
  }
};

// Update user password through backend
export const updatePassword = async (email, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Password reset error:', error);
    return false;
  }
};