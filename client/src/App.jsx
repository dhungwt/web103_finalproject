import { useEffect, useState } from "react";
import { useRoutes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LocationFormPage from "./pages/LocationFormPage";
import LocationDetailPage from "./pages/LocationDetailPage";
import LoginPage from "./pages/LoginPage";
import Avatar from "./components/Avatar";
import { getCurrentUser, logout } from "./services/authApi";
import "./css/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/locations/add", element: <LocationFormPage /> },
    { path: "/locations/:id/edit", element: <LocationFormPage /> },
    { path: "/locations/:id", element: <LocationDetailPage /> },
  ]);

  if (loading) {
    return <p className="status">Loading...</p>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-logo">
          <h1>Slice of Life 🍰</h1>
        </Link>

        <div className="app-header__auth">
          <Avatar className="avatar" user={user} />
          <button className="headerBtn" onClick={logout}>
            Log Out
          </button>
        </div>
      </header>

      <main className="app-main">{element}</main>
    </div>
  );
}

export default App;
