import { request } from "./apiConfig";

export const searchPlaces = async (q) =>
  request(`/places/autocomplete?q=${encodeURIComponent(q)}`);

export const getPlaceDetails = async (placeId) =>
  request(`/places/details?place_id=${encodeURIComponent(placeId)}`);
