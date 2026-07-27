import { GITHUB_LOGIN_URL } from "../services/authApi";
import "../css/LoginPage.css";

function LoginPage() {
  return (
    <div className="login-page">
      <h1 className="login-page__logo">Slice of Life 🍰</h1>
      <p className="login-page__tagline">
        Track the bakeries, cafés, and treats on your bucket list.
      </p>
      <a href={GITHUB_LOGIN_URL}>
        <button className="headerBtn">🔒 Login via GitHub</button>
      </a>
    </div>
  );
}

export default LoginPage;
