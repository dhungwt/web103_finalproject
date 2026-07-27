import express from "express";
import { getAllTags, createTag } from "../controllers/controlTags.js";

const router = express.Router();

router.get("/", getAllTags);
router.post("/", createTag);

export default router;
