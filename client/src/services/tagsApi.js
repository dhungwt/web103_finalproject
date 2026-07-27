import { request } from "./apiConfig";

export const getTags = async () => request("/tags");

export const createTag = async (name) =>
  request("/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

export const getTagsByLocation = async (locationId) =>
  request(`/locations/${locationId}/tags`);

export const addTagToLocation = async (locationId, tagId) =>
  request(`/locations/${locationId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag_id: tagId }),
  });

export const removeTagFromLocation = async (locationId, tagId) =>
  request(`/locations/${locationId}/tags/${tagId}`, { method: "DELETE" });
