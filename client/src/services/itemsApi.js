import { request } from "./apiConfig";

export const getItemsByLocation = async (locationId) =>
  request(`/locations/${locationId}/items`);

export const getItemById = async (locationId, itemId) =>
  request(`/locations/${locationId}/items/${itemId}`);

export const createItem = async (locationId, item) =>
  request(`/locations/${locationId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

export const updateItem = async (locationId, itemId, updates) =>
  request(`/locations/${locationId}/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

export const deleteItem = async (locationId, itemId) =>
  request(`/locations/${locationId}/items/${itemId}`, { method: "DELETE" });
