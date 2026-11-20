import "../styles/filters.css";

import CloseIcon from "./icons/CloseIcon";
import FunnelIcon from "./icons/FunnelIcon";
import { typeColors } from "../constants/typeColours.js";
import { translateType } from "../constants/types.js";

function Filters({
  filters = { type: "all", collection: "all", sortBy: "id-asc" },
  setFilters,
  pokemonTypes = [],
  regions = [],
  region = 1,
  setRegion,
  setFiltersOpen,
  resetFilters,
  totalResults
}) {
  const handleChangeType = (e) => {
    setFilters({ ...filters, type: e.target.value });
  };

  const handleSelectTypeChip = (selectedType) => {
    const nextType = filters.type === selectedType && selectedType !== "all" ? "all" : selectedType;
    setFilters({ ...filters, type: nextType });
  };

  const handleChangeRegion = (e) => {
    setRegion(e.target.value === "all" ? "all" : Number(e.target.value));
  };

  const handleChangeSort = (e) => {
    setFilters({ ...filters, sortBy: e.target.value });
  };

  const handleResetAll = () => {
    if (resetFilters) resetFilters();
    setRegion(1);
  };

  return (
    <aside className="filters" aria-label="Filtros de Pokémon">
      <div className="filters-header">
        <div className="filters-title-group">
          <span className="filters-icon-badge">
            <FunnelIcon width={15} height={15} />
          </span>
          <div>
            <h2 className="filters-title">Filtros</h2>
            {typeof totalResults === "number" && (
              <p className="filters-subtitle">Pokémons: {totalResults}</p>
            )}
          </div>
        </div>

        <div className="filters-header-actions">
          <button
            type="button"
            className="filters-reset-btn"
            onClick={handleResetAll}
            title="Restablecer todos los filtros"
          >
            Restablecer
          </button>

          <button
            type="button"
            className="close-filters"
            onClick={setFiltersOpen}
            aria-label="Cerrar panel de filtros"
          >
            <CloseIcon width={16} height={16} fill="currentColor" className="icon" />
          </button>
        </div>
      </div>

      <div className="filters-body">
        {/* Ordenación */}
        <div className="filter-section">
          <div className="input">
            <label htmlFor="sortBy">Ordenar por</label>
            <select
              id="sortBy"
              value={filters.sortBy || "id-asc"}
              onChange={handleChangeSort}
            >
              <option value="id-asc">Número Pokédex (menor a mayor)</option>
              <option value="id-desc">Número Pokédex (mayor a menor)</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Filtro de Región */}
        <div className="filter-section">
          <div className="input">
            <label htmlFor="region">Región</label>
            <select
              id="region"
              value={region}
              onChange={handleChangeRegion}
            >
              <option value="all">Todas las regiones (001–1025)</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.first_pokemon_id}–{r.last_pokemon_id})
                </option>
              ))}
            </select>
          </div>

          <div className="region-pills-list" role="group" aria-label="Selección rápida de región">
            <button
              type="button"
              className={`region-pill ${region === "all" ? "active" : ""}`}
              onClick={() => setRegion("all")}
            >
              <span className="region-pill-name">Todas</span>
              <span className="region-pill-range">1–1025</span>
            </button>
            {regions.map((r) => {
              const isActive = Number(region) === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`region-pill ${isActive ? "active" : ""}`}
                  onClick={() => setRegion(r.id)}
                >
                  <span className="region-pill-name">{r.name}</span>
                  <span className="region-pill-range">
                    {r.first_pokemon_id}–{r.last_pokemon_id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtro de Tipo */}
        <div className="filter-section">
          <div className="input">
            <label htmlFor="type">Tipos</label>
            <select
              id="type"
              value={filters.type}
              onChange={handleChangeType}
            >
              <option value="all">Todos los tipos</option>
              {pokemonTypes.map((type, index) => (
                <option key={index} value={type}>
                  {translateType(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="type-chips-grid" role="group" aria-label="Selección rápida de tipo elemental">
            <button
              type="button"
              className={`type-filter-chip ${filters.type === "all" ? "active" : ""}`}
              onClick={() => handleSelectTypeChip("all")}
            >
              <span className="type-chip-dot all-dot" />
              <span>Todos</span>
            </button>

            {pokemonTypes.map((type) => {
              const isSelected = filters.type === type;
              const color = typeColors[type] || "#64748b";
              return (
                <button
                  key={type}
                  type="button"
                  className={`type-filter-chip ${isSelected ? "active" : ""}`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: color,
                          borderColor: color,
                          color: "#ffffff"
                        }
                      : undefined
                  }
                  onClick={() => handleSelectTypeChip(type)}
                >
                  <span
                    className="type-chip-dot"
                    style={{
                      backgroundColor: isSelected ? "#ffffff" : color
                    }}
                  />
                  <span>{translateType(type)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Filters;
