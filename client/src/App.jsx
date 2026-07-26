import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LocationFormPage from "./pages/LocationFormPage";
import LocationDetailPage from "./pages/LocationDetailPage";
import "./css/App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-logo">
          Slice of Life 🍰
        </Link>
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
