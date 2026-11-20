import "../styles/details.css";

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import { typeColors } from "../constants/typeColours.js";
import { typeColorsDark } from "../constants/typeColoursDark.js";
import { translateType } from "../constants/types.js";
import jsonDetails from "../mocks/details.json";
import jsonPokemon from "../mocks/pokemon.json";
import jsonRegions from "../mocks/regions.json";
import jsonTypes from "../mocks/types.json";

import Stats from "./Stats.jsx";
import Physical from "./Physical.jsx";
import Evolutions from "./Evolutions.jsx";
import HeartIcon from "./icons/HeartIcon.jsx";
import HeartFillIcon from "./icons/HeartFillIcon.jsx";
import PlusIcon from "./icons/PlusIcon.jsx";
import DashIcon from "./icons/DashIcon.jsx";

function Details({
  team = [],
  toggleTeam,
  favorites = [],
  toggleFavorite
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);

  const pokemon = useMemo(
    () => jsonPokemon.find((p) => p.id === numericId),
    [numericId]
  );
  const detail = useMemo(
    () => jsonDetails.details.find((d) => String(d.id) === String(id)),
    [id]
  );

  const [activeTab, setActiveTab] = useState("stats");
  const [spriteMode, setSpriteMode] = useState("artwork");

  const prevPokemon = useMemo(
    () => jsonPokemon.find((p) => p.id === numericId - 1),
    [numericId]
  );
  const nextPokemon = useMemo(
    () => jsonPokemon.find((p) => p.id === numericId + 1),
    [numericId]
  );

  const pokemonRegion = useMemo(() => {
    if (!pokemon) return null;
    return jsonRegions.regions.find(
      (r) => pokemon.id >= r.first_pokemon_id && pokemon.id <= r.last_pokemon_id
    );
  }, [pokemon]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && prevPokemon) {
        navigate(`/pokemon/${prevPokemon.id}`);
      } else if (e.key === "ArrowRight" && nextPokemon) {
        navigate(`/pokemon/${nextPokemon.id}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevPokemon, nextPokemon, navigate]);

  const typeEffectiveness = useMemo(() => {
    if (!pokemon) return null;
    const allTypeKeys = Object.keys(jsonTypes.types);
    const weaknesses = [];
    const resistances = [];
    const immunities = [];
    const strongAgainstSet = new Set();

    pokemon.types.forEach((t) => {
      const tData = jsonTypes.types[t.toLowerCase()];
      if (tData?.strong_against) {
        tData.strong_against.forEach((target) => strongAgainstSet.add(target));
      }
    });

    allTypeKeys.forEach((atkType) => {
      let multiplier = 1;
      pokemon.types.forEach((defType) => {
        const defData = jsonTypes.types[defType.toLowerCase()];
        if (!defData) return;
        if (defData.immune_to?.includes(atkType)) {
          multiplier *= 0;
        } else if (defData.weak_against?.includes(atkType)) {
          multiplier *= 2;
        } else if (defData.resistant_to?.includes(atkType)) {
          multiplier *= 0.5;
        }
      });

      const formattedType = atkType.charAt(0).toUpperCase() + atkType.slice(1);
      if (multiplier === 0) {
        immunities.push({ type: formattedType, label: "0×" });
      } else if (multiplier > 1) {
        weaknesses.push({ type: formattedType, label: `${multiplier}×`, multiplier });
      } else if (multiplier < 1) {
        resistances.push({
          type: formattedType,
          label: multiplier === 0.25 ? "¼×" : "½×",
          multiplier
        });
      }
    });

    weaknesses.sort((a, b) => b.multiplier - a.multiplier);
    resistances.sort((a, b) => a.multiplier - b.multiplier);

    const strongAgainst = Array.from(strongAgainstSet).map(
      (t) => t.charAt(0).toUpperCase() + t.slice(1)
    );

    return { weaknesses, resistances, immunities, strongAgainst };
  }, [pokemon]);

  if (!pokemon || !detail) {
    return (
      <div className="details-page-shell">
        <div className="details-not-found">
          <h2>No se encontró el Pokémon.</h2>
          <p>El Pokémon que buscas no existe en la Pokédex Nacional.</p>
          <Link to="/" className="details-back-btn">
            ← Volver a la Pokédex
          </Link>
        </div>
      </div>
    );
  }

  const primaryType = pokemon.types[0];
  const backgroundColor = typeColors[primaryType] || "#8E97A0";
  const backgroundColorDark = typeColorsDark[primaryType] || "#555";
  const isFavorite = favorites.includes(pokemon.id);
  const isInTeam = team.includes(pokemon.id);
  const formattedId = `#${String(pokemon.id).padStart(4, "0")}`;

  const getSpriteUrl = () => {
    if (spriteMode === "sprite") {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }
    if (spriteMode === "shiny") {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  return (
    <div
      className="details-page-shell"
      style={{
        "--detail-color": backgroundColor,
        "--detail-color-dark": backgroundColorDark
      }}
    >
      <header className="details-topbar">
        <Link to="/" className="details-back-btn">
          <svg
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
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Volver a la Pokédex</span>
        </Link>

        <nav className="details-pagination" aria-label="Navegación entre Pokémon adyacentes">
          {prevPokemon ? (
            <Link
              to={`/pokemon/${prevPokemon.id}`}
              className="details-nav-pill prev"
              title={`Anterior: ${prevPokemon.name}`}
            >
              <span className="nav-arrow">←</span>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${prevPokemon.id}.png`}
                alt={prevPokemon.name}
                className="nav-mini-sprite"
              />
              <span className="nav-poke-meta">
                <span className="nav-poke-id">#{String(prevPokemon.id).padStart(3, "0")}</span>
                <span className="nav-poke-name">{prevPokemon.name}</span>
              </span>
            </Link>
          ) : (
            <span className="details-nav-pill disabled">Primer Pokémon</span>
          )}

          {nextPokemon ? (
            <Link
              to={`/pokemon/${nextPokemon.id}`}
              className="details-nav-pill next"
              title={`Siguiente: ${nextPokemon.name}`}
            >
              <span className="nav-poke-meta right">
                <span className="nav-poke-id">#{String(nextPokemon.id).padStart(3, "0")}</span>
                <span className="nav-poke-name">{nextPokemon.name}</span>
              </span>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nextPokemon.id}.png`}
                alt={nextPokemon.name}
                className="nav-mini-sprite"
              />
              <span className="nav-arrow">→</span>
            </Link>
          ) : (
            <span className="details-nav-pill disabled">Último Pokémon</span>
          )}
        </nav>
      </header>

      <main className="details-container">
        <div
          className="card-container"
          style={{
            background: `linear-gradient(155deg, ${backgroundColor} 0%, ${backgroundColorDark} 100%)`
          }}
        >
          <svg
            className="details-pokeball-bg"
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

          <div className="details-hero-top">
            <div className="details-badges-left">
              <span className="details-dex-pill">{formattedId}</span>
              {pokemonRegion && (
                <span className="details-region-pill">{pokemonRegion.name}</span>
              )}
            </div>

            <div className="details-hero-actions">
              {toggleFavorite && (
                <button
                  type="button"
                  className={`details-action-btn ${isFavorite ? "active-fav" : ""}`}
                  onClick={() => toggleFavorite(pokemon.id)}
                  aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                  aria-pressed={isFavorite}
                >
                  {isFavorite ? (
                    <HeartFillIcon size={16} color="#e3350d" />
                  ) : (
                    <HeartIcon size={16} color="currentColor" />
                  )}
                </button>
              )}

              {toggleTeam && (
                <button
                  type="button"
                  className={`details-action-btn team-btn ${isInTeam ? "active-team" : ""}`}
                  onClick={() => toggleTeam(pokemon.id)}
                  aria-pressed={isInTeam}
                >
                  {isInTeam ? (
                    <>
                      <DashIcon size={16} color="currentColor" />
                      <span>En tu equipo</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon size={16} color="currentColor" />
                      <span>Añadir al equipo</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="pokemon-info">
            <div className="details-artwork-stage">
              <img
                key={`${id}-${spriteMode}`}
                className={`imagen ${spriteMode !== "artwork" ? "pixel-sprite" : ""}`}
                src={getSpriteUrl()}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                }}
                alt={pokemon.name}
              />
            </div>

            <div className="sprite-mode-switcher" role="group" aria-label="Modo de ilustración">
              <button
                type="button"
                className={spriteMode === "artwork" ? "active" : ""}
                onClick={() => setSpriteMode("artwork")}
              >
                Arte Oficial
              </button>
              <button
                type="button"
                className={spriteMode === "sprite" ? "active" : ""}
                onClick={() => setSpriteMode("sprite")}
              >
                Sprite
              </button>
              <button
                type="button"
                className={spriteMode === "shiny" ? "active" : ""}
                onClick={() => setSpriteMode("shiny")}
              >
                ✨ Variocolor
              </button>
            </div>

            <h2>{pokemon.name}</h2>
            <h5>#{pokemon.id}</h5>

            <div className="details-types-row">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="details-type-badge"
                  style={{
                    backgroundColor: typeColorsDark[type] || "#334155"
                  }}
                >
                  {translateType(type)}
                </span>
              ))}
            </div>
          </div>

          <div className="buttons-container" role="tablist" aria-label="Secciones de detalles del Pokémon">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "stats"}
              className={activeTab === "stats" ? "active" : ""}
              style={{
                backgroundColor: activeTab === "stats" ? "#ffffff" : backgroundColorDark,
                color: activeTab === "stats" ? backgroundColorDark : "#ffffff"
              }}
              onClick={() => setActiveTab("stats")}
            >
              Estadísticas
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "physical"}
              className={activeTab === "physical" ? "active" : ""}
              style={{
                backgroundColor: activeTab === "physical" ? "#ffffff" : backgroundColorDark,
                color: activeTab === "physical" ? backgroundColorDark : "#ffffff"
              }}
              onClick={() => setActiveTab("physical")}
            >
              Físico
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "evolutions"}
              className={activeTab === "evolutions" ? "active" : ""}
              style={{
                backgroundColor: activeTab === "evolutions" ? "#ffffff" : backgroundColorDark,
                color: activeTab === "evolutions" ? backgroundColorDark : "#ffffff"
              }}
              onClick={() => setActiveTab("evolutions")}
            >
              Evoluciones
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "other"}
              className={activeTab === "other" ? "active" : ""}
              style={{
                backgroundColor: activeTab === "other" ? "#ffffff" : backgroundColorDark,
                color: activeTab === "other" ? backgroundColorDark : "#ffffff"
              }}
              onClick={() => setActiveTab("other")}
            >
              Efectividad
            </button>
          </div>
        </div>

        <div className="info-container">
          {activeTab === "stats" && <Stats detail={detail} pokemon={pokemon} />}
          {activeTab === "physical" && <Physical detail={detail} pokemon={pokemon} />}
          {activeTab === "evolutions" && <Evolutions detail={detail} pokemon={pokemon} />}
          {activeTab === "other" && typeEffectiveness && (
            <section className="matchups-section">
              <header className="matchups-header">
                <div>
                  <h2>Efectividad de Tipos</h2>
                  <p className="matchups-subtitle">
                    Fortaleza defensiva y efectividad ofensiva de {pokemon.name} ({pokemon.types.map(translateType).join(" / ")})
                  </p>
                </div>
              </header>

              <div className="matchups-grid">
                <div className="matchup-card">
                  <div className="matchup-card-header">
                    <span className="matchup-indicator danger" />
                    <h3>Debilidades</h3>
                  </div>
                  <div className="matchup-badges">
                    {typeEffectiveness.weaknesses.length > 0 ? (
                      typeEffectiveness.weaknesses.map((item) => (
                        <span
                          key={item.type}
                          className="matchup-type-pill"
                          style={{ backgroundColor: typeColorsDark[item.type] || "#475569" }}
                        >
                          <span>{translateType(item.type)}</span>
                          <strong className="matchup-mult">{item.label}</strong>
                        </span>
                      ))
                    ) : (
                      <p className="matchup-empty">Sin debilidades</p>
                    )}
                  </div>
                </div>

                <div className="matchup-card">
                  <div className="matchup-card-header">
                    <span className="matchup-indicator success" />
                    <h3>Fuerte contra</h3>
                  </div>
                  <div className="matchup-badges">
                    {typeEffectiveness.strongAgainst.length > 0 ? (
                      typeEffectiveness.strongAgainst.map((type) => (
                        <span
                          key={type}
                          className="matchup-type-pill"
                          style={{ backgroundColor: typeColorsDark[type] || "#475569" }}
                        >
                          <span>{translateType(type)}</span>
                          <strong className="matchup-mult">2×</strong>
                        </span>
                      ))
                    ) : (
                      <p className="matchup-empty">Sin fortalezas</p>
                    )}
                  </div>
                </div>

                <div className="matchup-card">
                  <div className="matchup-card-header">
                    <span className="matchup-indicator info" />
                    <h3>Resistencias</h3>
                  </div>
                  <div className="matchup-badges">
                    {typeEffectiveness.resistances.length > 0 ? (
                      typeEffectiveness.resistances.map((item) => (
                        <span
                          key={item.type}
                          className="matchup-type-pill"
                          style={{ backgroundColor: typeColorsDark[item.type] || "#475569" }}
                        >
                          <span>{translateType(item.type)}</span>
                          <strong className="matchup-mult">{item.label}</strong>
                        </span>
                      ))
                    ) : (
                      <p className="matchup-empty">Sin resistencias</p>
                    )}
                  </div>
                </div>

                <div className="matchup-card">
                  <div className="matchup-card-header">
                    <span className="matchup-indicator neutral" />
                    <h3>Inmunidades</h3>
                  </div>
                  <div className="matchup-badges">
                    {typeEffectiveness.immunities.length > 0 ? (
                      typeEffectiveness.immunities.map((item) => (
                        <span
                          key={item.type}
                          className="matchup-type-pill"
                          style={{ backgroundColor: typeColorsDark[item.type] || "#475569" }}
                        >
                          <span>{translateType(item.type)}</span>
                          <strong className="matchup-mult">{item.label}</strong>
                        </span>
                      ))
                    ) : (
                      <p className="matchup-empty">Sin inmunidades</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Details;
