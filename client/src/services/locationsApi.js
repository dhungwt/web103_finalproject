import { request } from "./apiConfig";

export const getLocations = async () => request("/locations");

export const getLocationById = async (id) => request(`/locations/${id}`);

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
