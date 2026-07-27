import GitHubStrategy from "passport-github2";
import { findOrCreateUser } from "../controllers/controlUsers.js";

//options config
const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
};

// verify function for GitHub OAuth strategy
const verify = async (accessToken, refreshToken, profile, callback) => {
  const {
    _json: { id, login, avatar_url },
  } = profile;

  try {
    const user = await findOrCreateUser({
      githubId: id,
      username: login,
      avatarUrl: avatar_url,
      accessToken,
    });

    return callback(null, user);
  } catch (error) {
    return callback(error);
  }
};

export const GitHub = new GitHubStrategy(options, verify);
