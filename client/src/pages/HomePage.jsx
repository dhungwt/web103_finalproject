import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getLocations } from "../services/locationsApi";
import { getTags } from "../services/tagsApi";
import LocationCard from "../components/LocationCard";
import "../css/HomePage.css";

const VISITED_FILTERS = [
  { value: "all", label: "All" },
  { value: "visited", label: "Visited" },
  { value: "want", label: "Want to go" },
];

function HomePage() {
  const [locations, setLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTagId, setActiveTagId] = useState(null);
  const [visitedFilter, setVisitedFilter] = useState("all");

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);
  const filterMenuRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [locationData, tagData] = await Promise.all([
          getLocations(),
          getTags(),
        ]);
        setLocations(locationData);
        setTags(tagData);
      } catch (err) {
        console.error(err);
        setError("Could not load your bucket list. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!filterMenuOpen) return;

    const handleClickOutside = (e) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setFilterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterMenuOpen]);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesTag =
        activeTagId === null ||
        (location.tags || []).some((tag) => tag.id === activeTagId);

      const matchesVisited =
        visitedFilter === "all" ||
        (visitedFilter === "visited" && location.visited) ||
        (visitedFilter === "want" && !location.visited);

      return matchesTag && matchesVisited;
    });
  }, [locations, activeTagId, visitedFilter]);

  const isAllActive = visitedFilter === "all" && activeTagId === null;
  const activeFilterCount =
    (visitedFilter !== "all" ? 1 : 0) + (activeTagId !== null ? 1 : 0);

  const clearFilters = () => {
    setVisitedFilter("all");
    setActiveTagId(null);
    setFilterCategory(null);
    setFilterMenuOpen(false);
  };

  const toggleFilterMenu = () => {
    setFilterMenuOpen((prev) => !prev);
  };

  if (loading) {
    return <p className="status">Loading your bucket list...</p>;
  }

  if (error) {
    return <p className="status status--error">{error}</p>;
  }

  return (
    <section>
      <div className="page-heading">
        <h2>Your Bucket List</h2>
        <p>
          {filteredLocations.length}{" "}
          {filteredLocations.length === 1 ? "place" : "places"} saved
        </p>
        <Link to="/locations/add" className="page-heading__add headerBtn">
          + Add Location
        </Link>
      </div>

      <div className="filter-bar">
        <button
          type="button"
          className={isAllActive ? "tag-chip tag-chip--active" : "tag-chip"}
          onClick={clearFilters}
        >
          All
        </button>

        <div className="filter-menu" ref={filterMenuRef}>
          <button
            type="button"
            className={
              activeFilterCount > 0 ? "tag-chip tag-chip--active" : "tag-chip"
            }
            onClick={toggleFilterMenu}
          >
            Filter by{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""} ▾
          </button>

          {filterMenuOpen && (
            <div className="filter-menu__panel">
              {filterCategory === null && (
                <>
                  <button
                    type="button"
                    className="filter-menu__item"
                    onClick={() => setFilterCategory("visited")}
                  >
                    Visit Status
                  </button>
                  <button
                    type="button"
                    className="filter-menu__item"
                    onClick={() => setFilterCategory("tags")}
                    disabled={tags.length === 0}
                  >
                    Tags
                  </button>
                </>
              )}

              {filterCategory === "visited" && (
                <>
                  <button
                    type="button"
                    className="filter-menu__back"
                    onClick={() => setFilterCategory(null)}
                  >
                    ← Back
                  </button>
                  <div className="filter-menu__options">
                    {VISITED_FILTERS.map((filter) => (
                      <button
                        key={filter.value}
                        type="button"
                        className={
                          visitedFilter === filter.value
                            ? "tag-chip tag-chip--active"
                            : "tag-chip"
                        }
                        onClick={() => setVisitedFilter(filter.value)}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {filterCategory === "tags" && (
                <>
                  <button
                    type="button"
                    className="filter-menu__back"
                    onClick={() => setFilterCategory(null)}
                  >
                    ← Back
                  </button>
                  <div className="filter-menu__options">
                    <button
                      type="button"
                      className={
                        activeTagId === null
                          ? "tag-chip tag-chip--active"
                          : "tag-chip"
                      }
                      onClick={() => setActiveTagId(null)}
                    >
                      All tags
                    </button>
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        className={
                          activeTagId === tag.id
                            ? "tag-chip tag-chip--active"
                            : "tag-chip"
                        }
                        onClick={() =>
                          setActiveTagId((prev) =>
                            prev === tag.id ? null : tag.id,
                          )
                        }
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {locations.length === 0 ? (
        <p className="status">
          No places yet. Add your first bakery to get started!
        </p>
      ) : filteredLocations.length === 0 ? (
        <p className="status">No places match these filters.</p>
      ) : (
        <div className="location-grid">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;
