import { SERVER_URL } from "./apiConfig";

// full-page redirect (not fetch) - GitHub OAuth has to happen in the browser itself
export const GITHUB_LOGIN_URL = `${SERVER_URL}/auth/github`;

// returns the logged-in user, or null if no session is active
export const getCurrentUser = async () => {
  const response = await fetch(`${SERVER_URL}/auth/login/success`, {
    credentials: "include",
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.user;
};

export const logout = async () => {
  const response = await fetch(`${SERVER_URL}/auth/logout`, {
    credentials: "include",
  });
  const data = await response.json();
  window.location.href = "/";
  return data;
};
