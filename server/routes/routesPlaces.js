import express from "express";
import { autocomplete, details } from "../controllers/controlPlaces.js";

const router = express.Router();

router.get("/autocomplete", autocomplete);
router.get("/details", details);

export default router;
