// src/services/bankApi.js
const API_ROOT = "http://localhost:6060/api";

async function request(endpoint, method = "GET", body = null) {
  const url = `${API_ROOT}${endpoint}`;
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? JSON.parse(text || "{}") : text;

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || "API error");
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

// Transaction Controller Endpoints
export const deposit = (accountId, amount) =>
  request("/transactions/deposit", "POST", { accountId, amount });

export const withdraw = (accountId, amount) =>
  request("/transactions/withdraw", "POST", { accountId, amount });

export const transfer = (fromAccountId, toAccountId, amount, fee, tax) =>
  request("/transactions/transfer", "POST", { fromAccountId, toAccountId, amount, fee, tax });

export const cardTransfer = (senderCardNumber, receiverCardNumber, amount, senderCvv, senderExpiryDate) =>
  request("/transactions/card-transfer", "POST", { senderCardNumber, receiverCardNumber, amount, senderCvv, senderExpiryDate });

export const getCards = () =>
  request('/cards', 'GET');

export const getHistory = (accountId) =>
  request(`/transactions/account/${accountId}/history`, "GET");

// Account Controller Endpoints
export const getAccounts = () =>
  request("/accounts", "GET");

// User Controller Endpoints
export const updateUser = (userId, userData) =>
  request(`/users/${userId}`, "PUT", userData);

// Auth Controller Endpoints
export const login = (email, password) =>
  request("/auth/login", "POST", { email, password });

export const register = (fullname, email, password, username, accountNumber, ifsc) =>
  request("/auth/register", "POST", { fullname, email, password, username, accountNumber, ifsc });


export const changePassword = async (userId, data) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/${userId}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to change password');
  }

  return await response.text();
};
