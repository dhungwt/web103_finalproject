import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import locationsRoutes from "./routes/routesLocations.js";
import tagsRoutes from "./routes/routesTags.js";
import usersRoutes from "./routes/routesUsers.js";
import authRoutes from "./routes/auth.js";
import placesRoutes from "./routes/routesPlaces.js";

// session set up for passport
import passport from "passport";
import session from "express-session";
import { GitHub } from "./config/auth.js";
import { getUserById } from "./controllers/controlUsers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";


app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  }),
);
app.use(express.json());

app.use(session({
    secret: 'codepath',
    resave: false,
    saveUninitialized: true
}))

// setup and initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(GitHub);

// passort seriablise and deserialize functions
passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// routes
app.use("/api/locations", locationsRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Slice of Life API is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
