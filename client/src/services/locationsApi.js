import { USE_MOCK_DATA, fakeDelay, request } from "./apiConfig";
import { locations as mockLocations } from "../data/mockData";

export const getLocations = async () => {
  if (USE_MOCK_DATA) return fakeDelay(mockLocations);
  return request("/locations");
};

export const getLocationById = async (id) => {
  if (USE_MOCK_DATA) {
    const location = mockLocations.find((loc) => loc.id === Number(id));
    if (!location) throw new Error("Location not found.");
    return fakeDelay(location);
  }
  return request(`/locations/${id}`);
};

export const createLocation = async (location) =>
  request("/locations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  });

export const updateLocation = async (id, updates) =>
  request(`/locations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

export const deleteLocation = async (id) =>
  request(`/locations/${id}`, { method: "DELETE" });
