// Shared settings for every *Api.js file in this folder.

// While the database is being set up, USE_MOCK_DATA makes the api files
// read from src/data/mockData.js instead of hitting the server.
// Flip it to false once the backend is running.

export const USE_MOCK_DATA = true;

export const SERVER_URL = "http://localhost:3000";

export const BASE_URL = `${SERVER_URL}/api`;

export const fakeDelay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));

export const request = async (path, options) => {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
};
