import express from "express";
import {
  getLocationsByUser,
  addLocationForUser,
  removeLocationForUser,
} from "../controllers/controlUsers.js";
import { requireAuth, requireSelf } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/:userId/locations", requireAuth, requireSelf, getLocationsByUser);
router.post("/:userId/locations", requireAuth, requireSelf, addLocationForUser);
router.delete(
  "/:userId/locations/:locationId",
  requireAuth,
  requireSelf,
  removeLocationForUser,
);

export default router;
