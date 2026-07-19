import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import locationsRoutes from "../routes/routeslocations.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/locations", locationsRoutes);

app.get("/", (req, res) => {
  res.send("Slice of Life API is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
