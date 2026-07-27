import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LocationFormPage from "./pages/LocationFormPage";
import LocationDetailPage from "./pages/LocationDetailPage";
import Avatar from "./components/Avatar";
import { GITHUB_LOGIN_URL, getCurrentUser, logout } from "./services/authApi";
import "./css/App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-logo">
          Slice of Life 🍰
        </Link>

        <div className="app-header__auth">
          {user ? (
            <>
              <Avatar className="avatar" user={user} />
              <button className="headerBtn" onClick={logout}>
                Log Out
              </button>
            </>
          ) : (
            <a className="headerBtn" href={GITHUB_LOGIN_URL}>
              Log In
            </a>
          )}
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/locations/add" element={<LocationFormPage />} />
          <Route path="/locations/:id/edit" element={<LocationFormPage />} />
          <Route path="/locations/:id" element={<LocationDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
