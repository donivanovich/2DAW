import "../styles/pokemon.css";

import { Link } from "react-router-dom";
import { useState } from "react";

import { typeColors } from "../constants/typeColours.js";
import { typeColorsDark } from "../constants/typeColoursDark.js";
import { translateType } from "../constants/types.js";

import HeartIcon from "./icons/HeartIcon.jsx";
import HeartFillIcon from "./icons/HeartFillIcon.jsx";
import DashIcon from "./icons/DashIcon.jsx";
import PlusIcon from "./icons/PlusIcon.jsx";

function Pokemon({
  pokemons = [],
  team = [],
  toggleTeam,
  favorites: externalFavorites,
  toggleFavorite: externalToggleFavorite,
  resetFilters,
  setRegion,
  region
}) {
  const [localFavorites, setLocalFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch {
      return [];
    }
  });

  const favorites = externalFavorites ?? localFavorites;

  const toggleFavorite = (id) => {
    if (externalToggleFavorite) {
      externalToggleFavorite(id);
      return;
    }
    const updatedFavorites = localFavorites.includes(id)
      ? localFavorites.filter((favId) => favId !== id)
      : [...localFavorites, id];
    setLocalFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (pokemons.length === 0) {
    return (
      <main className="pokedex-main">
        <div className="pokedex-empty-state">
          <div className="empty-pokeball-icon" aria-hidden="true">
            <svg viewBox="0 0 100 100" width="64" height="64">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
              <path d="M5,50 L95,50" stroke="currentColor" strokeWidth="5" />
              <circle cx="50" cy="50" r="14" fill="var(--bg-surface)" stroke="currentColor" strokeWidth="5" />
              <circle cx="50" cy="50" r="6" fill="currentColor" />
            </svg>
          </div>
          <h3>No se encontraron Pokémon</h3>
          <p>
            No hemos encontrado ningún Pokémon que coincida con tus filtros
            {region !== "all" ? " en la región seleccionada" : ""}.
          </p>
          <div className="empty-state-actions">
            {region !== "all" && setRegion && (
              <button
                type="button"
                className="empty-btn-secondary"
                onClick={() => setRegion("all")}
              >
                Buscar en todas las regiones (1–1025)
              </button>
            )}
            {resetFilters && (
              <button
                type="button"
                className="empty-btn-primary"
                onClick={resetFilters}
              >
                Limpiar los filtros
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pokedex-main">
      <ul className="pokemon-grid">
        {pokemons.map((pokemon) => {
          const primaryType = pokemon.types[0];
          const primaryColor = typeColors[primaryType] || "#8E97A0";
          const primaryDark = typeColorsDark[primaryType] || "#6C757F";
          const isFavorite = favorites.includes(pokemon.id);
          const isInTeam = team.includes(pokemon.id);
          const formattedId = `#${String(pokemon.id).padStart(4, "0")}`;

          return (
            <li
              key={pokemon.id}
              className={`pokemon-card ${isInTeam ? "in-team" : ""}`}
              style={{
                "--card-type-color": primaryColor,
                "--card-type-dark": primaryDark
              }}
            >
              <div className="pokemon-card-actions">
                <button
                  type="button"
                  className={`team-container ${isInTeam ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (toggleTeam) toggleTeam(pokemon.id);
                  }}
                  title={isInTeam ? `Quitar a ${pokemon.name} del equipo` : `Añadir a ${pokemon.name} al equipo`}
                  aria-label={isInTeam ? `Quitar a ${pokemon.name} del equipo` : `Añadir a ${pokemon.name} al equipo`}
                  aria-pressed={isInTeam}
                >
                  {isInTeam ? (
                    <>
                      <DashIcon size={16} color="currentColor" />
                      <span className="team-btn-text">En tu equipo</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon size={16} color="currentColor" />
                      <span className="team-btn-text">Equipo</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={`heart-container ${isFavorite ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(pokemon.id);
                  }}
                  title={isFavorite ? `Quitar a ${pokemon.name} de favoritos` : `Añadir a ${pokemon.name} a favoritos`}
                  aria-label={isFavorite ? `Quitar a ${pokemon.name} de favoritos` : `Añadir a ${pokemon.name} a favoritos`}
                  aria-pressed={isFavorite}
                >
                  {isFavorite ? (
                    <HeartFillIcon size={14} color="#e3350d" />
                  ) : (
                    <HeartIcon size={14} color="currentColor" />
                  )}
                </button>
              </div>

              <Link
                to={`/pokemon/${pokemon.id}`}
                className="pokemon-card-link"
              >
                <div className="pokemon-card-stage">
                  <svg
                    className="stage-pokeball-watermark"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    <path
                      d="M50 5 A45 45 0 0 1 93.5 38 L66 38 A18 18 0 0 0 34 38 L6.5 38 A45 45 0 0 1 50 5 Z"
                      fill="currentColor"
                    />
                    <circle cx="50" cy="50" r="11" fill="currentColor" />
                    <path
                      d="M50 95 A45 45 0 0 1 6.5 62 L34 62 A18 18 0 0 0 66 62 L93.5 62 A45 45 0 0 1 50 95 Z"
                      fill="currentColor"
                    />
                  </svg>

                  <img
                    className="pokemon-card-sprite"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                    }}
                    alt={pokemon.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="pokemon-card-body">
                  <div className="pokemon-card-title-row">
                    <h5 className="pokemon-card-id">{formattedId}</h5>
                    <h4 className="pokemon-card-name">{pokemon.name}</h4>
                  </div>

                  <div className="types-container">
                    {pokemon.types.map((type, index) => (
                      <span
                        key={index}
                        className="type-badge"
                        style={{
                          backgroundColor: typeColorsDark[type] || "#555"
                        }}
                      >
                        {translateType(type)}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default Pokemon;
