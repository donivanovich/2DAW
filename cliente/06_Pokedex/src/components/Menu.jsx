import "../styles/menu.css";

import { useNavigate, Link } from "react-router-dom";
import { useState, useMemo } from "react";

import CloseIcon from "./icons/CloseIcon";
import DashIcon from "./icons/DashIcon";
import { typeColors } from "../constants/typeColours.js";
import { typeColorsDark } from "../constants/typeColoursDark.js";
import { translateType } from "../constants/types.js";

function Menu({
  setMenuOpen,
  onLogout,
  team = [],
  pokemons = [],
  toggleTeam,
  clearTeam,
  favorites = []
}) {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      return storedUser
        ? JSON.parse(storedUser)
        : {
            image: "/favicon.svg",
            fullName: "Entrenador Pokémon",
            username: "entrenador"
          };
    } catch {
      return {
        image: "/favicon.svg",
        fullName: "Entrenador Pokémon",
        username: "entrenador"
      };
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");

    if (onLogout) onLogout();

    navigate("/login");
  };

  const teamPokemons = useMemo(() => {
    return team
      .map((id) => pokemons.find((p) => p.id === id))
      .filter(Boolean);
  }, [team, pokemons]);

  const teamTypes = useMemo(() => {
    const set = new Set();
    teamPokemons.forEach((p) => p.types.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [teamPokemons]);

  const slots = [0, 1, 2, 3, 4, 5];

  return (
    <aside className="menu" aria-label="Perfil de entrenador y equipo">
      <div className="menu-header">
        <span className="menu-header-title">Entrenador</span>
        <button
          type="button"
          className="close-menu"
          onClick={setMenuOpen}
          aria-label="Cerrar menú de entrenador"
        >
          <CloseIcon width={16} height={16} fill="currentColor" className="icon" />
        </button>
      </div>

      <div className="menu-body">
        {user && (
          <div className="menu-user">
            <div className="menu-avatar-wrapper">
              <img
                src={user.image}
                alt={user.fullName}
                className="menu-user-image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/favicon.svg";
                }}
              />
              <span className="trainer-status-dot" title="Entrenador en línea" />
            </div>
            <p className="menu-user-name">{user.fullName}</p>
            <p className="menu-user-username">@{user.username}</p>

            <div className="trainer-stats-bar">
              <div className="trainer-stat-item">
                <span className="trainer-stat-value">{team.length}/6</span>
                <span className="trainer-stat-label">Equipo</span>
              </div>
              <div className="trainer-stat-divider" />
              <div className="trainer-stat-item">
                <span className="trainer-stat-value">{favorites.length}</span>
                <span className="trainer-stat-label">Favoritos</span>
              </div>
            </div>
          </div>
        )}

        <div className="team-section">
          <div className="team-section-header">
            <div>
              <h3 className="team-section-title">Tu Equipo</h3>
              <p className="team-section-subtitle">Selecciona hasta 6 Pokémon</p>
            </div>
            <div className="team-header-right">
              <span className="team-count-pill">{team.length} / 6</span>
              {team.length > 0 && clearTeam && (
                <button
                  type="button"
                  className="team-clear-btn"
                  onClick={clearTeam}
                  title="Retirar todos los Pokémon del equipo"
                >
                  Vaciar
                </button>
              )}
            </div>
          </div>

          <div className="team">
            {slots.map((slotIndex) => {
              const pokemon = teamPokemons[slotIndex];

              if (!pokemon) {
                return (
                  <div key={`empty-${slotIndex}`} className="team-slot empty">
                    <span className="empty-slot-number">0{slotIndex + 1}</span>
                    <span className="empty-slot-label">Vacío</span>
                  </div>
                );
              }

              const primaryType = pokemon.types[0];
              const primaryColor = typeColors[primaryType] || "#8E97A0";

              return (
                <div
                  key={pokemon.id}
                  className="team-slot filled"
                  style={{ "--slot-color": primaryColor }}
                >
                  <button
                    type="button"
                    className="team-slot-remove"
                    onClick={() => toggleTeam(pokemon.id)}
                    title={`Quitar a ${pokemon.name} del equipo`}
                    aria-label={`Quitar a ${pokemon.name} del equipo`}
                  >
                    <DashIcon size={14} color="currentColor" />
                  </button>

                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                    alt={pokemon.name}
                    className="team-pokemon"
                    onClick={() => toggleTeam(pokemon.id)}
                    title={`Haz clic para quitar a ${pokemon.name} del equipo`}
                  />

                  <Link
                    to={`/pokemon/${pokemon.id}`}
                    className="team-slot-info"
                    onClick={() => {
                      if (window.innerWidth <= 1100 && setMenuOpen) {
                        setMenuOpen();
                      }
                    }}
                  >
                    <span className="team-slot-id">
                      #{String(pokemon.id).padStart(3, "0")}
                    </span>
                    <span className="team-slot-name">{pokemon.name}</span>
                  </Link>
                </div>
              );
            })}
          </div>

          {teamTypes.length > 0 && (
            <div className="team-coverage-box">
              <span className="coverage-title">
                Cobertura de Tipos ({teamTypes.length})
              </span>
              <div className="coverage-badges">
                {teamTypes.map((type) => (
                  <span
                    key={type}
                    className="coverage-type-pill"
                    style={{
                      backgroundColor: typeColorsDark[type] || "#475569"
                    }}
                  >
                    {translateType(type)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="menu-footer">
        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Menu;
