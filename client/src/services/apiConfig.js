// Shared settings for every *Api.js file in this folder.

export const SERVER_URL = "https://server-fd88.onrender.com";

export const BASE_URL = `${SERVER_URL}/api`;

export const request = async (path, options) => {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
};
