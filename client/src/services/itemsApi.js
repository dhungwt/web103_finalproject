import { USE_MOCK_DATA, fakeDelay, request } from "./apiConfig";
import { items as mockItems } from "../data/mockData";

export const getItemsByLocation = async (locationId) => {
  if (USE_MOCK_DATA) {
    return fakeDelay(
      mockItems.filter((item) => item.location_id === Number(locationId)),
    );
  }
  return request(`/locations/${locationId}/items`);
};

export const getItemById = async (locationId, itemId) => {
  if (USE_MOCK_DATA) {
    const item = mockItems.find(
      (row) =>
        row.id === Number(itemId) && row.location_id === Number(locationId),
    );
    if (!item) throw new Error("Item not found.");
    return fakeDelay(item);
  }
  return request(`/locations/${locationId}/items/${itemId}`);
};

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
