import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import locationsRoutes from "./routes/routesLocations.js";
import tagsRoutes from "./routes/routesTags.js";
import usersRoutes from "./routes/routesUsers.js";
import authRoutes from "./routes/auth.js";

// session set up for passport
import passport from "passport";
import session from "express-session";
import { GitHub } from "./config/auth.js";
import { getUserById } from "./controllers/controlUsers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

if (!process.env.SESSION_SECRET) {
  console.warn("⚠️  SESSION_SECRET is not set in .env — using an insecure default.");
}

app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "insecure-dev-only-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // set to true once served over https in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);

// setup and initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(GitHub);

// only the user id goes into the session cookie's server-side store...
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ...and every request looks the user back up fresh from the database
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use("/api/locations", locationsRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/users", usersRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Slice of Life API is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
