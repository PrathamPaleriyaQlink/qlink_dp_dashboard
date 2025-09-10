// api_utils.js

const BASE_URL = "https://api.dp.qlink.in/api/v1";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function authHeadersMultipart() {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ---------- Auth ----------
export async function login(username, password) {
  const url = `${BASE_URL}/login?username=${username}&password=${password}`;

  const response = await fetch(url, {
    method: "POST", // backend still expects POST
  });

  if (!response.ok) throw new Error("Login failed");

  const data = await response.json();
  const expiresIn = 60 * 60 * 1000; // 1 hr
  const now = new Date().getTime();

  localStorage.setItem("token", data.access_token);
  localStorage.setItem("token_expiry", now + expiresIn);
  return data;
}

export const handleAuthError = () => {
  localStorage.removeItem("token");
};

// ---------- Campaigns ----------
export async function createOrUpdateCampaign(payload) {
  const res = await fetch(`${BASE_URL}/campaign`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create/update campaign");
  return res.json();
}

export async function listCampaigns() {
  const res = await fetch(`${BASE_URL}/campaigns`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export async function getCampaignById(campaignId) {
  const res = await fetch(`${BASE_URL}/campaign/${campaignId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch campaign");
  return res.json();
}

export async function getCampaignStats(campaignId) {
  const res = await fetch(`${BASE_URL}/campaign/${campaignId}/stats`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch campaign stats");
  return res.json();
}

export async function sendCampaignMessages(campaignId, { file, phone_numbers, phone_codes }) {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  if (phone_numbers && phone_codes) {
    phone_numbers.forEach((num, idx) => {
      formData.append("phone_numbers", num);
      formData.append("phone_codes", phone_codes[idx]);
    });
  }

  const res = await fetch(`${BASE_URL}/campaign/${campaignId}/send`, {
    method: "POST",
    headers: authHeadersMultipart(),
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to send campaign messages");
  return res.json();
}

// ---------- Misc ----------
export async function ping() {
  const res = await fetch("https://api.dp.qlink.in/ping");
  if (!res.ok) throw new Error("Ping failed");
  return res.json();
}
