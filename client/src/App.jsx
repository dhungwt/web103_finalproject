import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
