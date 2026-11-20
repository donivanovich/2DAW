import "../styles/header.css";

import { useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import FunnelIcon from "./icons/FunnelIcon.jsx";
import PersonIcon from "./icons/PersonIcon.jsx";
import HeartFillIcon from "./icons/HeartFillIcon.jsx";
import { typeColors } from "../constants/typeColours.js";
import { translateType } from "../constants/types.js";

function Header({
  searchTerm = "",
  setSearchTerm,
  setFiltersOpen,
  setMenuOpen,
  filters = { type: "all", collection: "all", sortBy: "id-asc" },
  setFilters,
  region = 1,
  setRegion,
  selectedRegion,
  totalCount = 0,
  favoritesCount = 0,
  teamCount = 0,
  resetFilters
}) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "SELECT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCollectionChange = (collectionValue) => {
    if (!setFilters) return;
    setFilters((prev) => ({
      ...prev,
      collection: prev.collection === collectionValue ? "all" : collectionValue
    }));
  };

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    (filters?.type && filters.type !== "all") ||
    (filters?.collection && filters.collection !== "all");

  const activeFilterCount =
    (filters?.type && filters.type !== "all" ? 1 : 0) +
    (filters?.collection && filters.collection !== "all" ? 1 : 0) +
    (region !== "all" ? 1 : 0);

  return (
    <header className="header-container">
      <div className="header-inner">
        <div className="header-menu">
          <button
            type="button"
            className="header-drawer-btn btn-left"
            onClick={setFiltersOpen}
            aria-label="Abrir menú de filtros"
          >
            <FunnelIcon width={18} height={18} className="icon" />
            <span className="drawer-btn-label">Filtros</span>
            {activeFilterCount > 0 && (
              <span className="drawer-badge">{activeFilterCount}</span>
            )}
          </button>

          <div className="header-brand">
            <img src={logo} alt="Logo de Pokémon" className="header-logo" />
            <div className="header-brand-meta">
              <span className="header-badge-dex">POKÉDEX NACIONAL</span>
            </div>
          </div>

          <div className="header-quick-nav" role="group" aria-label="Filtro rápido de colección">
            <button
              type="button"
              className={`quick-nav-pill ${(!filters.collection || filters.collection === "all") ? "active" : ""}`}
              onClick={() => setFilters && setFilters((prev) => ({ ...prev, collection: "all" }))}
            >
              Todos
            </button>
            <button
              type="button"
              className={`quick-nav-pill ${filters.collection === "favorites" ? "active" : ""}`}
              onClick={() => handleCollectionChange("favorites")}
            >
              <HeartFillIcon size={13} color={filters.collection === "favorites" ? "#ffffff" : "#e3350d"} />
              <span>Favoritos</span>
              <span className="quick-nav-count">{favoritesCount}</span>
            </button>
            <button
              type="button"
              className={`quick-nav-pill ${filters.collection === "team" ? "active" : ""}`}
              onClick={() => handleCollectionChange("team")}
            >
              <span>Mi Equipo</span>
              <span className="quick-nav-count">{teamCount}/6</span>
            </button>
          </div>

          <button
            type="button"
            className="header-drawer-btn btn-right"
            onClick={setMenuOpen}
            aria-label="Abrir perfil de entrenador y equipo"
          >
            <PersonIcon width={18} height={18} className="icon" />
            <span className="drawer-btn-label">Equipo</span>
            <span className="drawer-badge team-badge">{teamCount}/6</span>
          </button>
        </div>

        <div className="header-search-row">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Buscar Pokémon por nombre o número (ej. Pikachu, 25)..."
              aria-label="Buscar Pokémon por nombre o número"
              value={searchTerm}
              onChange={handleChange}
            />

            {searchTerm ? (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearchTerm("");
                  searchInputRef.current?.focus();
                }}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            ) : (
              <kbd className="search-shortcut" aria-hidden="true">/</kbd>
            )}
          </div>
        </div>

        <div className="header-status-bar">
          <div className="status-summary">
            <span className="status-count">
              Pokémons: <strong>{totalCount}</strong>
            </span>

            <div className="active-chips">
              {selectedRegion ? (
                <span className="filter-chip region-chip">
                  <span className="chip-label">Región:</span>
                  <strong>{selectedRegion.name}</strong>
                  <span className="chip-range">
                    #{String(selectedRegion.first_pokemon_id).padStart(3, "0")}–#{String(selectedRegion.last_pokemon_id).padStart(3, "0")}
                  </span>
                  {setRegion && (
                    <button
                      type="button"
                      className="chip-remove"
                      onClick={() => setRegion("all")}
                      title="Mostrar todas las regiones"
                      aria-label="Quitar filtro de región y mostrar todas las regiones"
                    >
                      ×
                    </button>
                  )}
                </span>
              ) : (
                <span className="filter-chip region-chip">
                  <strong>Todas las regiones</strong>
                  <span className="chip-range">0001–1025</span>
                </span>
              )}

              {filters?.type && filters.type !== "all" && (
                <span className="filter-chip type-chip">
                  <span
                    className="chip-type-dot"
                    style={{ backgroundColor: typeColors[filters.type] || "#64748b" }}
                  />
                  <strong>{translateType(filters.type)}</strong>
                  {setFilters && (
                    <button
                      type="button"
                      className="chip-remove"
                      onClick={() => setFilters((prev) => ({ ...prev, type: "all" }))}
                      aria-label={`Quitar filtro de tipo ${translateType(filters.type)}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              )}

              {filters?.collection && filters.collection !== "all" && (
                <span className="filter-chip collection-chip">
                  <strong>{filters.collection === "favorites" ? "Favoritos" : "Mi Equipo"}</strong>
                  {setFilters && (
                    <button
                      type="button"
                      className="chip-remove"
                      onClick={() => setFilters((prev) => ({ ...prev, collection: "all" }))}
                      aria-label="Quitar filtro de colección"
                    >
                      ×
                    </button>
                  )}
                </span>
              )}
            </div>
          </div>

          {hasActiveFilters && resetFilters && (
            <button
              type="button"
              className="reset-filters-link"
              onClick={resetFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
