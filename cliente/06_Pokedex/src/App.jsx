import './styles/App.css';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import { pokemonTypes } from "./constants/types.js";
import jsonPokemon from "./mocks/pokemon.json";
import jsonRegions from "./mocks/regions.json";

import Pokemon from "./components/Pokemon.jsx";
import Filters from "./components/Filters.jsx";
import Header from "./components/Header.jsx";
import Menu from './components/Menu.jsx';
import Details from './components/Details.jsx';
import Login from './components/Login.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("loggedIn") === "true"
  );

  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [pokemons] = useState(jsonPokemon);
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState(1);
  const [filters, setFilters] = useState({
    type: 'all',
    collection: 'all',
    sortBy: 'id-asc'
  });

  const [team, setTeam] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("team")) || [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setFiltersOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTeam = useCallback((id) => {
    setTeam((prevTeam) => {
      let updatedTeam;
      if (prevTeam.includes(id)) {
        updatedTeam = prevTeam.filter((p) => p !== id);
      } else {
        if (prevTeam.length >= 6) {
          showToast("Tu equipo está completo (6/6). Retira un Pokémon para añadir otro.");
          return prevTeam;
        }
        updatedTeam = [...prevTeam, id];
      }
      localStorage.setItem("team", JSON.stringify(updatedTeam));
      return updatedTeam;
    });
  }, [showToast]);

  const clearTeam = useCallback(() => {
    setTeam([]);
    localStorage.setItem("team", JSON.stringify([]));
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prevFavs) => {
      const updatedFavorites = prevFavs.includes(id)
        ? prevFavs.filter((favId) => favId !== id)
        : [...prevFavs, id];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setFilters({
      type: 'all',
      collection: 'all',
      sortBy: 'id-asc'
    });
  }, []);

  const selectedRegion = useMemo(() => {
    return jsonRegions.regions.find((r) => r.id === Number(region));
  }, [region]);

  const filteredPokemons = useMemo(() => {
    const cleanQuery = searchTerm.trim().toLowerCase();
    const numericQuery = cleanQuery.startsWith("#")
      ? cleanQuery.slice(1).replace(/^0+/, "")
      : cleanQuery.replace(/^0+/, "");

    const list = pokemons.filter((pokemon) => {
      const matchesType =
        filters.type === "all" || pokemon.types.includes(filters.type);

      const matchesSearch =
        !cleanQuery ||
        pokemon.name.toLowerCase().includes(cleanQuery) ||
        String(pokemon.id) === numericQuery ||
        String(pokemon.id).padStart(3, "0").includes(cleanQuery.replace("#", ""));

      const matchesRegion =
        region === "all" ||
        (selectedRegion &&
          pokemon.id >= selectedRegion.first_pokemon_id &&
          pokemon.id <= selectedRegion.last_pokemon_id);

      const matchesCollection =
        !filters.collection ||
        filters.collection === "all" ||
        (filters.collection === "favorites" && favorites.includes(pokemon.id)) ||
        (filters.collection === "team" && team.includes(pokemon.id));

      return matchesType && matchesSearch && matchesRegion && matchesCollection;
    });

    const sortBy = filters.sortBy || "id-asc";
    if (sortBy === "id-desc") {
      return [...list].sort((a, b) => b.id - a.id);
    }
    if (sortBy === "name-asc") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "name-desc") {
      return [...list].sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [pokemons, filters, searchTerm, region, selectedRegion, favorites, team]);

  return (
    <>
      {toastMessage && (
        <div className="app-toast" role="status" aria-live="polite">
          <span className="app-toast-dot" />
          <span>{toastMessage}</span>
          <button
            type="button"
            className="app-toast-close"
            onClick={() => setToastMessage(null)}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />

        <Route
          path="/"
          element={
            isLoggedIn ? (
              <div className="app-container">
                {(isFiltersOpen || isMenuOpen) && (
                  <div
                    className="overlay"
                    aria-hidden="true"
                    onClick={() => {
                      setFiltersOpen(false);
                      setMenuOpen(false);
                    }}
                  />
                )}

                <div className={`filters-container ${isFiltersOpen ? "open" : ""}`}>
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    pokemonTypes={pokemonTypes}
                    regions={jsonRegions.regions}
                    region={region}
                    setRegion={setRegion}
                    setFiltersOpen={() => setFiltersOpen(false)}
                    resetFilters={resetFilters}
                    totalResults={filteredPokemons.length}
                  />
                </div>

                <div className="pokemon-container">
                  <Header
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setFiltersOpen={() => setFiltersOpen(true)}
                    setMenuOpen={() => setMenuOpen(true)}
                    filters={filters}
                    setFilters={setFilters}
                    region={region}
                    setRegion={setRegion}
                    selectedRegion={selectedRegion}
                    totalCount={filteredPokemons.length}
                    favoritesCount={favorites.length}
                    teamCount={team.length}
                    resetFilters={resetFilters}
                  />
                  <Pokemon
                    pokemons={filteredPokemons}
                    team={team}
                    toggleTeam={toggleTeam}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    resetFilters={resetFilters}
                    setRegion={setRegion}
                    region={region}
                  />
                </div>

                <div className={`menu-container ${isMenuOpen ? "open" : ""}`}>
                  <Menu
                    setMenuOpen={() => setMenuOpen(false)}
                    onLogout={() => setIsLoggedIn(false)}
                    team={team}
                    pokemons={pokemons}
                    toggleTeam={toggleTeam}
                    clearTeam={clearTeam}
                    favorites={favorites}
                  />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/pokemon/:id"
          element={
            isLoggedIn ? (
              <Details
                team={team}
                toggleTeam={toggleTeam}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
