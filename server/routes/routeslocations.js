import express from "express";
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/controllocations.js";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/controlItems.js";
import {
  getTagsByLocation,
  addTagToLocation,
  removeTagFromLocation,
} from "../controllers/controlTags.js";

const router = express.Router();

router.get("/", getAllLocations);
router.get("/:id", getLocationById);
router.post("/", createLocation);
router.patch("/:id", updateLocation);
router.delete("/:id", deleteLocation);

//item routes
router.get("/:locationId/items", getAllItems);
router.get("/:locationId/items/:itemId", getItemById);
router.post("/:locationId/items", createItem);
router.patch("/:locationId/items/:itemId", updateItem);
router.delete("/:locationId/items/:itemId", deleteItem);

//tag routes
router.get("/:locationId/tags", getTagsByLocation);
router.post("/:locationId/tags", addTagToLocation);
router.delete("/:locationId/tags/:tagId", removeTagFromLocation);


export default router;
