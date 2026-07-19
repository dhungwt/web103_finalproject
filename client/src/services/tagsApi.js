import { USE_MOCK_DATA, fakeDelay, request } from "./apiConfig";
import {
  tags as mockTags,
  locationTags as mockLocationTags,
} from "../data/mockData";

export const getTags = async () => {
  if (USE_MOCK_DATA) return fakeDelay(mockTags);
  return request("/tags");
};

export const getTagsByLocation = async (locationId) => {
  if (USE_MOCK_DATA) {
    const tagIds = mockLocationTags
      .filter((row) => row.location_id === Number(locationId))
      .map((row) => row.tag_id);
    return fakeDelay(mockTags.filter((tag) => tagIds.includes(tag.id)));
  }
  return request(`/locations/${locationId}/tags`);
};

export const addTagToLocation = async (locationId, tagId) =>
  request(`/locations/${locationId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag_id: tagId }),
  });
