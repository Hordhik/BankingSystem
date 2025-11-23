// src/services/bankApi.js
const BASE_URL = "http://localhost:6060/api/transactions";

async function api(path, method = "GET", body = null) {
  const url = `${BASE_URL}${path}`;
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

export const deposit = (accountId, amount) =>
  api("/deposit", "POST", { accountId, amount });

export const withdraw = (accountId, amount) =>
  api("/withdraw", "POST", { accountId, amount });

export const transfer = (fromAccountId, toAccountId, amount) =>
  api("/transfer", "POST", { fromAccountId, toAccountId, amount });

export const getHistory = (accountId) =>
  api(`/account/${accountId}/history`, "GET");

export const getAccounts = () =>
  fetch("http://localhost:6060/api/accounts", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json());

